---
"@quartz-community/syntax-highlighting": patch
---

The copy button's stylesheet is in Quartz's base layer, so themes (e.g. `@quartz-themes/core`'s `obsidian` layer) can restyle the button; unlayered, it beat every theme rule.
