// .vitepress/theme/transformers.js
export default {
  vPre: {
    // Transformer les blocs de code en éléments v-pre
    transform(code, lang) {
      return `<pre v-pre><code>${code}</code></pre>`
    }
  },
  mermaid: {
    // Transformer les blocs mermaid en composants MermaidRender
    transform(code, lang) {
      if (lang === 'mermaid') {
        return `<MermaidRender code="${encodeURIComponent(code)}" />`
      }
    }
  }
}
