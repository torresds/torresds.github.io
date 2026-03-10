<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGithubAPI, type GithubUser, type GithubRepo, type GithubStats } from '../services/github'

const { fetchUser, fetchRepos } = useGithubAPI()
const user = ref<GithubUser | null>(null)
const repos = ref<GithubRepo[]>([])
const stats = ref<GithubStats | null>(null)

const selectedLanguage = ref<string>('All')

onMounted(async () => {
  try {
    const uParams = await fetchUser('torresds')
    const rParams = await fetchRepos('torresds')
    
    user.value = uParams
    repos.value = rParams.repos
    stats.value = rParams.stats
  } catch (error) {
  }
})

const filteredRepos = computed(() => {
  if (selectedLanguage.value === 'All') return repos.value.slice(0, 9)
  return repos.value.filter(r => r.language === selectedLanguage.value).slice(0, 9)
})

const availableLanguages = computed(() => {
  if (!stats.value) return ['All']
  const currentStats = stats.value
  const langs = Object.keys(currentStats.languageCount).sort((a, b) => {
    return (currentStats.languageCount[b] || 0) - (currentStats.languageCount[a] || 0)
  })
  return ['All', ...langs]
})

const setLanguage = (lang: string) => {
  selectedLanguage.value = lang
}
</script>

<template>
  <section id="work" class="showcase">
    <div class="container">
      <div class="section-heading">
        <h2 class="section-title">Meus projetos</h2>
      </div>
      
      <div v-if="user && stats" class="profile-header">
        <div class="avatar-group">
          <div class="avatar-wrapper">
            <img :src="user.avatar_url" :alt="user.name" class="avatar" />
          </div>
          <a :href="user.html_url" target="_blank" rel="noopener noreferrer" class="github-handle">
            @{{ user.login }}
          </a>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-val">{{ user.public_repos }}</span>
            <span class="stat-lbl">Repositórios</span>
          </div>
          <div class="stat-item stat-highlight">
            <span class="stat-val">{{ stats.topLanguage }}</span>
            <span class="stat-lbl">Linguagem predominante</span>
          </div>
        </div>
      </div>

      <div class="filter-container" v-if="availableLanguages.length > 1">
        <button 
          v-for="lang in availableLanguages" 
          :key="lang"
          class="filter-btn"
          :class="{ 'active': selectedLanguage === lang }"
          @click="setLanguage(lang)"
        >
          {{ lang }}
        </button>
      </div>

      <div class="repos-grid" v-if="filteredRepos.length > 0">
        <a v-for="repo in filteredRepos" :key="repo.id" :href="repo.html_url" target="_blank" class="repo-card" rel="noopener noreferrer">
          <div class="repo-top">
            <svg viewBox="0 0 24 24" fill="none" class="repo-icon">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 22.027v-2.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.89 5.07 5.07 0 0 0-.13-3.93s-1.18-.35-3.91 1.48a13.38 13.38 0 0 0-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 0 0 5 5.607a5.44 5.44 0 0 0-1.5 3.89c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58v2.96"></path>
            </svg>
            <h3 class="repo-name">{{ repo.name }}</h3>
          </div>
          <p class="repo-desc">{{ repo.description || 'No description provided.' }}</p>
          <div class="repo-bottom">
            <span class="repo-lang" v-if="repo.language">
              <span class="lang-dot"></span> {{ repo.language }}
            </span>
          </div>
        </a>
      </div>
      <div v-else class="empty-state">
        <p>Nenhum repositório encontrado para a linguagem selecionada.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  padding: 8rem 2rem;
  background-color: var(--color-bg-base);
  position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.section-heading {
  margin-bottom: 4rem;
  text-align: center;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  color: var(--color-text-primary);
  display: inline-block;
  position: relative;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4rem;
  background: var(--color-bg-surface);
  padding: 3rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.avatar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--color-gold), var(--color-accent));
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--color-bg-base);
}

.github-handle {
  font-family: var(--font-sans);
  font-weight: 600;
  color: var(--color-accent);
  transition: opacity var(--transition-normal);
}

.github-handle:hover {
  opacity: 0.8;
}

.stats {
  display: flex;
  gap: 4rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-val {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-lbl {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.8rem;
}

.stat-highlight .stat-val {
  color: var(--color-gold);
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.filter-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-muted);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  transition: all var(--transition-normal);
}

.filter-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text-primary);
}

.filter-btn.active {
  background-color: var(--color-accent);
  color: var(--color-bg-base);
  border-color: var(--color-accent);
  font-weight: 600;
}

.repos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.repo-card {
  background-color: var(--color-bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  height: 100%;
}

.repo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--color-gold), var(--color-accent));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-normal);
}

.repo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  background-color: rgba(255, 255, 255, 0.02);
}

.repo-card:hover::before {
  transform: scaleX(1);
}

.repo-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.repo-icon {
  width: 22px;
  height: 22px;
  color: var(--color-text-muted);
}

.repo-name {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  color: var(--color-text-primary);
}

.repo-desc {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: auto;
}

.repo-lang {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lang-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-gold);
}

.repo-lang:has(:contains('TypeScript')) .lang-dot { background-color: #3178c6; }
.repo-lang:has(:contains('JavaScript')) .lang-dot { background-color: #f1e05a; }
.repo-lang:has(:contains('Vue')) .lang-dot { background-color: #41b883; }
.repo-lang:has(:contains('C++')) .lang-dot { background-color: #f34b7d; }
.repo-lang:has(:contains('Java')) .lang-dot { background-color: #b07219; }

.repo-stars {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
}

.star-icon {
  width: 16px;
  height: 16px;
  color: var(--color-gold);
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
  }
  
  .stats {
    flex-direction: column;
    gap: 2rem;
  }
  
  .repos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
