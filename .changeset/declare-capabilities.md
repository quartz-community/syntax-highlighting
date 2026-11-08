---
"@quartz-community/syntax-highlighting": patch
---

The manifest declares that the plugin provides the code blocks' clipboard button (`quartz.capabilities`), so plugins that use it (e.g. Mermaid controls) can declare the dependency and Quartz 5.1+ can report it when the plugin is off. Older versions ignore the field.
