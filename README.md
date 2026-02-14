# @quartz-community/syntax-highlighting

Adds syntax highlighting to code blocks using rehype-pretty-code, with an optional clipboard copy button.

## Installation

```bash
npx quartz plugin add github:quartz-community/syntax-highlighting
```

## Usage

```ts
// quartz.config.ts
import * as ExternalPlugin from "./.quartz/plugins"

const config: QuartzConfig = {
  plugins: {
    transformers: [
      ExternalPlugin.SyntaxHighlighting(),
    ],
  },
}
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| theme | `{ light: CodeTheme, dark: CodeTheme }` | `{ light: "github-light", dark: "github-dark" }` | The theme to use for syntax highlighting. |
| keepBackground | `boolean` | `false` | Whether to keep the background color of the code block. |
| clipboard | `boolean` | `true` | Whether to add a clipboard copy button to code blocks. |

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/) for more information.

## License

MIT
