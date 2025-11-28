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

      <p v-if="loading">Loading…</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else class="layout">
        <!-- FORM -->
        <section class="card form-card">
          <h3>{{ isEditing ? 'Edit song' : 'Create new song' }}</h3>

          <form @submit.prevent="submitForm">
            <div class="form-row">
              <label>Title</label>
              <input v-model="form.Song_Title" required />
            </div>
            <div class="form-row">
              <label>Release date</label>
              <input v-model="form.Song_Release_Date" type="date" />
            </div>
            <div class="form-row">
              <label>Duration (hh:mm:ss)</label>
              <input v-model="form.Duration" />
            </div>
            <div class="form-row">
              <label>Language</label>
              <input v-model="form.Language" />
            </div>
            <div class="form-row">
              <label>Number of listenings</label>
              <input v-model.number="form.Nb_Listening" type="number" min="0" />
            </div>
            <div class="form-row">
              <label>Album</label>
              <select v-model.number="form.ID_Album" required>
                <option disabled value="">Choose an album</option>
                <option v-for="alb in albumsWithArtist" :key="alb.ID_Album" :value="alb.ID_Album">
                  {{ alb.Album_Title }} — {{ alb.artist?.Name }}
                </option>
              </select>
            </div>

            <div class="buttons">
              <button type="submit" class="btn-primary">
                {{ isEditing ? 'Save changes' : 'Add song' }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                class="btn-secondary"
                @click="cancelEdit"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>

        <!-- LIST -->
        <section class="card list-card">
          <h3>Song list</h3>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Song</th>
                <th>Album</th>
                <th>Artist</th>
                <th>Duration</th>
                <th>Listens</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filtered" :key="row.ID_Song">
                <td>{{ row.ID_Song }}</td>
                <td>{{ row.Song_Title }}</td>
                <td>{{ row.album?.Album_Title || '—' }}</td>
                <td>{{ row.artist?.Name || '—' }}</td>
                <td>{{ row.Duration }}</td>
                <td>{{ row.Nb_Listening.toLocaleString() }}</td>
                <td class="actions">
                  <button @click="viewDetails(row)">View</button>
                  <button @click="startEdit(row)">Edit</button>
                  <button @click="deleteSong(row.ID_Song)">Delete</button>
                </td>
              </tr>
              <tr v-if="songs.length === 0">
                <td colspan="7" class="muted">No songs yet.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- DATASHEET -->
        <section v-if="selectedSong" class="card details-card">
          <h3>Song details</h3>
          <p><strong>ID:</strong> {{ selectedSong.ID_Song }}</p>
          <p><strong>Title:</strong> {{ selectedSong.Song_Title }}</p>
          <p><strong>Album:</strong> {{ selectedSong.album?.Album_Title || '—' }}</p>
          <p><strong>Artist:</strong> {{ selectedSong.artist?.Name || '—' }}</p>
          <p><strong>Release date:</strong> {{ selectedSong.Song_Release_Date || '—' }}</p>
          <p><strong>Duration:</strong> {{ selectedSong.Duration || '—' }}</p>
          <p><strong>Language:</strong> {{ selectedSong.Language || '—' }}</p>
          <p><strong>Listens:</strong> {{ selectedSong.Nb_Listening.toLocaleString() }}</p>
          <button @click="selectedSong = null">Close</button>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const API_BASE = 'http://localhost:3000/api'

const q = ref('')

const songs = ref([])
const albums = ref([])
const artists = ref([])
const loading = ref(true)
const error = ref('')

const selectedSong = ref(null)
const isEditing = ref(false)
const form = ref({
  ID_Song: null,
  Song_Title: '',
  Song_Release_Date: '',
  Duration: '',
  Language: '',
  Nb_Listening: 0,
  ID_Album: ''
})

const nextId = computed(() => {
  if (!songs.value.length) return 1
  return Math.max(...songs.value.map(s => s.ID_Song)) + 1
})

async function loadData () {
  loading.value = true
  error.value = ''
  try {
    const [sRes, alRes, aRes] = await Promise.all([
      fetch(`${API_BASE}/songs`),
      fetch(`${API_BASE}/albums`),
      fetch(`${API_BASE}/artists`)
    ])
    if (!sRes.ok || !alRes.ok || !aRes.ok) {
      throw new Error(`HTTP ${sRes.status}/${alRes.status}/${aRes.status}`)
    }
    songs.value = await sRes.json()
    albums.value = await alRes.json()
    artists.value = await aRes.json()
  } catch (e) {
    error.value = `Unable to load songs (${e.message})`
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const albumsWithArtist = computed(() => {
  const byArtist = Object.fromEntries(artists.value.map(a => [a.ID_Artist, a]))
  return albums.value.map(alb => ({ ...alb, artist: byArtist[alb.ID_Artist] }))
})

const joined = computed(() => {
  const albumById = Object.fromEntries(albumsWithArtist.value.map(a => [a.ID_Album, a]))
  return songs.value.map(s => {
    const album = albumById[s.ID_Album]
    const artist = album ? album.artist : null
    return { ...s, album, artist }
  })
})

const filtered = computed(() => {
  const needle = q.value.toLowerCase()
  if (!needle) return joined.value

  return joined.value.filter(r =>
    [r.Song_Title, r.album?.Album_Title, r.artist?.Name]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  )
})

function resetForm () {
  form.value = {
    ID_Song: null,
    Song_Title: '',
    Song_Release_Date: '',
    Duration: '',
    Language: '',
    Nb_Listening: 0,
    ID_Album: ''
  }
  isEditing.value = false
}

function submitForm () {
  if (!form.value.Song_Title || !form.value.ID_Album) return

  const normalized = {
    ...form.value,
    Nb_Listening: Number(form.value.Nb_Listening) || 0,
    ID_Album: Number(form.value.ID_Album)
  }

  if (isEditing.value) {
    const idx = songs.value.findIndex(s => s.ID_Song === form.value.ID_Song)
    if (idx !== -1) {
      songs.value[idx] = { ...normalized }
    }
  } else {
    const song = { ...normalized, ID_Song: nextId.value }
    songs.value.push(song)
  }

  resetForm()
}

function startEdit (row) {
  isEditing.value = true
  form.value = {
    ID_Song: row.ID_Song,
    Song_Title: row.Song_Title,
    Song_Release_Date: row.Song_Release_Date,
    Duration: row.Duration,
    Language: row.Language,
    Nb_Listening: row.Nb_Listening,
    ID_Album: row.ID_Album
  }
}

function cancelEdit () {
  resetForm()
}

function deleteSong (id) {
  songs.value = songs.value.filter(s => s.ID_Song !== id)
  if (selectedSong.value && selectedSong.value.ID_Song === id) {
    selectedSong.value = null
  }
}

function viewDetails (row) {
  selectedSong.value = { ...row }
}
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
.layout{display:grid;grid-template-columns:minmax(260px,1.2fr) minmax(260px,2fr) minmax(220px,1fr);gap:16px;align-items:flex-start}
.card{border:1px solid #ddd;border-radius:12px;padding:12px;background:#fff}
.form-row{display:flex;flex-direction:column;margin-bottom:8px}
.form-row label{font-size:.9rem;margin-bottom:2px}
.form-row input,.form-row select{padding:6px 8px;border-radius:6px;border:1px solid #ccc}
.buttons{margin-top:8px}
.buttons button{margin-right:6px}
.table{width:100%;border-collapse:collapse;font-size:.9rem}
th,td{border:1px solid #eee;padding:6px 8px;text-align:left}
.actions button{margin-right:4px}
.muted{color:#666;font-size:.9rem}
.error{color:#c00}
@media (max-width: 980px){.layout{grid-template-columns:1fr}}
</style>
