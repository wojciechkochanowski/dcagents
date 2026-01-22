# Moduł AUTH - Autoryzacja i Autentykacja

## Lokalizacja

`frontend/apps/datacapt/src/components/auth/`

## Opis modułu

Moduł odpowiedzialny za pełny system autoryzacji i autentykacji użytkowników w aplikacji klinicznej Datacapt.

## Struktura komponentów (14 komponentów)

### 🔐 **Główne komponenty autoryzacji**

#### **AuthRoute**

- **Plik**: `AuthRoute/AuthRoute.tsx`
- **Funkcja**: Guard do ochrony tras wymagających autoryzacji
- **Używa**: Route protection, redirect logic

#### **UserContext**

- **Plik**: `UserContext/UserContext.tsx`
- **Funkcja**: React Context dla stanu użytkownika w całej aplikacji
- **Zawiera**: User data, permissions, session state

### 📝 **Formularze logowania**

#### **SignInContent**

- **Pliki**: `SignInContent.tsx`, `SignInContent.less`
- **Funkcja**: Layout strony logowania
- **Zawiera**: Logo, nagłówek, kontener formularza

#### **SignInForm**

- **Pliki**: `SignInForm.tsx`, `SignInForm.less`
- **Funkcja**: Formularz logowania
- **Pola**: Email, hasło, "Zapamiętaj mnie"
- **Obsługa**: Walidacja, błędy, submit

### 📝 **Formularze rejestracji**

#### **SignUpContent**

- **Pliki**: `SignUpContent.tsx`, `SignUpContent.less`
- **Funkcja**: Layout strony rejestracji

#### **SignUpForm**

- **Pliki**: `SignUpForm.tsx`, `SignUpForm.less`
- **Podkatalogi**: `TermsAndConditions/`
- **Funkcja**: Formularz rejestracji nowego użytkownika
- **Pola**: Email, hasło, potwierdzenie hasła, regulamin

#### **SignUpFailContent**

- **Pliki**: `SignUpFailContent.tsx`, `SignUpFailContent.less`
- **Funkcja**: Strona błędu rejestracji

#### **SignUpOnboarding**

- **Pliki**: `SignUpOnboarding.tsx`, `SignUpOnboarding.less`
- **Funkcja**: Proces onboardingu nowych użytkowników

### 🔑 **Zarządzanie hasłami**

#### **ChangePasswordContent**

- **Pliki**: `ChangePasswordContent.tsx`, `ChangePasswordContent.less`
- **Funkcja**: Layout strony zmiany hasła

#### **ChangePasswordForm**

- **Pliki**: `ChangePasswordForm.tsx`, `ChangePasswordForm.less`
- **Funkcja**: Formularz zmiany hasła
- **Pola**: Stare hasło, nowe hasło, potwierdzenie

#### **RecoverPasswordContent**

- **Pliki**: `RecoverPasswordContent.tsx`, `RecoverPasswordContent.less`
- **Funkcja**: Layout strony odzyskiwania hasła

#### **RecoverPasswordForm**

- **Pliki**: `RecoverPasswordForm.tsx`, `RecoverPasswordForm.less`
- **Funkcja**: Formularz odzyskiwania hasła
- **Pola**: Email

#### **PasswordTooltip**

- **Pliki**: `PasswordTooltip.tsx`, `PasswordTooltip.less`
- **Funkcja**: Tooltip z wymaganiami dla hasła
- **Zawiera**: Zasady bezpieczeństwa, walidacja w czasie rzeczywistym

### 🎯 **Komponenty specjalistyczne**

#### **RecruitmentPreSign**

- **Pliki**: `RecruitmentPreSign.tsx`, `RecruitmentPreSign.less`
- **Podkatalogi**:
  - `RecruitmentPreSignForm/`
  - `RecruitmentPreSignLandingPage/`
  - `RecruitmentPreSignSwitch/`
- **Funkcja**: Przedrejestracja w systemie rekrutacji

#### **SessionTimeoutModal**

- **Pliki**: `SessionTimeoutModal.tsx`, `SessionTimeoutModal.less`
- **Funkcja**: Modal ostrzegający o wygasaniu sesji
- **Zawiera**: Licznik czasu, opcje przedłużenia

### 🎨 **Layout i UI**

#### **Layout**

- **Pliki**: `Layout.tsx`, `Layout.less`, `StyleCustomisation.tsx`
- **Funkcja**: Główny layout dla stron autoryzacji
- **Zawiera**: Responsywny design, customizacja stylu

#### **SimpleContent**

- **Pliki**: `SimpleContent.tsx`, `SimpleContent.less`
- **Funkcja**: Prosty layout dla prostych komunikatów

### 🔧 **Komponenty pomocnicze**

#### **FormInputWrapper**

- **Pliki**: `FormInputWrapper.tsx`, `FormInputWrapper.less`
- **Funkcja**: Wrapper dla pól formularza
- **Zawiera**: Styling, walidacja messages

#### **FormSubmitButton**

- **Pliki**: `FormSubmitButton.tsx`, `FormSubmitButton.less`
- **Funkcja**: Przycisk submit z loading state

### 📄 **Narzędzia**

#### **validatePassword.ts**

- **Funkcja**: Walidator haseł
- **Zawiera**: Reguły bezpieczeństwa, sprawdzanie siły hasła

## Integracje

- **React Context** - zarządzanie stanem użytkownika
- **React Router** - ochrona tras
- **Ant Design** - komponenty UI
- **Common components** - DatacButton, DatacFormItem, etc.

## Przepływ autoryzacji

1. **SignInForm** → weryfikacja → **UserContext** → **AuthRoute**
2. **SignUpForm** → **SignUpOnboarding** → weryfikacja email
3. **PasswordRecover** → reset link → **ChangePasswordForm**
