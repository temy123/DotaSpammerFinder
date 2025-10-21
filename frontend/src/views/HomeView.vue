<template>
  <div class="home-container">
    <div class="content-wrapper">
      <div class="hero-image-container">
        <div class="hero-image"></div>
      </div>
      <div class="search-container">
        <label for="searchInput" class="search-label">Search</label>
        <input type="text" id="searchInput" class="search-input" placeholder="플레이어 아이디 (ex: 심해어 짱고 ...)">
      </div>
    </div>
  </div>
</template>

<style> /* Removed scoped attribute */
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
}

.content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.hero-image-container {
  margin-bottom: 2rem;
}

.hero-image {
  width: 250px;
  height: 445px;
  background-image: url('/img/heroes/morphling.png');
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}

.search-container {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  background-color: #2d323a;
  border-radius: 50px;
  padding: 1rem 1.5rem;
  text-align: left;
}

.search-label {
  display: block;
  font-size: 0.9rem;
  color: #adb5bd;
  margin-bottom: 0.25rem;
}

.search-input {
  width: 100%;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
}

.search-input::placeholder {
  color: #8b949e;
}

.search-input:focus {
  outline: none;
}
</style>