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
      <p v-if="loading">Loading…</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else class="layout">
        <!-- CREATE / EDIT FORM -->
        <section class="card form-card">
          <h3>{{ isEditing ? 'Edit artist' : 'Create new artist' }}</h3>

          <form @submit.prevent="submitForm">
            <div class="form-row">
              <label>Name</label>
              <input v-model="form.Name" required />
            </div>
            <div class="form-row">
              <label>Style</label>
              <input v-model="form.Style" />
            </div>
            <div class="form-row">
              <label>Country</label>
              <input v-model="form.Country" />
            </div>
            <div class="form-row">
              <label>Gender</label>
              <input v-model="form.Gender" />
            </div>
            <div class="form-row">
              <label>Start date</label>
              <input v-model="form.Start_Date" type="date" />
            </div>

            <div class="buttons">
              <button type="submit" class="btn-primary">
                {{ isEditing ? 'Save changes' : 'Add artist' }}
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
          <h3>Artist list</h3>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Style</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in artists" :key="a.ID_Artist">
                <td>{{ a.ID_Artist }}</td>
                <td>{{ a.Name }}</td>
                <td>{{ a.Style }}</td>
                <td>{{ a.Country }}</td>
                <td class="actions">
                  <button @click="viewDetails(a)">View</button>
                  <button @click="startEdit(a)">Edit</button>
                  <button @click="deleteArtist(a.ID_Artist)">Delete</button>
                </td>
              </tr>
              <tr v-if="artists.length === 0">
                <td colspan="5" class="muted">No artists yet.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- DATASHEET -->
        <section v-if="selectedArtist" class="card details-card">
          <h3>Artist details</h3>
          <p><strong>ID:</strong> {{ selectedArtist.ID_Artist }}</p>
          <p><strong>Name:</strong> {{ selectedArtist.Name }}</p>
          <p><strong>Style:</strong> {{ selectedArtist.Style }}</p>
          <p><strong>Country:</strong> {{ selectedArtist.Country }}</p>
          <p><strong>Gender:</strong> {{ selectedArtist.Gender || '—' }}</p>
          <p><strong>Start date:</strong> {{ formatDate(selectedArtist.Start_Date) }}</p>
          <button @click="selectedArtist = null">Close</button>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const API_BASE = 'http://localhost:3000'

const artists = ref([])
const loading = ref(true)
const error = ref('')

const selectedArtist = ref(null)
const isEditing = ref(false)
const form = ref({
  ID_Artist: null,
  Name: '',
  Style: '',
  Country: '',
  Gender: '',
  Start_Date: ''
})

const nextId = computed(() => {
  if (!artists.value.length) return 1
  return Math.max(...artists.value.map(a => a.ID_Artist)) + 1
})

async function loadArtists () {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/artistsapi/list`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (!Array.isArray(json)) throw new Error('Unexpected JSON format')
    artists.value = json
  } catch (e) {
    error.value = `Unable to load artists (${e.message})`
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadArtists)

function resetForm () {
  form.value = {
    ID_Artist: null,
    Name: '',
    Style: '',
    Country: '',
    Gender: '',
    Start_Date: ''
  }
  isEditing.value = false
}

async function submitForm () {
  if (!form.value.Name) return

  const id = isEditing.value ? form.value.ID_Artist : 0

  try {
    const res = await fetch(`${API_BASE}/artistsapi/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadArtists()
    resetForm()
  } catch (e) {
    error.value = `Unable to save artist (${e.message})`
    console.error(e)
  }
}

function startEdit (artist) {
  isEditing.value = true
  form.value = { ...artist }
}

function cancelEdit () {
  resetForm()
}

async function deleteArtist (id) {
  try {
    const res = await fetch(`${API_BASE}/artistsapi/del/${id}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadArtists()
    if (selectedArtist.value && selectedArtist.value.ID_Artist === id) {
      selectedArtist.value = null
    }
  } catch (e) {
    // L'artiste a encore des albums (contrainte de clé étrangère)
    error.value = 'impossible to remove this artist: he still has albums'
    console.error(e)
  }
}


function viewDetails (artist) {
  selectedArtist.value = { ...artist }
}

function formatDate (value) {
  if (!value) return '—'
  return String(value).split('T')[0]
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
.form-row input{padding:6px 8px;border-radius:6px;border:1px solid #ccc}
.buttons{margin-top:8px}
.buttons button{margin-right:6px}
.table{width:100%;border-collapse:collapse;font-size:.9rem}
th,td{border:1px solid #eee;padding:6px 8px;text-align:left}
.actions button{margin-right:4px}
.muted{color:#666;font-size:.9rem}
.error{color:#c00}
@media (max-width: 980px){.layout{grid-template-columns:1fr}}
</style>
