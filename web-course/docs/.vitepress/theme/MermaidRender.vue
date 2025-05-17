// .vitepress/theme/MermaidRender.vue
<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const mermaidContainer = ref(null)
const mermaidId = `mermaid-${Date.now()}-${Math.floor(Math.random() * 10000)}`
const loading = ref(true)
const error = ref(null)

// Le code est encodé en URL pour éviter les problèmes d'échappement
const decodedCode = decodeURIComponent(props.code)

onMounted(() => {
  import('mermaid').then(module => {
    const mermaid = module.default
    
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'sans-serif'
      })
      
      mermaid.render(mermaidId, decodedCode).then(({ svg }) => {
        if (mermaidContainer.value) {
          mermaidContainer.value.innerHTML = svg
          loading.value = false
        }
      }).catch(err => {
        console.error('Mermaid render error:', err)
        error.value = err.message || 'Error rendering diagram'
        loading.value = false
      })
    } catch (err) {
      console.error('Mermaid initialization error:', err)
      error.value = err.message || 'Error initializing mermaid'
      loading.value = false
    }
  }).catch(err => {
    console.error('Mermaid import error:', err)
    error.value = err.message || 'Error loading mermaid'
    loading.value = false
  })
})
</script>

<template>
  <div class="mermaid-wrapper">
    <div v-if="loading" class="loading">
      Loading diagram...
    </div>
    <div v-else-if="error" class="error">
      Error rendering diagram: {{ error }}
    </div>
    <div :id="mermaidId" ref="mermaidContainer" class="mermaid-container"></div>
  </div>
</template>

<style scoped>
.mermaid-wrapper {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow-x: auto;
}
.loading {
  font-style: italic;
  color: #666;
  margin-bottom: 0.5rem;
}
.error {
  color: #cf1322;
  background-color: #fff1f0;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ffccc7;
  white-space: pre-wrap;
}
.mermaid-container {
  text-align: center;
}
</style>
