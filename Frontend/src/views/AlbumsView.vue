<template>
  <div>
    <section class="hero text-white">
      <div class="overlay"></div>
      <div class="hero-content text-center">
        <h1>Albums</h1>
        <p>Discography across genres and years.</p>
        <div class="cta-group">
          <router-link to="/" class="btn btn-outline-light btn-discover">Home</router-link>
          <router-link to="/artists" class="btn btn-outline-light btn-discover">Artists</router-link>
          <router-link to="/songs" class="btn btn-outline-light btn-discover">Songs</router-link>
        </div>
      </div>
    </section>

    <main class="container">
      <p v-if="loading">Chargement…</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else class="grid">
        <div v-for="alb in albumsWithArtist" :key="alb.ID_Album" class="card">
          <h3>{{ alb.Album_Title }}</h3>
          <p class="muted">{{ alb.Album_Release_Date }} • {{ alb.Album_Type }}</p>
          <p>Label: <strong>{{ alb.Record_Company || '—' }}</strong></p>
          <p>Artist: <strong>{{ alb.artist?.Name ?? '—' }}</strong></p>
          <p v-if="alb.Collaborations" class="muted">Collabs: {{ alb.Collaborations }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const BASE = (import.meta?.env?.BASE_URL) || (process?.env?.BASE_URL) || '/'
const artists = ref([]), albums = ref([]), loading = ref(true), error = ref('')

onMounted(async () => {
  try {
    const [aRes, alRes] = await Promise.all([
      fetch(`${BASE}data/artists.json`),
      fetch(`${BASE}data/albums.json`)
    ])
    if (!aRes.ok || !alRes.ok) throw new Error(`HTTP ${aRes.status}/${alRes.status}`)
    artists.value = await aRes.json()
    albums.value = await alRes.json()
  } catch (e) {
    error.value = `Impossible de charger les albums (${e.message})`
    console.error(e)
  } finally {
    loading.value = false
  }
})

const albumsWithArtist = computed(() => {
  const byArtist = Object.fromEntries(artists.value.map(a => [a.ID_Artist, a]))
  return albums.value.map(alb => ({ ...alb, artist: byArtist[alb.ID_Artist] }))
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
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.card{border:1px solid #ddd;border-radius:12px;padding:12px;background:#fff}
.muted{color:#666;font-size:.95rem}
.error{color:#c00}
</style>
