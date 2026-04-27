import { Theme as Theme$1 } from 'rehype-pretty-code';
import { QuartzTransformerPlugin } from '@quartz-community/types';
export { QuartzTransformerPlugin } from '@quartz-community/types';
import { ShikiTransformer } from 'shiki';

interface Theme extends Record<string, Theme$1> {
    light: Theme$1;
    dark: Theme$1;
}
interface SyntaxHighlightingOptions {
    theme?: Theme;
    keepBackground?: boolean;
    clipboard?: boolean;
    tokenClassification?: boolean;
}
declare const SyntaxHighlighting: QuartzTransformerPlugin<Partial<SyntaxHighlightingOptions>>;

/**
 * Shiki transformer that adds `data-token-type` attributes to token spans
 * based on TextMate scope classification.
 *
 * Requires `includeExplanation: "scopeName"` on the Shiki options to have
 * access to scope data. When scopes are unavailable, tokens are left untouched.
 *
 * This is purely additive — inline styles are preserved as-is. Downstream
 * consumers (e.g. Quartz Themes) can target `span[data-token-type="keyword"]`
 * to override colors with theme-specific values.
 */
declare function tokenClassifierTransformer(): ShikiTransformer;

export { SyntaxHighlighting, type SyntaxHighlightingOptions, tokenClassifierTransformer };
