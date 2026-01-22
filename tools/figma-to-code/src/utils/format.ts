import prettier from "prettier";

export async function formatTsx(source: string): Promise<string> {
  return prettier.format(source, {
    parser: "babel-ts",
    singleQuote: false,
    trailingComma: "all",
  });
}
