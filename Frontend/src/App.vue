<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">🎧 MusicWorld</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/artists">Artists</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/albums">Albums</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/songs">Songs</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style>
body { margin: 0; }
#app { margin-top: 56px; }
</style>
