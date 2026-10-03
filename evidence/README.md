# Pokédex and search evidence

Before images are the seven original user-provided screenshots. After images were captured in headless Google Chrome against the local Vite app using live PokeAPI data, at a 1280 × 900 viewport. Pair 4 uses a full-page capture.

| Issue | Before | After | Verified result |
| --- | --- | --- | --- |
| 1 | [Before](before/1-pokedex.png) | [After](after/1-pokedex.png) | Each dual-type badge uses its own type colour. |
| 2 | [Before](before/2-mr-mime-page.png) | [After](after/2-mr-mime-page.png) | Mr. Mime is formatted with punctuation and spacing. |
| 3 | [Before](before/3-search-tapu.png) | [After](after/3-search-tapu.png) | All four Tapu names use spaces and title case. |
| 4 | [Before](before/4-gen-1-kanto-end-of-list.png) | [After](after/4-gen-1-kanto-end-of-list.png) | Kanto ends at #0151 Mew, with 151 entries. |
| 5 | [Before](before/5-gen-2-johto.png) | [After](after/5-gen-2-johto.png) | Johto starts at #0152 Chikorita, with 100 entries. |
| 6 | [Before](before/6-search-ra-then-down-arrow-9-times.png) | [After](after/6-search-ra-then-down-arrow-9-times.png) | After nine Down presses, Raboot is visibly highlighted inside the scrolled dropdown. |
| 7 | [Before](before/7-search-suggestions-in-dark-mode.png) | [After](after/7-search-suggestions-in-dark-mode.png) | Dark-mode selection has a distinct blue background and left marker. |

Additional [mobile search evidence](after/8-mobile-search.png) uses a 393 × 852 viewport with dark mode and the ninth result selected. This is viewport emulation.

## Validation

- Real browser interactions: generation selection, Kanto page 7, search typing, nine Down presses, Up/Down wraparound, Escape, theme toggle, and Enter navigation to the highlighted Tapu Koko and Raboot results.
- Active suggestion fully inside the list viewport on desktop and mobile; no horizontal page overflow at 393 px.
- All nine generation boundaries checked; each national number 1–1025 belongs to exactly one generation.
- Display-name checks cover Mr. Mime, all four Tapu names, and punctuation exceptions.
- Production build and `git diff --check` passed.

Changes are limited to the shared badges, display-name formatter, generation ranges, and search combobox.
