<template>
  <div class="page">
    <section class="page-hero">
      <div class="page-hero-inner">
        <div>
          <h1>Songs</h1>
          <p>Tracks, plays and more.</p>
        </div>
        <div class="pill">
          <span class="dot"></span>
          <span>{{ songs.length }} song(s)</span>
        </div>
      </div>
    </section>

    <section class="page-grid" :class="{ 'single-column': !isAdmin }">
      <!-- Form -->
      <div class="card form-card" v-if="isAdmin">
        <div class="card-header">
          <h2>{{ isEditing ? 'Edit song' : 'Create new song' }}</h2>
          <span class="tag">{{ isEditing ? 'Editing' : 'New' }}</span>
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <form @submit.prevent="submitForm" class="form">
          <div class="field">
            <label for="title">Title</label>
            <input
              id="title"
              v-model="form.Song_Title"
              type="text"
              required
              placeholder="Song title"
            />
          </div>

          <div class="field-group">
            <div class="field">
              <label for="releaseDate">Release date</label>
              <input
                id="releaseDate"
                v-model="form.Song_Release_Date"
                type="date"
              />
            </div>
            <div class="field">
              <label for="duration">Duration (hh:mm:ss)</label>
              <input
                id="duration"
                v-model="form.Duration"
                type="text"
                placeholder="00:00"
              />
            </div>
          </div>

          <div class="field-group">
            <div class="field">
              <label for="language">Language</label>
              <input
                id="language"
                v-model="form.Language"
                type="text"
                placeholder="EN, FR..."
              />
            </div>
            <div class="field">
              <label for="listens">Number of listens</label>
              <input
                id="listens"
                v-model.number="form.Nb_Listening"
                type="number"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div class="field">
            <label for="album">Album</label>
            <select
              id="album"
              v-model.number="form.ID_Album"
              required
            >
              <option disabled value="">Choose an album</option>
              <option
                v-for="alb in albumsWithArtist"
                :key="alb.ID_Album"
                :value="alb.ID_Album"
              >
                {{ alb.Album_Title }} — {{ alb.artist?.Name }}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn primary">
              {{ isEditing ? 'Save changes' : 'Create song' }}
            </button>
            <button
              v-if="isEditing"
              type="button"
              class="btn ghost"
              @click="cancelEdit"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="card list-card">
        <div class="card-header">
          <h2>Song list</h2>
        </div>

        <div v-if="songs.length === 0" class="muted">
          No songs yet.
        </div>

        <div v-else>
          <div class="field search-field">
            <label for="search">Search song</label>
            <input
              id="search"
              v-model="search"
              type="text"
              placeholder="Type a song, album or artist..."
            />
          </div>

          <div class="table-wrapper">
            <table class="artist-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th @click="toggleSort('Song_Title')" class="sortable">Song</th>
                  <th @click="toggleSort('albumTitle')" class="sortable">Album</th>
                  <th @click="toggleSort('artistName')" class="sortable">Artist</th>
                  <th>Duration</th>
                  <th @click="toggleSort('Nb_Listening')" class="sortable">Listens</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in sortedSongs"
                  :key="row.ID_Song"
                  :class="{ active: selectedSong && selectedSong.ID_Song === row.ID_Song }"
                >
                  <td>{{ row.ID_Song }}</td>
                  <td>{{ row.Song_Title }}</td>
                  <td>{{ row.album?.Album_Title || '—' }}</td>
                  <td>{{ row.artist?.Name || '—' }}</td>
                  <td>{{ row.Duration }}</td>
                  <td>{{ row.Nb_Listening.toLocaleString() }}</td>
                  <td class="actions">
                    <button class="btn xs ghost" @click="viewDetails(row)">View</button>
                    <button v-if="isAdmin" class="btn xs secondary" @click="startEdit(row)">Edit</button>
                    <button v-if="isAdmin" class="btn xs danger" @click="deleteSong(row.ID_Song)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Details Drawer -->
      <transition name="fade-slide">
        <div
          v-if="selectedSong"
          class="details-drawer"
        >
          <div class="drawer-header">
            <h2>Song details</h2>
            <button class="btn xs ghost" @click="selectedSong = null">Close</button>
          </div>

          <div class="details">
            <dl>
              <div class="row">
                <dt>ID</dt>
                <dd>{{ selectedSong.ID_Song }}</dd>
              </div>
              <div class="row">
                <dt>Title</dt>
                <dd>{{ selectedSong.Song_Title }}</dd>
              </div>
              <div class="row">
                <dt>Album</dt>
                <dd>{{ selectedSong.album?.Album_Title || '—' }}</dd>
              </div>
              <div class="row">
                <dt>Artist</dt>
                <dd>{{ selectedSong.artist?.Name || '—' }}</dd>
              </div>
              <div class="row">
                <dt>Release date</dt>
                <dd>{{ formatDate(selectedSong.Song_Release_Date) }}</dd>
              </div>
              <div class="row">
                <dt>Duration</dt>
                <dd>{{ selectedSong.Duration || '—' }}</dd>
              </div>
              <div class="row">
                <dt>Language</dt>
                <dd>{{ selectedSong.Language || '—' }}</dd>
              </div>
              <div class="row">
                <dt>Listens</dt>
                <dd>{{ selectedSong.Nb_Listening.toLocaleString() }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup>

const currentUser = ref(null)

function loadCurrentUser () {
  try {
    const raw = localStorage.getItem('sonity_user')
    currentUser.value = raw ? JSON.parse(raw) : null
  } catch {
    currentUser.value = null
  }
}

const isAdmin = computed(() => currentUser.value?.role === 'ADMIN')

loadCurrentUser()


import { ref, onMounted, computed } from 'vue'

const API_BASE = 'http://localhost:3000'

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
      fetch(`${API_BASE}/songsapi/list`, {
        credentials: 'include',           // <--
      }),
      fetch(`${API_BASE}/albumsapi/list`, {
        credentials: 'include',           // <--
      }),
      fetch(`${API_BASE}/artistsapi/list`, {
        credentials: 'include',           // <--
      })
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

/* SEARCH + SORT */

const search = ref('')
const sortBy = ref('Song_Title')   // 'Song_Title', 'albumTitle', 'artistName', 'Nb_Listening'
const sortDir = ref('asc')

const filtered = computed(() => {
  const needle = search.value.toLowerCase().trim()
  if (!needle) return joined.value

  return joined.value.filter(r =>
    [r.Song_Title, r.album?.Album_Title, r.artist?.Name]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  )
})

const sortedSongs = computed(() => {
  return [...filtered.value].sort((a, b) => {
    let va
    let vb

    if (sortBy.value === 'albumTitle') {
      va = (a.album?.Album_Title || '').toLowerCase()
      vb = (b.album?.Album_Title || '').toLowerCase()
    } else if (sortBy.value === 'artistName') {
      va = (a.artist?.Name || '').toLowerCase()
      vb = (b.artist?.Name || '').toLowerCase()
    } else if (sortBy.value === 'Nb_Listening') {
      va = Number(a.Nb_Listening) || 0
      vb = Number(b.Nb_Listening) || 0
    } else {
      va = (a[sortBy.value] || '').toString().toLowerCase()
      vb = (b[sortBy.value] || '').toString().toLowerCase()
    }

    if (va < vb) return sortDir.value === 'asc' ? -1 : 1
    if (va > vb) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })
})

function toggleSort (field) {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDir.value = 'asc'
  }
}

