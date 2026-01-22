# Issues: 18460 - Kit Type Filter Permission Control

## Known Issues

*Brak znanych problemów w tej chwili*

## Potential Risks

1. **User Context Availability**
   - Risk: User context może nie być dostępny w KitsInventoryTableConfig
   - Mitigation: Sprawdzić przekazywanie kontekstu przez props

2. **TypeScript Errors**  
   - Risk: Zmiana sygnatury funkcji może spowodować błędy kompilacji
   - Mitigation: Sprawdzić wszystkie miejsca wywołania searchAndFilterOptions

3. **Regression Testing**
   - Risk: Istniejąca funkcjonalność może zostać uszkodzona
   - Mitigation: Przetestować wszystkie filtry po implementacji

## Technical Concerns

- Upewnić się że wzorzec uprawnień jest konsystentny z resztą aplikacji
- Sprawdzić czy AclAction.EmergencyUnblind to właściwe uprawnienie

## Notes

*Miejsce na dodatkowe notatki podczas implementacji*