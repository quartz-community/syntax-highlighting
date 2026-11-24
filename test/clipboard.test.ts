import { describe, it, expect, vi } from "vitest";

vi.mock("../src/scripts/clipboard.inline", () => ({ default: "" }));
vi.mock("../src/styles/clipboard.scss", () => ({ default: ".clipboard-button{opacity:0}" }));

import { SyntaxHighlighting } from "../src/transformer";

describe("clipboard button stylesheet", () => {
  it("is in Quartz's base layer, so themes can restyle the button", () => {
    const css = SyntaxHighlighting().externalResources!({} as never)?.css ?? [];
    const contents = css.map((c) => ("content" in c ? c.content : ""));
    expect(contents).toEqual(["@layer quartz-base {\n.clipboard-button{opacity:0}\n}"]);
  });

  it("isn't shipped without the button", () => {
    expect(SyntaxHighlighting({ clipboard: false }).externalResources!({} as never)?.css).toEqual(
      [],
    );
  });
});
