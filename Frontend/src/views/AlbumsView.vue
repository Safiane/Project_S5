<template>
  <div>
    <section class="hero text-white">
      <div class="overlay"></div>
      <div class="hero-content text-center">
        <h1>Albums</h1>
        <p>Explore albums and their creators.</p>
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
        <!-- FORM -->
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
              <label>Collaborations</label>
              <input v-model="form.Collaborations" />
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
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alb in albumsWithArtist" :key="alb.ID_Album">
                <td>{{ alb.ID_Album }}</td>
                <td>{{ alb.Album_Title }}</td>
                <td>{{ alb.artist?.Name || '—' }}</td>
                <td>{{ alb.Album_Type }}</td>
                <td>{{ alb.Record_Company }}</td>
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
          <p><strong>Release date:</strong> {{ formatDate(selectedAlbum.Album_Release_Date) }}</p>
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

const API_BASE = 'http://localhost:3000'

const albums = ref([])
const artists = ref([])
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

async function loadData () {
  loading.value = true
  error.value = ''
  try {
    const [alRes, arRes] = await Promise.all([
      fetch(`${API_BASE}/albumsapi/list`),
      fetch(`${API_BASE}/artistsapi/list`)
    ])
    if (!alRes.ok || !arRes.ok) {
      throw new Error(`HTTP ${alRes.status}/${arRes.status}`)
    }
    albums.value = await alRes.json()
    artists.value = await arRes.json()
  } catch (e) {
    error.value = `Unable to load albums (${e.message})`
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

function resetForm () {
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

async function submitForm () {
  if (!form.value.Album_Title || !form.value.ID_Artist) return

  const normalized = {
    ...form.value,
    ID_Artist: Number(form.value.ID_Artist) || null
  }

  const id = isEditing.value ? form.value.ID_Album : 0

  try {
    const res = await fetch(`${API_BASE}/albumsapi/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadData()
    resetForm()
  } catch (e) {
    error.value = `Unable to save album (${e.message})`
    console.error(e)
  }
}

function startEdit (alb) {
  isEditing.value = true
  form.value = {
    ID_Album: alb.ID_Album,
    Album_Title: alb.Album_Title,
    Album_Release_Date: alb.Album_Release_Date,
    Album_Type: alb.Album_Type,
    Record_Company: alb.Record_Company,
    Collaborations: alb.Collaborations,
    ID_Artist: alb.ID_Artist
  }
}

function cancelEdit () {
  resetForm()
}

async function deleteAlbum (id) {
  try {
    const res = await fetch(`${API_BASE}/albumsapi/del/${id}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadData()
    if (selectedAlbum.value && selectedAlbum.value.ID_Album === id) {
      selectedAlbum.value = null
    }
  } catch (e) {
    // L'album a encore des chansons
    error.value = 'impossible to delete this album: it still has songs on it'
    console.error(e)
  }
}


function viewDetails (alb) {
  selectedAlbum.value = { ...alb }
}

function formatDate (value) {
  if (!value) return '—'
  return String(value).split('T')[0]
}

</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Raleway:wght@400;500&display=swap");
.hero{position:relative;background:url("https://images.unsplash.com/photo-1526481280695-3c687fd543c0?auto=format&fit=crop&w=1600&q=80") no-repeat center/cover;height:40vh;display:flex;align-items:center;justify-content:center;text-align:center}
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