/* CRUD FORM */

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

async function submitForm () {
  if (!form.value.Song_Title || !form.value.ID_Album) return

  const normalized = {
    ...form.value,
    Nb_Listening: Number(form.value.Nb_Listening) || 0,
    ID_Album: Number(form.value.ID_Album)
  }

  const id = isEditing.value ? form.value.ID_Song : 0

  try {
    const res = await fetch(`${API_BASE}/songsapi/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',            // <--
      body: JSON.stringify(normalized)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadData()
    resetForm()
  } catch (e) {
    error.value = `Unable to save song (${e.message})`
    console.error(e)
  }
}

function startEdit (row) {
  isEditing.value = true
  form.value = {
    ID_Song: row.ID_Song,
    Song_Title: row.Song_Title,
    Song_Release_Date: row.Song_Release_Date
      ? String(row.Song_Release_Date).split('T')[0]
      : '',
    Duration: row.Duration,
    Language: row.Language,
    Nb_Listening: row.Nb_Listening,
    ID_Album: row.ID_Album
  }
}

function cancelEdit () {
  resetForm()
}

async function deleteSong (id) {
  try {
    const res = await fetch(`${API_BASE}/songsapi/del/${id}`, {
      credentials: 'include',            // <--
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await loadData()
    if (selectedSong.value && selectedSong.value.ID_Song === id) {
      selectedSong.value = null
    }
  } catch (e) {
    error.value = 'This song cannot be deleted'
    console.error(e)
  }
}

/* DETAILS + FORMATTING */

function viewDetails (row) {
  selectedSong.value = { ...row }
}

function formatDate (value) {
  if (!value) return '—'
  return String(value).split('T')[0]
}
</script>


<style scoped>
.page {
  min-height: calc(100vh - 56px);
  background: #0d0d0d;
  color: #f5f5f5;
  padding: 72px 18px 24px;
}

.page-hero {
  max-width: 1080px;
  margin: 0 auto 16px;
}

.page-hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.page-hero h1 {
  margin: 0;
  font-size: 1.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.page-hero p {
  margin: 4px 0 0;
  color: #b0b0b0;
  font-size: 0.9rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #3a3a3a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.8rem;
  color: #ffd400;
}

.pill .dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #00aeef;
  box-shadow: 0 0 10px rgba(0, 174, 239, 0.9);
}

/* GRID */

.page-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.7fr 1.5fr; /* form plus petite, liste plus large */
  gap: 18px;
}

  
.form-card,
.list-card,
.details-card {
  align-self: flex-start;
}

/* CARDS */

.card {
  background: #151515;
  border-radius: 18px;
  border: 1px solid #3a3a3a;
  padding: 14px 16px 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}

.form-card {
  position: sticky;
  top: 72px;              /* même ordre de grandeur que le padding top de .page */
  align-self: flex-start; /* garde la hauteur du contenu */
}

.list-card {
  background: #151515;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06); /* comme les labels */
  padding: 14px 16px 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.card-header h2 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b0b0b0;
}

.tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffd400;
}

/* ALERT */

.alert {
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.alert-error {
  background: rgba(240, 58, 71, 0.08);
  border: 1px solid rgba(240, 58, 71, 0.6);
  color: #ffb3b9;
}

/* FORM */

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}


.field-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

}

.field-group .field {
  flex: 1;
  min-width: 0;

}

label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #b0b0b0;
}

input {
  background: #101010;
  border-radius: 10px;
  border: 1px solid #3a3a3a;
  padding: 7px 9px;
  color: #b0b0b0;
  font-size: 0.85rem;
  width: 100%;
  box-sizing: border-box;
}

select {
  background: #101010;
  border-radius: 10px;
  border: 1px solid #3a3a3a;
  padding: 7px 9px;
  color: #b0b0b0;
  font-size: 0.85rem;
  width: 100%;
  box-sizing: border-box;
  appearance: none;          /* enlève le style natif trop blanc */
}

/* même focus que les inputs */
select:focus {
  outline: none;
  border-color: #00aeef;
  box-shadow: 0 0 0 1px rgba(0, 174, 239, 0.6);
}


input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(1.4); /* icône claire sur fond sombre */
  cursor: pointer;
}

input:focus {
  outline: none;
  border-color: #00aeef;
  box-shadow: 0 0 0 1px rgba(0, 174, 239, 0.6);
}

/* BUTTONS */

.form-actions {
  display: flex;
  justify-content: center;  /* centre les boutons horizontalement */
  gap: 8px;
  margin-top: 4px;
}


.btn {
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 7px 14px;
  background: transparent;
  color: #ffd400;
  cursor: pointer;
}

.btn.primary {
  background: #ffd400;
  color: #0d0d0d;
}

.btn.primary:hover {
  background: #f8c500;
}

.btn.secondary {
  border-color: #00aeef;
  color: #00aeef;
}

.btn.secondary:hover {
  background: rgba(0, 174, 239, 0.12);
}

.btn.ghost {
  border-color: #ffd400;
  color: #ffd400;
}

.btn.ghost:hover {
  background: #ffd50029;
}

.btn.danger {
  border-color: #f03a47;
  color: #f03a47;
}

.btn.danger:hover {
  background: rgba(240, 58, 71, 0.14);
}

.btn.xs {
  padding: 4px 8px;
  font-size: 0.7rem;
}

.actions .btn {
  margin-left: 4px;
}

/* TABLE */

.table-wrapper {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06); /* même esprit que tes inputs */
  background: #101010;
  overflow: hidden; /* pour que la table respecte le radius */
}

/* table 100 % custom, plus aucun style Bootstrap */
.artist-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  background: transparent;   /* c’est le wrapper qui gère le fond */
  color: #f5f5f5;
}

.artist-table th,
.artist-table td {
  padding: 10px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.artist-table th {
  background: #151515;
  color: #b0b0b0;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.7rem;
}

.artist-table tr {
  transition: background 0.15s ease-out, box-shadow 0.15s ease-out;
}


/* survol : léger encadrement */

.artist-table tr:hover {
  background: rgba(255, 255, 255, 0.02);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

/* ligne “active” (celle du détail) un peu plus marquée, dans ta palette */
.artist-table tr.active {
  background: rgba(255, 212, 0, 0.04);
  box-shadow: inset 0 0 0 1px rgba(255, 212, 0, 0.25);
}


.actions {
  text-align: right;
  white-space: nowrap;
}

/* DETAILS */

.details {
  font-size: 0.85rem;
}

.details dl {
  margin: 0;
}

.details .row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
}

.details dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #9a9a9a;
}

.details dd {
  margin: 0;
  font-weight: 500;
  color : #f5f5f5
}

.muted {
  font-size: 0.8rem;
  color: #8a8a8a;
}

/* RESPONSIVE */

@media (max-width: 960px) {
  .page-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto auto;
  }

  .details-card {
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .page {
    padding-top: 70px;
  }

  .page-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .page-hero-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

.details-drawer {
  position: fixed;
  right: 24px;
  top: 88px;
  max-width: 320px;
  width: 100%;
  max-height: calc(100vh - 120px); /* limite en hauteur */
  background: #151515;
  border-radius: 18px;
  border: 1px solid #3a3a3a;
  padding: 14px 16px 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  z-index: 900;
  overflow-y: auto;              /* scroll interne si contenu long */
}


.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

/* anim */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

th.sortable {
  cursor: pointer;
}
th.sortable::after {
  content: ' ⇅';
  font-size: 0.7rem;
  opacity: 0.5;
}
.search-field {
  margin-bottom: 10px;    /* espace entre la barre de recherche et la table */
}

.page-grid.single-column {
  grid-template-columns: minmax(0, 1fr);
}


</style>



