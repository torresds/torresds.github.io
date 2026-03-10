<script setup lang="ts">
import Hero from './components/Hero.vue'
import About from './components/About.vue'
import Manifesto from './components/Manifesto.vue'
import GithubShowcase from './components/GithubShowcase.vue'
import ZenGarden from './components/ZenGarden.vue'
</script>

<template>
  <main class="app-container">
    <ZenGarden />
    <Hero />
    <About />
    <Manifesto />
    <GithubShowcase />
    
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">Built with ॐ by Miguel Torres</p>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer {
  padding: 4rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-text {
  font-family: var(--font-serif);
  color: var(--color-text-muted);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}
</style>
