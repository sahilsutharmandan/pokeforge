# PokeForge repair evidence

The before images are the four original user-provided screenshots. After images are full-page captures of the repaired app in Chromium with responsive viewport emulation.

| Issue | Before | After | Result |
| --- | --- | --- | --- |
| Removing one duplicate removes both | [Before](before/1-added-pikachu-twice-then-removed-one.png) | [After](after/1-remove-one-pikachu.png) | Added Pikachu twice alongside Charizard, Gyarados, Snorlax and Gengar; removed the first Pikachu and refreshed. Five members remain, including the other Pikachu. |
| Phone team cards squeezed into one row | [Before](before/2-team-on-my-phone.png) | [After](after/2-team-phone.png) | Six members wrap into two columns, with readable names and badges. |
| Eevee evolutions escape their card | [Before](before/3-eevee-on-my-tablet.png) | [After](after/3-eevee-tablet.png) | All eight evolutions wrap inside the panel, with each method attached to its evolution. |
| Compare labels, values and bar color | [Before](before/4-compare-mewtwo-vs-snorlax.png) | [After](after/4-compare-desktop.png) | All stat labels and numbers fit; Snorlax's orange bars match the legend and share Mewtwo's scale. |

## Verification

- Added the full six-member team through the search picker. Removing either duplicate independently preserves the other member and every unrelated slot key. The first removal persists after refresh.
- Team names and page width checked at 320, 390, 768 and 1280 CSS pixels with no horizontal overflow or clipped names.
- Eevee and all eight evolution links stay inside the panel at 320, 390, 768, 996 and 1280 CSS pixels. Navigating to Vaporeon and refreshing succeeds.
- Compare SVG text bounds checked at 320, 390, 768 and 1280 CSS pixels: no clipped labels or values, no page overflow. Both series render in their legend colors. Swapping Pokémon updates the chart.
- Production build (`npm run build`) and `git diff --check` pass.

## Capture conditions

After viewports: removal 1280×900; phone 390×844; Eevee 768×1024; compare 1280×1053. Full-page image heights extend beyond these viewports; the phone's fixed bottom navigation appears at the initial viewport boundary. These are responsive browser checks, not physical-device tests or exact pixel matches to the supplied tablet capture.

GitHub's raw artwork host timed out in this environment. For the final screenshot run only, the browser routed PokeAPI sprite requests to the same repository paths on jsDelivr. Pokémon data came from the live PokeAPI. Application artwork URLs and data were not changed. The screenshot set contains only the four supplied before images and four final after captures.
