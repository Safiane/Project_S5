<template>
  <div>
    <section class="hero text-white">
      <div class="overlay"></div>
      <div class="hero-content text-center">
        <h1>Artists</h1>
        <p>Discover creators from around the world.</p>
        <div class="cta-group">
          <router-link to="/" class="btn btn-outline-light btn-discover">Home</router-link>
          <router-link to="/albums" class="btn btn-outline-light btn-discover">Albums</router-link>
          <router-link to="/songs" class="btn btn-outline-light btn-discover">Songs</router-link>
        </div>
      </div>
    </section>

    <main class="container">
      <p v-if="loading">Chargement…</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else class="grid">
        <div v-for="a in artists" :key="a.ID_Artist" class="card">
          <h3>{{ a.Name }}</h3>
          <p class="muted">{{ a.Style }} — {{ a.Country }}</p>
          <p v-if="a.Gender" class="muted">Gender: {{ a.Gender }}</p>
          <p v-if="a.Start_Date" class="muted">Since: {{ a.Start_Date }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const BASE = (import.meta?.env?.BASE_URL) || (process?.env?.BASE_URL) || '/'
const artists = ref([]), loading = ref(true), error = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`${BASE}data/artists.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (!Array.isArray(json)) throw new Error('Format JSON inattendu')
    artists.value = json
  } catch (e) {
    error.value = `Impossible de charger les artistes (${e.message})`
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Raleway:wght@400;500&display=swap");
.hero{position:relative;background:url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80") no-repeat center/cover;height:40vh;display:flex;align-items:center;justify-content:center;text-align:center}
.overlay{position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.8))}
.hero-content{position:relative;z-index:2}
.hero h1{font-family:"Playfair Display",serif;font-size:3rem;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}
.hero p{font-family:"Raleway",sans-serif;font-size:1.1rem;margin-bottom:18px}
.cta-group{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-discover{padding:10px 26px;border-radius:30px;border:1px solid #fff;transition:.2s}
.btn-discover:hover{background:#fff;color:#000}
.container{max-width:1100px;margin:24px auto;padding:0 16px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.card{border:1px solid #ddd;border-radius:12px;padding:12px;background:#fff}
.muted{color:#666;font-size:.95rem}
.error{color:#c00}
</style>