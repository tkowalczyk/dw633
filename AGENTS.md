# Praca nad stroną DW633

- Używaj pnpm. Instalacja: `pnpm install --frozen-lockfile`; pełna kontrola: `pnpm check`; build: `pnpm build`.
- Wersję pnpm określa `packageManager` w `package.json`. Zachowuj `pnpm-lock.yaml`. Nie twórz `package-lock.json` ani instrukcji z npm/npx.
- Do kontroli przeglądarkowej używaj zainstalowanego `agent-browser`. Nie dodawaj Playwright. `pnpm test:browser` korzysta z CLI dostępnego w PATH i lokalnego podglądu Pages.
- Korzystaj z osobnej nazwanej sesji przeglądarki i zamykaj ją po pracy. Zrzuty testowe trafiają do `test-results/agent-browser/`.
- Pracuj na bieżącej gałęzi. Nową gałąź twórz tylko na wyraźne polecenie użytkownika.
- Treść publiczna pochodzi z `src/site-data.ts`. Zachowuj rozróżnienie faktów, relacji i danych wymagających sprawdzenia. Nie publikuj prywatnej korespondencji ani danych osobowych.
- Raporty wcześniejszych kontroli są zapisem historycznym. Nowe instrukcje i issues muszą używać pnpm oraz agent-browser.
