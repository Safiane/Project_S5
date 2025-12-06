<template>
  <div id="app">
    <nav class="top-nav">
      <div class="nav-inner">
        <router-link class="brand" to="/">
          <span class="brand-icon">🎧</span>
          <span class="brand-text">Sonity</span>
        </router-link>

        <button
          class="nav-toggle"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          ☰
        </button>

        <div class="nav-links" id="navbarNav">
          <router-link class="nav-link" to="/">Home</router-link>
          <router-link class="nav-link" to="/artists">Artists</router-link>
          <router-link class="nav-link" to="/albums">Albums</router-link>
          <router-link class="nav-link" to="/songs">Songs</router-link>
        </div>
        <div class="nav-user">
          <router-link class="nav-link" to="/login">
            {{ currentUser ? currentUser.name + ' · ' + currentUser.role : 'Login / Sign up' }}
          </router-link>
        </div>
      </div>
    </nav>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentUser = ref(null)

function loadUser () {
  try {
    const raw = localStorage.getItem('sonity_user')
    currentUser.value = raw ? JSON.parse(raw) : null
  } catch {
    currentUser.value = null
  }
}

onMounted(loadUser)

// recharger le user quand on change de page (notamment après /login)
watch(
  () => route.fullPath,
  () => loadUser()
)
</script>



<style>
body {
  margin: 0;
  background: #0d0d0d;
  color: #f5f5f5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#app {
  min-height: 100vh;
}

/* NAVBAR */

.top-nav {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 1000;
  background: rgba(13, 13, 13, 0.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #3a3a3a;
}

.nav-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Brand */

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.brand-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: radial-gradient(circle at 30% 0%, #ffd400, #f03a47);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 0 16px rgba(240, 58, 71, 0.6);
}

.brand-text {
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: #ffffff;
}

/* Links */

.nav-links {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-link {
  position: relative;
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b0b0b0;
  padding-bottom: 4px;
}

.nav-link.router-link-active {
  color: #ffd400;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, #ffd400, #00aeef);
  transition: width 0.16s ease-out;
}

.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link:hover {
  color: #ffffff;
}

/* Toggle (simple) */

.nav-toggle {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.3rem;
}

/* Main */

.app-main {
  padding-top: 56px;
}

.nav-user {
  margin-left: 12px;
}

</style>
