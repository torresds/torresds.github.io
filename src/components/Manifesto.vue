<script setup lang="ts">
import { ref, onMounted } from 'vue'

const quoteTop = "The machine that appears to be 'out there' and the person"
const quoteBottom = "that appears to be 'in here' are not two separate things."

const manifestoSection = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.4 }
  )
  
  if (manifestoSection.value) {
    observer.observe(manifestoSection.value)
  }
})
</script>

<template>
  <section ref="manifestoSection" class="manifesto-section" :class="{ 'is-visible': isVisible }">
    <div class="container">
      <div class="quote-wrapper">
        <h2 class="quote line-1">{{ quoteTop }}</h2>
        <h2 class="quote line-2">{{ quoteBottom }}</h2>
      </div>
      <div class="author">
        <span class="line"></span>
        <p>Robert M. Pirsig</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.manifesto-section {
  padding: 16rem 2rem;
  background-color: var(--color-bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-serif);
  font-size: 25vw;
  color: rgba(255, 255, 255, 0.015);
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
  user-select: none;
}

.container {
  max-width: 1200px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.quote-wrapper {
  margin-bottom: 5rem;
  position: relative;
}

.quote-wrapper::before, .quote-wrapper::after {
  content: '"';
  font-family: var(--font-serif);
  font-size: 8rem;
  color: rgba(197, 168, 128, 0.1);
  position: absolute;
  line-height: 1;
}

.quote-wrapper::before {
  top: -4rem;
  left: -2rem;
}

.quote-wrapper::after {
  bottom: -6rem;
  right: -2rem;
}

.quote {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 400;
  line-height: 1.1;
  margin: 0;
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.95);
  transition: all 1.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.line-1 {
  transition-delay: 0s;
  color: var(--color-text-muted);
}

.line-2 {
  transition-delay: 0.4s;
  color: var(--color-text-primary);
}

.is-visible .quote {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}

.author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1.2s ease 0.8s;
}

.is-visible .author {
  opacity: 1;
  transform: translateY(0);
}

.line {
  width: 60px;
  height: 1px;
  background-color: var(--color-gold);
}

.author p {
  font-family: var(--font-sans);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  color: var(--color-accent);
  margin: 0;
  font-weight: 300;
}

@media (max-width: 768px) {
  .manifesto-section { padding: 10rem 2rem; }
  .quote-wrapper::before { left: 0; top: -3rem; }
  .quote-wrapper::after { right: 0; bottom: -4rem; }
}
</style>
