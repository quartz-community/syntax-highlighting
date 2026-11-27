import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { bundleInline, runInline } from "./inlineScript";

const SCRIPT = new URL("../src/scripts/clipboard.inline.ts", import.meta.url).pathname;

interface FakeButton extends EventTarget {
  className?: string;
  type?: string;
  innerHTML?: string;
  ariaLabel?: string;
  style: { borderColor: string };
  blur(): void;
}

/** A page whose `<pre>` blocks hold one `<code>` each (rehype-pretty-code's output). */
function page(blocks: ({ text: string; clipboard?: string } | null)[]) {
  const makePre = (block: { text: string; clipboard?: string } | null) => {
    const buttons: FakeButton[] = [];
    const code = block && {
      innerText: block.text,
      dataset: block.clipboard ? { clipboard: block.clipboard } : {},
    };
    return {
      buttons,
      getElementsByTagName: (tag: string) => (tag === "code" && code ? [code] : []),
      prepend: (el: FakeButton) => buttons.unshift(el),
      querySelector: (selector: string) =>
        selector === ":scope > .clipboard-button"
          ? (buttons.find((b) => b.className === "clipboard-button") ?? null)
          : null,
    };
  };
  const pres = blocks.map(makePre);
  let cleanups: (() => void)[] = [];
  const copied: string[] = [];
  const document = Object.assign(new EventTarget(), {
    getElementsByTagName: (tag: string) => (tag === "pre" ? pres : []),
    createElement: (): FakeButton =>
      Object.assign(new EventTarget(), { style: { borderColor: "" }, blur: () => {} }),
  });
  vi.stubGlobal("document", document);
  vi.stubGlobal("window", { addCleanup: (fn: () => void) => cleanups.push(fn) });
  vi.stubGlobal("navigator", {
    clipboard: { writeText: async (text: string) => void copied.push(text) },
  });
  return {
    pres,
    copied,
    /** a code block that appears without a navigation (e.g. decrypted content) */
    addBlock: (block: { text: string }) => pres.push(makePre(block)),
    /** an SPA navigation: cleanups, the new page's fresh `<pre>` blocks, then `nav` */
    nav: () => {
      cleanups.forEach((fn) => fn());
      cleanups = [];
      pres.forEach((pre) => (pre.buttons.length = 0));
      document.dispatchEvent(new CustomEvent("nav"));
    },
    render: () => document.dispatchEvent(new CustomEvent("render")),
  };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("clipboard script", () => {
  let script: string;
  beforeAll(async () => {
    script = await bundleInline(SCRIPT);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("adds one copy button to every code block", () => {
    const p = page([{ text: "a" }, null, { text: "b" }]);
    runInline(script);
    p.nav();
    expect(p.pres.map((pre) => pre.buttons.length)).toEqual([1, 0, 1]);
    const [button] = p.pres[0]!.buttons;
    expect(button).toMatchObject({
      className: "clipboard-button",
      type: "button",
      ariaLabel: "Copy source",
    });
    expect(button!.innerHTML).toMatch(/^<svg/);
  });

  it("copies the block's text, or its data-clipboard source (mermaid)", async () => {
    const p = page([
      { text: "const a = 1" },
      { text: "rendered", clipboard: JSON.stringify("graph TD\n  A-->B") },
    ]);
    runInline(script);
    p.nav();
    p.pres[0]!.buttons[0]!.dispatchEvent(new Event("click"));
    p.pres[1]!.buttons[0]!.dispatchEvent(new Event("click"));
    await flush();
    expect(p.copied).toEqual(["const a = 1", "graph TD\n  A-->B"]);
  });

  it("shows a check mark after copying, then the copy icon again", async () => {
    vi.useFakeTimers();
    const p = page([{ text: "x" }]);
    runInline(script);
    p.nav();
    const button = p.pres[0]!.buttons[0]!;
    const copyIcon = button.innerHTML;
    button.dispatchEvent(new Event("click"));
    await vi.advanceTimersByTimeAsync(0);
    expect(button.innerHTML).not.toBe(copyIcon);
    expect(button.innerHTML).toContain("rgb(63, 185, 80)");
    await vi.advanceTimersByTimeAsync(2000);
    expect(button.innerHTML).toBe(copyIcon);
  });

  it("stops listening when the page is left (SPA cleanup)", async () => {
    const p = page([{ text: "x" }]);
    runInline(script);
    p.nav();
    const button = p.pres[0]!.buttons[0]!;
    p.nav();
    button.dispatchEvent(new Event("click"));
    await flush();
    // only the new button (added by the second nav) copies; the old one is detached
    expect(p.copied).toEqual([]);
  });

  // regression: setup runs on `render` too (encrypted-pages dispatches it after an unlock) and used
  // to prepend another button to every code block that already had one.
  it("doesn't add a second button on a `render` event", () => {
    const p = page([{ text: "x" }]);
    runInline(script);
    p.nav();
    p.render();
    expect(p.pres[0]!.buttons).toHaveLength(1);
  });

  it("keeps one working button per block after a nav and two `render`s", async () => {
    const p = page([{ text: "a" }, null, { text: "b" }]);
    runInline(script);
    p.nav();
    p.render();
    p.render();
    expect(p.pres.map((pre) => pre.buttons.length)).toEqual([1, 0, 1]);
    p.pres[0]!.buttons[0]!.dispatchEvent(new Event("click"));
    await flush();
    expect(p.copied).toEqual(["a"]);
  });

  it("adds buttons to code blocks that a `render` revealed (decrypted content)", () => {
    const p = page([{ text: "a" }]);
    runInline(script);
    p.nav();
    p.addBlock({ text: "new" });
    p.render();
    expect(p.pres.map((pre) => pre.buttons.length)).toEqual([1, 1]);
  });
});
