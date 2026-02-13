import rehypePrettyCode from "rehype-pretty-code";
import type { Options as CodeOptions, Theme as CodeTheme } from "rehype-pretty-code";
import type { QuartzTransformerPlugin, JSResource, CSSResource } from "@quartz-community/types";
// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline";
import clipboardStyle from "./styles/clipboard.scss";

interface Theme extends Record<string, CodeTheme> {
  light: CodeTheme;
  dark: CodeTheme;
}

export interface SyntaxHighlightingOptions {
  theme?: Theme;
  keepBackground?: boolean;
  clipboard?: boolean;
}

const defaultOptions: SyntaxHighlightingOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
  clipboard: true,
};

export const SyntaxHighlighting: QuartzTransformerPlugin<Partial<SyntaxHighlightingOptions>> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts };
  const { clipboard, ...codeOpts } = opts;
  return {
    name: "SyntaxHighlighting",
    htmlPlugins() {
      return [[rehypePrettyCode, codeOpts as CodeOptions]];
    },
    externalResources() {
      const js: JSResource[] = [];
      const css: CSSResource[] = [];

      if (clipboard) {
        js.push({
          script: clipboardScript,
          loadTime: "afterDOMReady",
          contentType: "inline",
        });

        css.push({
          content: clipboardStyle,
          inline: true,
        });
      }

      return { js, css };
    },
  };
};
