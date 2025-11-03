<template>
  <div>
    <section class="hero text-white">
      <div class="overlay"></div>
      <div class="hero-content text-center">
        <h1>Songs</h1>
        <p>Tracks, plays and more.</p>
        <div class="cta-group">
          <router-link to="/" class="btn btn-outline-light btn-discover">Home</router-link>
          <router-link to="/artists" class="btn btn-outline-light btn-discover">Artists</router-link>
          <router-link to="/albums" class="btn btn-outline-light btn-discover">Albums</router-link>
        </div>
      </div>
    </section>

    <main class="container">
      <div class="toolbar">
        <input v-model="q" placeholder="Search song / album / artist..." />
      </div>

      <p v-if="loading">Chargement…</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else class="grid">
        <div v-for="row in filtered" :key="row.ID_Song" class="card">
          <h3>{{ row.Song_Title }}</h3>
          <p class="muted">{{ row.Song_Release_Date }} • {{ row.Duration }}</p>
          <p>Album: <strong>{{ row.album?.Album_Title ?? '—' }}</strong></p>
          <p>Artist: <strong>{{ row.artist?.Name ?? '—' }}</strong></p>
          <p class="muted">Listens: {{ row.Nb_Listening.toLocaleString() }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const BASE = (import.meta?.env?.BASE_URL) || (process?.env?.BASE_URL) || '/'

const q = ref('')
const songs = ref([]), albums = ref([]), artists = ref([])
const loading = ref(true), error = ref('')

onMounted(async () => {
  try {
    const [sRes, alRes, aRes] = await Promise.all([
      fetch(`${BASE}data/songs.json`),
      fetch(`${BASE}data/albums.json`),
      fetch(`${BASE}data/artists.json`)
    ])
    if (!sRes.ok || !alRes.ok || !aRes.ok) throw new Error(`HTTP ${sRes.status}/${alRes.status}/${aRes.status}`)
    songs.value  = await sRes.json()
    albums.value = await alRes.json()
    artists.value = await aRes.json()
  } catch (e) {
    error.value = `Impossible de charger les chansons (${e.message})`
    console.error(e)
  } finally {
    loading.value = false
  }
})

const joined = computed(() => {
  const albumById  = Object.fromEntries(albums.value.map(a => [a.ID_Album, a]))
  const artistById = Object.fromEntries(artists.value.map(a => [a.ID_Artist, a]))
  return songs.value.map(s => {
    const album = albumById[s.ID_Album]
    const artist = album ? artistById[album.ID_Artist] : null
    return { ...s, album, artist }
  })
})

const filtered = computed(() => {
  const needle = q.value.toLowerCase()
  return joined.value.filter(r =>
    [r.Song_Title, r.album?.Album_Title, r.artist?.Name]
      .join(' ').toLowerCase().includes(needle)
  )
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Raleway:wght@400;500&display=swap");
.hero{position:relative;background:url("https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80") no-repeat center/cover;height:40vh;display:flex;align-items:center;justify-content:center;text-align:center}
.overlay{position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.8))}
.hero-content{position:relative;z-index:2}
.hero h1{font-family:"Playfair Display",serif;font-size:3rem;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}
.hero p{font-family:"Raleway",sans-serif;font-size:1.1rem;margin-bottom:18px}
.cta-group{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-discover{padding:10px 26px;border-radius:30px;border:1px solid #fff;transition:.2s}
.btn-discover:hover{background:#fff;color:#000}
.container{max-width:1100px;margin:24px auto;padding:0 16px}
.toolbar{display:flex;justify-content:center;margin-bottom:12px}
.toolbar input{padding:10px 14px;border:1px solid #ccc;border-radius:30px;min-width:320px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.card{border:1px solid #ddd;border-radius:12px;padding:12px;background:#fff}
.muted{color:#666;font-size:.95rem}
.error{color:#c00}
</style>
