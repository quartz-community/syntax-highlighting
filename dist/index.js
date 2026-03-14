import rehypePrettyCode from 'rehype-pretty-code';

// src/transformer.ts

// src/scripts/clipboard.inline.ts
var clipboard_inline_default = `var i='<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>',s='<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>',d=()=>{let o=document.getElementsByTagName("pre");for(let n=0;n<o.length;n++){let a=o[n];if(!a)continue;let t=a.getElementsByTagName("code")[0];if(t){let c=(t.dataset.clipboard?JSON.parse(t.dataset.clipboard):t.innerText).replace(/\\n\\n/g,\`
\`),e=document.createElement("button");e.className="clipboard-button",e.type="button",e.innerHTML=i,e.ariaLabel="Copy source";let r=()=>{navigator.clipboard.writeText(c).then(()=>{e.blur(),e.innerHTML=s,setTimeout(()=>{e.innerHTML=i,e.style.borderColor=""},2e3)},l=>console.error(l))};e.addEventListener("click",r),window.addCleanup(()=>e.removeEventListener("click",r)),a.prepend(e)}}};document.addEventListener("nav",d);document.addEventListener("render",d);
`;

// src/styles/clipboard.scss
var clipboard_default = ".clipboard-button {\n  position: absolute;\n  display: flex;\n  float: right;\n  right: 0;\n  padding: 0.4rem;\n  margin: 0.3rem;\n  color: var(--gray);\n  border-color: var(--dark);\n  background-color: var(--light);\n  border: 1px solid;\n  border-radius: 5px;\n  opacity: 0;\n  transition: 0.2s;\n}\n.clipboard-button > svg {\n  fill: var(--light);\n  filter: contrast(0.3);\n}\n.clipboard-button:hover {\n  cursor: pointer;\n  border-color: var(--secondary);\n}\n.clipboard-button:focus {\n  outline: 0;\n}\n\npre:hover > .clipboard-button {\n  opacity: 1;\n  transition: 0.2s;\n}";

// src/transformer.ts
var defaultOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark"
  },
  keepBackground: false,
  clipboard: true
};
var SyntaxHighlighting = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  const { clipboard, ...codeOpts } = opts;
  return {
    name: "SyntaxHighlighting",
    htmlPlugins() {
      return [[rehypePrettyCode, codeOpts]];
    },
    externalResources() {
      const js = [];
      const css = [];
      if (clipboard) {
        js.push({
          script: clipboard_inline_default,
          loadTime: "afterDOMReady",
          contentType: "inline"
        });
        css.push({
          content: clipboard_default,
          inline: true
        });
      }
      return { js, css };
    }
  };
};

export { SyntaxHighlighting };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map