# Eternal Vault UI Design Guide (for Copilot)

Dark relic vault aesthetic for PoE-style unique tracker.

Atmosphere: ancient vault, arcane relic archive, buried divinity.
Tone: mysterious, reverent, powerful, restrained — not edgy or neon.

Use this guide whenever generating UI, components, or text.

---

## 🎨 Theme Tokens

### Colors

| Token               | Hex       | Meaning                                         |
| ------------------- | --------- | ----------------------------------------------- |
| background          | `#0A0C0F` | Abyss Black — vault darkness                    |
| backgroundSecondary | `#15191E` | Crypt Slate — stone depth                       |
| surface             | `#2B3138` | Obsidian Steel — panel blocks                   |
| textPrimary         | `#D9D7D1` | Tarnished Silver — main text                    |
| textSecondary       | `#8B8A86` | Ash Grey — labels, muted text                   |
| gold                | `#C6A667` | Ancient Gold — prestige highlights              |
| ember               | `#B86E26` | Arcane Ember — interactive, alert, rare         |
| eldritch            | `#57A773` | Eldritch Green — completion/owned/arcane energy |

### Glow / Shadow

| Token        | Style               |
| ------------ | ------------------- |
| glowGold     | `0 0 8px #C6A66788` |
| glowEmber    | `0 0 8px #B86E2688` |
| glowEldritch | `0 0 8px #57A77388` |

### Motion

- Subtle rune pulse
- Slow ease (300–500ms), NO bounce
- Hover = soft ember or gold glow
- Rare use: eldritch pulse for completion

> Rule: **Ancient power waking slowly**, not UI floating like a mobile app.

---

## 🧾 Vocabulary Style

| Default term | Theme term            |
| ------------ | --------------------- |
| Owned        | Catalogued / Restored |
| Missing      | Lost / Unclaimed      |
| Inventory    | Reliquary             |
| Tooltip      | Reveal / Divination   |
| Settings     | Obsidian Codex        |
| New item     | Unearthed Relic       |

Keep tone **subtle and classy**, not role-play heavy.

---

## 🧠 UX Meaning System

| Color    | Meaning                             |
| -------- | ----------------------------------- |
| Gold     | Sacred / major highlight / headings |
| Ember    | Interactive, hover, warning, rarity |
| Eldritch | Completed, owned, unlocked          |
| Silver   | Normal readable text                |
| Ash Grey | Muted, secondary info               |

---

## 🧱 UI Behavior Rules

- Panel backgrounds = deep stone texture feeling (flat is OK, no gloss)
- Borders = thin gold or ember line on focus/hover
- Animate glow only — never move objects unless subtle pulse

---

## ✍️ Content Tone Guidelines

- Quiet reverence, discovery, archival magic
- Inspiration: PoE vaults, Diablo II runes, Elden Ring roundtable, Darkest Dungeon metal

Avoid:

- Modern neon/glass UI
- Gamer-meme language
- Sci-fi panels or blue cyber glow

---

## 🧩 Component Behavior Examples

Buttons:

- Base: `background: surface`, `color: textPrimary`
- Hover: gold glow
- Click: ember flash

Cards / Inventory Slots:

- Empty: stone panel
- Owned: eldritch glow edge
- Hover: soft ember outline
- Selected: gold pulse rim

---

## 💬 Copilot Prompts (internal hints)

Use these comments in code to guide generation:

```ts
// Eternal Vault theme — use theme tokens
// Dark relic vault aesthetic, arcane tone, subtle glow
// Use gold for prestige, ember for interaction, eldritch for completion
```
