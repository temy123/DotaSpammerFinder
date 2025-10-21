<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app-container">
    <header class="app-header">
      <div class="header-top">
        <div class="container">
          <RouterLink class="navbar-brand" to="/">DOTA.GG</RouterLink>
        </div>
      </div>
      <div class="header-bottom">
        <div class="container">
          <nav class="header-nav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <RouterLink class="nav-link" to="/">홈</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/about">소개</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/service">영웅 분석</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/stats">통계</RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style> /* Removed scoped attribute */
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #212529;
  color: #fff;
}

.app-header {
  background-color: #4d6cfa;
  z-index: 1000;
  width: 100%;
  position: sticky;
  top: 0;
}

.header-top {
  padding: 0.5rem 0;
}

.header-bottom {
  padding: 0.5rem 0;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.navbar-brand {
  font-size: 1.75rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  margin-right: 2rem;
}

.header-nav {
  display: flex;
}

.navbar-nav {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 1.5rem;
  align-items: baseline;
}

.nav-link {
  color: #cbd5e0;
  text-decoration: none;
  font-size: 1rem;
}

.nav-link:hover,
.router-link-exact-active {
  color: #fff;
  font-weight: bold;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
