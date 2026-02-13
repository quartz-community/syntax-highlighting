import rehypePrettyCode from "rehype-pretty-code";
import type { Options as CodeOptions, Theme as CodeTheme } from "rehype-pretty-code";
import type { QuartzTransformerPlugin } from "@quartz-community/types";

interface Theme extends Record<string, CodeTheme> {
  light: CodeTheme;
  dark: CodeTheme;
}

export interface SyntaxHighlightingOptions {
  theme?: Theme;
  keepBackground?: boolean;
}

const defaultOptions: SyntaxHighlightingOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
};

export const SyntaxHighlighting: QuartzTransformerPlugin<Partial<SyntaxHighlightingOptions>> = (
  userOpts,
) => {
  const opts: CodeOptions = { ...defaultOptions, ...userOpts };
  return {
    name: "SyntaxHighlighting",
    htmlPlugins() {
      return [[rehypePrettyCode, opts]];
    },
  };
};
