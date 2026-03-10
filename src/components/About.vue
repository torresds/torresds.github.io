<script setup lang="ts">
const techStack = [
  'JavaScript / TypeScript',
  'C++ / C',
  'Java / Spring',
  'Relational Databases',
  'NoSQL Databases',
  'Git & CI/CD',
  'Linux (Arch / Debian)'
]

const services = [
  'Desenvolvimento de software',
  'Websites personalizados',
  'Projetos Gerais',
  'Refatoração de código legado'
]
</script>

<template>
  <section id="about" class="about-section">
    <div class="container">
      <div class="about-grid">
        <div class="about-text">
          <h2 class="section-title">Sobre mim</h2>
          <p class="description">
            Baseado em Juiz de Fora, Minas Gerais e estudante na UFJF, atuo no desenvolvimento de software focado em resolver problemas complexos com elegância.
          </p>
          <div class="contact-info">
            <p>Orçamentos ou ajuda em projetos open source, entre em contato!</p>
            <a href="mailto:migueltrrds@gmail.com" class="email-link">
              <span class="icon">✉</span> migueltrrds@gmail.com
            </a>
          </div>
        </div>
        
        <div class="skills-container">
          <div class="skills-block">
            <h3 class="block-title">Tech</h3>
            <ul class="tag-list">
              <li v-for="tech in techStack" :key="tech" class="tag">{{ tech }}</li>
            </ul>
          </div>
          <div class="skills-block">
            <h3 class="block-title">Expertise</h3>
            <ul class="services-list">
              <li v-for="service in services" :key="service" class="service-item">
                <span class="bullet"></span>
                {{ service }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 8rem 2rem;
  background-color: var(--color-bg-base);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  color: var(--color-text-primary);
  margin-bottom: 2rem;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.description {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.contact-info {
  margin-top: 3rem;
}

.email-link {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  color: var(--color-accent);
  transition: opacity var(--transition-normal);
}

.email-link:hover {
  opacity: 0.8;
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.block-title {
  font-family: var(--font-sans);
  font-size: 1.2rem;
  color: var(--color-gold);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.tag {
  background-color: var(--color-bg-surface);
  color: var(--color-text-primary);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all var(--transition-normal);
}

.tag:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-text-muted);
  font-size: 1.05rem;
}

.bullet {
  width: 6px;
  height: 6px;
  background-color: var(--color-accent);
  border-radius: 50%;
}

@media (max-width: 900px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
</style>
