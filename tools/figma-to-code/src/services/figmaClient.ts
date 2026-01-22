import { promises as fs } from "fs";
import path from "path";

export interface FigmaClientOptions {
  workspaceDir?: string;
  mcpEndpoint?: string;
}

interface McpToolCallRequest {
  jsonrpc: "2.0";
  id: number;
  method: "tools/call";
  params: {
    name: string;
    arguments: Record<string, unknown>;
  };
}

interface McpToolCallResponse {
  jsonrpc: "2.0";
  id: number;
  result?: {
    content: Array<{
      type: string;
      text?: string;
    }>;
  };
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Figma MCP client - fetches code from Figma through MCP server or local files.
 */
export class FigmaClient {
  private readonly workspaceDir: string;
  private mcpEndpoint: string;
  private requestId = 0;
  private sessionId: string | null = null;
  private initialized = false;

  constructor(options: FigmaClientOptions = {}) {
    this.workspaceDir = options.workspaceDir ?? process.cwd();
    this.mcpEndpoint =
      options.mcpEndpoint ??
      process.env.MCP_FIGMA_ENDPOINT ??
      "http://127.0.0.1:3845/sse";
  }

  async fetchNodeComponent(nodeRef: string): Promise<string> {
    // Try local file first
    const localPath = this.resolveLocalPath(nodeRef);
    if (localPath) {
      console.log(`Reading from local file: ${localPath}`);
      return fs.readFile(localPath, "utf8");
    }

    // Try Figma URL - initialize MCP session first
    const nodeId = this.extractNodeId(nodeRef);
    if (nodeId) {
      console.log(`Fetching from Figma MCP: node ${nodeId}`);
      await this.ensureInitialized();
      return this.fetchFromMcp(nodeId);
    }

    throw new Error(
      `Invalid node reference: "${nodeRef}". ` +
        `Provide either a Figma URL (with node-id parameter) or a local .tsx/.jsx file path.`,
    );
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const endpointsToTry = [this.mcpEndpoint];
    const alternateEndpoint = this.getAlternateEndpoint(this.mcpEndpoint);
    if (alternateEndpoint) {
      endpointsToTry.push(alternateEndpoint);
    }

    let lastError: Error | null = null;

    for (const endpoint of endpointsToTry) {
      try {
        await this.initializeAt(endpoint);
        this.mcpEndpoint = endpoint;
        this.initialized = true;
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`MCP init failed at ${endpoint}: ${lastError.message}`);
      }
    }

    throw lastError ?? new Error("Failed to initialize MCP session");
  }

  private getAlternateEndpoint(endpoint: string): string | null {
    if (endpoint.endsWith("/mcp")) {
      return endpoint.replace(/\/mcp$/, "/sse");
    }
    if (endpoint.endsWith("/sse")) {
      return endpoint.replace(/\/sse$/, "/mcp");
    }
    return null;
  }

  private async initializeAt(endpoint: string): Promise<void> {
    console.log(`Initializing MCP session at ${endpoint}...`);

    const initRequest = {
      jsonrpc: "2.0",
      id: ++this.requestId,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {
          roots: { listChanged: true },
          sampling: {},
        },
        clientInfo: {
          name: "figma-to-code",
          version: "0.1.0",
        },
      },
    };

