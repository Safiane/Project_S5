<template>
  <div>
    <section class="hero text-white">
      <div class="overlay"></div>
      <div class="hero-content text-center">
        <h1>Feel the Music</h1>
        <p>Where every beat tells a story.</p>

        <div class="cta-group">
          <router-link to="/artists" class="btn btn-outline-light btn-discover">Artists</router-link>
          <router-link to="/albums" class="btn btn-outline-light btn-discover">Albums</router-link>
          <router-link to="/songs" class="btn btn-outline-light btn-discover">Songs</router-link>
        </div>
      </div>
    </section>

    <footer class="text-center py-3 text-secondary border-top border-secondary">
      Made by Peïo, Safiane and Johnny
    </footer>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Raleway:wght@400;500&display=swap");

.hero {
  position: relative;
  background: url("https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80")
    no-repeat center center/cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-family: "Playfair Display", serif;
  font-size: 4rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.hero p {
  font-family: "Raleway", sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 30px;
}

.cta-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-discover {
  padding: 12px 36px;
  font-size: 1.1rem;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.btn-discover:hover {
  background-color: #fff;
  color: #000;
}
</style>
