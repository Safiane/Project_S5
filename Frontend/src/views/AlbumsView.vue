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
      <p v-if="loading">Loading…</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else class="layout">
        <!-- CREATE / EDIT FORM -->
        <section class="card form-card">
          <h3>{{ isEditing ? 'Edit album' : 'Create new album' }}</h3>

          <form @submit.prevent="submitForm">
            <div class="form-row">
              <label>Title</label>
              <input v-model="form.Album_Title" required />
            </div>
            <div class="form-row">
              <label>Release date</label>
              <input v-model="form.Album_Release_Date" type="date" />
            </div>
            <div class="form-row">
              <label>Type</label>
              <input v-model="form.Album_Type" />
            </div>
            <div class="form-row">
              <label>Record company</label>
              <input v-model="form.Record_Company" />
            </div>
            <div class="form-row">
              <label>Artist</label>
              <select v-model.number="form.ID_Artist" required>
                <option disabled value="">Choose an artist</option>
                <option v-for="a in artists" :key="a.ID_Artist" :value="a.ID_Artist">
                  {{ a.Name }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <label>Collaborations (optional)</label>
              <input v-model="form.Collaborations" />
            </div>

            <div class="buttons">
              <button type="submit" class="btn-primary">
                {{ isEditing ? 'Save changes' : 'Add album' }}
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
          <h3>Album list</h3>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Album</th>
                <th>Artist</th>
                <th>Type</th>
                <th>Release</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alb in albumsWithArtist" :key="alb.ID_Album">
                <td>{{ alb.ID_Album }}</td>
                <td>{{ alb.Album_Title }}</td>
                <td>{{ alb.artist?.Name || '—' }}</td>
                <td>{{ alb.Album_Type }}</td>
                <td>{{ alb.Album_Release_Date }}</td>
                <td class="actions">
                  <button @click="viewDetails(alb)">View</button>
                  <button @click="startEdit(alb)">Edit</button>
                  <button @click="deleteAlbum(alb.ID_Album)">Delete</button>
                </td>
              </tr>
              <tr v-if="albums.length === 0">
                <td colspan="6" class="muted">No albums yet.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- DATASHEET -->
        <section v-if="selectedAlbum" class="card details-card">
          <h3>Album details</h3>
          <p><strong>ID:</strong> {{ selectedAlbum.ID_Album }}</p>
          <p><strong>Title:</strong> {{ selectedAlbum.Album_Title }}</p>
          <p><strong>Artist:</strong> {{ selectedAlbum.artist?.Name || '—' }}</p>
          <p><strong>Release date:</strong> {{ selectedAlbum.Album_Release_Date || '—' }}</p>
          <p><strong>Type:</strong> {{ selectedAlbum.Album_Type || '—' }}</p>
          <p><strong>Record company:</strong> {{ selectedAlbum.Record_Company || '—' }}</p>
          <p><strong>Collaborations:</strong> {{ selectedAlbum.Collaborations || '—' }}</p>
          <button @click="selectedAlbum = null">Close</button>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const BASE = (import.meta?.env?.BASE_URL) || (process?.env?.BASE_URL) || '/'

const artists = ref([])
const albums = ref([])
const loading = ref(true)
const error = ref('')

const selectedAlbum = ref(null)
const isEditing = ref(false)
const form = ref({
  ID_Album: null,
  Album_Title: '',
  Album_Release_Date: '',
  Album_Type: '',
  Record_Company: '',
  Collaborations: '',
  ID_Artist: ''
})

const nextId = computed(() => {
  if (!albums.value.length) return 1
  return Math.max(...albums.value.map(a => a.ID_Album)) + 1
})

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
    error.value = `Unable to load albums (${e.message})`
    console.error(e)
  } finally {
    loading.value = false
  }
})

const albumsWithArtist = computed(() => {
  const byArtist = Object.fromEntries(artists.value.map(a => [a.ID_Artist, a]))
  return albums.value.map(alb => ({ ...alb, artist: byArtist[alb.ID_Artist] }))
})

function resetForm() {
  form.value = {
    ID_Album: null,
    Album_Title: '',
    Album_Release_Date: '',
    Album_Type: '',
    Record_Company: '',
    Collaborations: '',
    ID_Artist: ''
  }
  isEditing.value = false
}

function submitForm() {
  if (!form.value.Album_Title || !form.value.ID_Artist) return

  if (isEditing.value) {
    const idx = albums.value.findIndex(a => a.ID_Album === form.value.ID_Album)
    if (idx !== -1) {
      albums.value[idx] = { ...form.value }
    }
  } else {
    const album = { ...form.value, ID_Album: nextId.value }
    albums.value.push(album)
  }

  resetForm()
}

function startEdit(album) {
  isEditing.value = true
  form.value = { ...album }
}

function cancelEdit() {
  resetForm()
}

function deleteAlbum(id) {
  albums.value = albums.value.filter(a => a.ID_Album !== id)
  if (selectedAlbum.value && selectedAlbum.value.ID_Album === id) {
    selectedAlbum.value = null
  }
}

function viewDetails(album) {
  selectedAlbum.value = { ...album }
}
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