    const initResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "MCP-Protocol-Version": "2025-06-18",
      },
      body: JSON.stringify(initRequest),
    });

    if (!initResponse.ok) {
      throw new Error(
        `MCP initialize failed: ${initResponse.status} ${initResponse.statusText}`,
      );
    }

    // Extract sessionId from response header if present
    const sessionIdHeader = initResponse.headers.get("mcp-session-id");
    if (sessionIdHeader) {
      this.sessionId = sessionIdHeader;
      console.log(`MCP session ID: ${this.sessionId}`);
    }

    const contentType = initResponse.headers.get("content-type") || "";
    const initData = contentType.includes("text/event-stream")
      ? await this.parseSSE(initResponse)
      : await initResponse.json();

    if (initData.error) {
      throw new Error(
        `MCP initialize error [${initData.error.code}]: ${initData.error.message}`,
      );
    }

    if (initData.result?.sessionId && !this.sessionId) {
      this.sessionId = initData.result.sessionId;
    }

    console.log(
      `MCP initialized at ${endpoint}: protocol ${initData.result?.protocolVersion}`,
    );
    console.log("MCP session ready (skipping notifications/initialized)");
  }

  private async fetchFromMcp(nodeId: string): Promise<string> {
    const endpointsToTry = [this.mcpEndpoint];
    const alternate = this.getAlternateEndpoint(this.mcpEndpoint);
    if (alternate) {
      endpointsToTry.push(alternate);
    }

    let lastError: Error | null = null;

    for (const endpoint of endpointsToTry) {
      try {
        if (this.mcpEndpoint !== endpoint || !this.initialized) {
          // Reset session when switching endpoints
          this.initialized = false;
          this.sessionId = null;
          this.mcpEndpoint = endpoint;
        }

        await this.ensureInitialized();
        const text = await this.callGetCode(nodeId, endpoint);

        if (this.looksLikeFigmaXml(text)) {
          throw new Error(
            `MCP at ${endpoint} zwrócił XML (brak kodu). Spróbuję innego endpointu, jeśli dostępny.`,
          );
        }

        return text;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`get_code failed at ${endpoint}: ${lastError.message}`);
      }
    }

    throw lastError ?? new Error("Failed to fetch from any MCP endpoint");
  }

  private async callGetCode(nodeId: string, endpoint: string): Promise<string> {
    const request: McpToolCallRequest = {
      jsonrpc: "2.0",
      id: ++this.requestId,
      method: "tools/call",
      params: {
        name: "get_design_context",
        arguments: {
          nodeId,
        },
      },
    };

    console.log(`Calling get_design_context with nodeId: ${nodeId}`);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          "MCP-Protocol-Version": "2025-06-18",
          ...(this.sessionId && { "Mcp-Session-Id": this.sessionId }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`MCP error response: ${errorText}`);
        throw new Error(
          `MCP request failed: ${response.status} ${response.statusText}`,
        );
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        return this.handleJsonResponse(response);
      } else if (contentType.includes("text/event-stream")) {
        return this.handleSseResponse(response);
      }

      throw new Error(`Unexpected content type: ${contentType}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch from Figma MCP at ${this.mcpEndpoint}: ${error.message}`,
        );
      }
      throw error;
    }
  }

  private async handleJsonResponse(response: Response): Promise<string> {
    const data: McpToolCallResponse = await response.json();

    if (data.error) {
      throw new Error(`MCP error [${data.error.code}]: ${data.error.message}`);
    }

    if (!data.result?.content) {
      throw new Error("MCP response missing result content");
    }

    const textContent = data.result.content.find((c) => c.type === "text");
    if (!textContent?.text) {
      throw new Error("MCP response missing text content");
    }

    return textContent.text;
  }

  private async parseSSE(response: Response): Promise<any> {
    const text = await response.text();
    const lines = text.split("\n");

    let result: any = null;

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const jsonStr = line.slice(6);
        try {
          const data = JSON.parse(jsonStr);
          if (data.result) {
            result = data;
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }

    if (!result) {
      throw new Error("No valid result in SSE stream");
    }

    return result;
  }

  private async handleSseResponse(response: Response): Promise<string> {
    const result: McpToolCallResponse = await this.parseSSE(response);

    if (result.error) {
      throw new Error(
        `MCP error [${result.error.code}]: ${result.error.message}`,
      );
    }

    if (!result.result?.content) {
      throw new Error("MCP response missing result content");
    }

    const textContent = result.result.content.find((c) => c.type === "text");
    if (!textContent?.text) {
      throw new Error("MCP response missing text content");
    }

    return textContent.text;
  }

  private extractNodeId(ref: string): string | null {
    try {
      const url = new URL(ref);
      const param = url.searchParams.get("node-id");
      if (param) {
        return this.normalizeNodeId(decodeURIComponent(param));
      }
    } catch {
      // not a URL, fall through
    }

    // Direct node ID format: 123:456 or 123-456
    if (/^[0-9]+[:-][0-9]+$/.test(ref)) {
      return this.normalizeNodeId(ref);
    }

    const trailing = ref.match(/(\\d+)[:-](\\d+)$/);
    if (trailing) {
      return this.normalizeNodeId(`${trailing[1]}:${trailing[2]}`);
    }

    return null;
  }

  private normalizeNodeId(value: string): string {
    return value.replace(/%3a/gi, ":").replace(/-/g, ":");
  }

  private looksLikeFigmaXml(source: string): boolean {
    const trimmed = source.trim();
    if (!trimmed.startsWith("<")) {
      return false;
    }

    return (
      /<section[^>]*name=/.test(trimmed) ||
      /<frame[^>]*name=/.test(trimmed) ||
      /<text[^>]*name=/.test(trimmed)
    );
  }

  private resolveLocalPath(ref: string): string | null {
    if (ref.endsWith(".tsx") || ref.endsWith(".jsx")) {
      const absolute = path.isAbsolute(ref)
        ? ref
        : path.join(this.workspaceDir, ref);
      return absolute;
    }

    return null;
  }
}
