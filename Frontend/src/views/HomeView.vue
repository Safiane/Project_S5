<template>
  <div class="home">
    <section class="hero">
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-badge">Urban Music Hub</div>
        <h1>Feel the Music</h1>
        <p>Where every beat tells a story.</p>

        <div class="cta-group">
          <router-link to="/artists" class="cta-btn primary">Artists</router-link>
          <router-link to="/albums" class="cta-btn secondary">Albums</router-link>
          <router-link to="/songs" class="cta-btn ghost">Songs</router-link>
        </div>

        <div class="hero-stats">
         <div class="stat">
           <span class="label">Artists</span>
           <span class="value">
             {{ loading ? '—' : artistsCount }}
           </span>
         </div>
         <div class="stat">
           <span class="label">Albums</span>
           <span class="value">
             {{ loading ? '—' : albumsCount }}
           </span>
         </div>
         <div class="stat">
           <span class="label">Songs</span>
           <span class="value">
             {{ loading ? '—' : songsCount }}
           </span>
         </div>
        </div>

      </div>
    </section>

    <section class="bottom-strip">
      <div class="now-playing">
        <span class="dot"></span>
        <span class="label">Project S5 · Sonity</span>
      </div>
      <div class="credits">
        Made by Peïo, Safiane and Johnny
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const API_BASE = 'http://localhost:3000'

const artists = ref([])
const albums = ref([])
const songs = ref([])
const loading = ref(true)
const error = ref('')

async function loadCounts () {
  loading.value = true
  error.value = ''
  try {
    const [aRes, alRes, sRes] = await Promise.all([
      fetch(`${API_BASE}/artistsapi/list`),
      fetch(`${API_BASE}/albumsapi/list`),
      fetch(`${API_BASE}/songsapi/list`)
    ])
    if (!aRes.ok || !alRes.ok || !sRes.ok) {
      throw new Error(`HTTP ${aRes.status}/${alRes.status}/${sRes.status}`)
    }
    artists.value = await aRes.json()
    albums.value = await alRes.json()
    songs.value = await sRes.json()
  } catch (e) {
    error.value = `Unable to load stats (${e.message})`
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadCounts)

const artistsCount = computed(() => artists.value.length)
const albumsCount = computed(() => albums.value.length)
const songsCount = computed(() => songs.value.length)
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap");

.home {
  min-height: 100vh;
  background: #0d0d0d;
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* HERO */

.hero {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px 40px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 212, 0, 0.15), transparent 60%),
    radial-gradient(circle at bottom right, rgba(0, 174, 239, 0.15), transparent 60%),
    #0d0d0d;
}

.hero::before {
  content: "";
  position: absolute;
  inset: -40px;
  background-image: url("https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80");
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  filter: grayscale(100%) contrast(1.2);
  mix-blend-mode: screen;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, rgba(240, 58, 71, 0.16), transparent 65%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  text-align: center;
  font-family: "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 212, 0, 0.5);
  background: rgba(13, 13, 13, 0.8);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffd400;
  margin-bottom: 14px;
}

.hero-badge::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #f03a47;
  box-shadow: 0 0 10px rgba(240, 58, 71, 0.9);
}

.hero h1 {
  font-size: clamp(2.8rem, 6vw, 4rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.hero p {
  max-width: 460px;
  margin: 0 auto 26px;
  font-size: 1.05rem;
  color: #d0d0d0;
}

/* CTA */

.cta-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
}

.cta-btn {
  padding: 10px 26px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid transparent;
  text-decoration: none;
  transition: all 0.18s ease-out;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cta-btn.primary {
  background: #ffd400;
  color: #0d0d0d;
  box-shadow: 0 0 20px rgba(255, 212, 0, 0.35);
}

.cta-btn.primary:hover {
  background: #f8c500;
  box-shadow: 0 0 24px rgba(255, 212, 0, 0.55);
}

.cta-btn.secondary {
  background: #3a3a3a;
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.08);
}

.cta-btn.secondary:hover {
  border-color: #00aeef;
  box-shadow: 0 0 18px rgba(0, 174, 239, 0.45);
  color: #00aeef;
}

.cta-btn.ghost {
  background: transparent;
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.24);
}

.cta-btn.ghost:hover {
  border-color: #f03a47;
  color: #f03a47;
  box-shadow: 0 0 18px rgba(240, 58, 71, 0.55);
}

/* STATS */

.hero-stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 12px;
}

.stat {
  min-width: 96px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(58, 58, 58, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: left;
}

.stat .label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  opacity: 0.7;
  letter-spacing: 0.08em;
}

.stat .value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffd400;
}

/* BOTTOM STRIP / FOOTER */

.bottom-strip {
  border-top: 1px solid #3a3a3a;
  padding: 10px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: #0d0d0d;
  font-size: 0.8rem;
  color: #a0a0a0;
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 8px;
}

.now-playing .dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #00aeef;
  box-shadow: 0 0 10px rgba(0, 174, 239, 0.9);
}

.credits {
  opacity: 0.85;
}

@media (max-width: 576px) {
  .bottom-strip {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
