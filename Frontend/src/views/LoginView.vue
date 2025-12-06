<template>
  <div class="page">
    <section class="page-hero">
      <div class="page-hero-inner">
        <div>
          <h1>Login</h1>
          <p>Sign in to manage artists, albums and songs.</p>
        </div>
        <div class="pill">
          <span class="dot"></span>
          <span>{{ currentRoleLabel }}</span>
        </div>
      </div>
    </section>

    <section class="page-grid">
      <div class="card form-card">
        <div class="card-header">
          <h2>Welcome back</h2>
          <span class="tag">Secure area</span>
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <form class="form" @submit.prevent="handleLogin">
  <!-- LOGIN PART -->
  <div class="field">
    <label for="username">Username</label>
    <input
      id="username"
      v-model="username"
      type="text"
      required
      placeholder="admin or user"
    />
  </div>

  <div class="field">
    <label for="password">Password</label>
    <input
      id="password"
      v-model="password"
      type="password"
      required
      placeholder="Your password"
    />
  </div>

  <div class="form-actions">
    <button class="btn primary" type="submit" :disabled="loading">
      {{ loading ? 'Signing in…' : 'Login' }}
    </button>
    <button
      v-if="isLoggedIn"
      class="btn ghost"
      type="button"
      @click="handleLogout"
    >
      Logout
    </button>
  </div>

  <p class="hint">
    Demo accounts: <strong>admin / admin</strong> (ADMIN) or
    <strong>user / admin</strong> (USER).
  </p>
</form>

<hr class="divider" />

<form class="form" @submit.prevent="handleRegister">
  <div class="field">
    <label for="newUsername">New username</label>
    <input
      id="newUsername"
      v-model="newUsername"
      type="text"
      required
      placeholder="Choose a username"
    />
  </div>

  <div class="field">
    <label for="newPassword">New password</label>
    <input
      id="newPassword"
      v-model="newPassword"
      type="password"
      required
      placeholder="Choose a password"
    />
  </div>

  <div class="form-actions">
    <button class="btn secondary" type="submit" :disabled="loadingRegister">
      {{ loadingRegister ? 'Creating…' : 'Create account' }}
    </button>
  </div>
</form>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE = 'http://localhost:3000'

const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const newUsername = ref('')
const newPassword = ref('')
const loadingRegister = ref(false)

const storedUser = ref(loadStoredUser())

function loadStoredUser () {
  try {
    const raw = localStorage.getItem('sonity_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const isLoggedIn = computed(() => !!storedUser.value)
const currentRoleLabel = computed(() => {
  if (!storedUser.value) return 'Not logged in'
  return `Logged as ${storedUser.value.name} · ${storedUser.value.role}`
})

async function handleLogin () {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // garder le cookie de session
      body: JSON.stringify({
        username: username.value,
        userpass: password.value
      })
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const json = await res.json()
    if (!json.loginResult) {
      throw new Error('Invalid username or password')
    }

    // appeler une petite route pour récupérer le user courant
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include'
    })

    let userPayload = { name: username.value, role: 'USER' }
    if (meRes.ok) {
      const meJson = await meRes.json()
      if (meJson && meJson.user) {
        userPayload = {
          id: meJson.user.user_id,
          name: meJson.user.user_name,
          role: meJson.user.user_role
        }
      }
    }

    localStorage.setItem('sonity_user', JSON.stringify(userPayload))
    storedUser.value = userPayload
    success.value = 'Login successful. Redirecting…'
    setTimeout(() => {
      router.push('/')
    }, 800)
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

function handleLogout () {
  // côté backend : optionnel /auth/logout, mais pour l’instant on vide juste le front
  localStorage.removeItem('sonity_user')
  storedUser.value = null
  username.value = ''
  password.value = ''
  error.value = ''
  success.value = 'You are now logged out.'
}

async function handleRegister () {
  error.value = ''
  success.value = ''
  loadingRegister.value = true

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: newUsername.value,
        userpass: newPassword.value
      })
    })

    const json = await res.json()
    if (!res.ok || !json.registerResult) {
      throw new Error(json.message || `HTTP ${res.status}`)
    }

    success.value = 'Account created. You can now login.'
    newUsername.value = ''
    newPassword.value = ''
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Registration failed'
  } finally {
    loadingRegister.value = false
  }
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

.page-grid {
  max-width: 480px;
  margin: 0 auto;
}

.card {
  background: #151515;
  border-radius: 18px;
  border: 1px solid #3a3a3a;
  padding: 18px 18px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
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

.alert-success {
  background: rgba(0, 174, 239, 0.08);
  border: 1px solid rgba(0, 174, 239, 0.6);
  color: #aee9ff;
}

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

input:focus {
  outline: none;
  border-color: #00aeef;
  box-shadow: 0 0 0 1px rgba(0, 174, 239, 0.6);
}

.form-actions {
  display: flex;
  justify-content: center;
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

.btn.primary:hover:enabled {
  background: #f8c500;
}

.btn.primary:disabled {
  opacity: 0.7;
  cursor: default;
}

.btn.ghost {
  border-color: #ffd400;
  color: #ffd400;
}

.btn.ghost:hover {
  background: #ffd50029;
}

.hint {
  margin-top: 10px;
  font-size: 0.78rem;
  color: #8a8a8a;
}


.divider {
  margin: 16px 0;
  border: 0;
  border-top: 1px solid #3a3a3a;
}

</style>
