import { Theme as Theme$1 } from 'rehype-pretty-code';
import { QuartzTransformerPlugin } from '@quartz-community/types';
export { QuartzTransformerPlugin } from '@quartz-community/types';

interface Theme extends Record<string, Theme$1> {
    light: Theme$1;
    dark: Theme$1;
}
interface SyntaxHighlightingOptions {
    theme?: Theme;
    keepBackground?: boolean;
    clipboard?: boolean;
}
declare const SyntaxHighlighting: QuartzTransformerPlugin<Partial<SyntaxHighlightingOptions>>;

export { SyntaxHighlighting, type SyntaxHighlightingOptions };
