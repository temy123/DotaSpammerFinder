<template>
  <div class="header">
    <div>
      <a href="index.html">
        <img src="/img/img_logo_text_white.png" />
      </a>

      <div class="counter">
        <a href="https://hits.sh/dota-gg.kro.kr/">
          <img
            alt="Hits"
            src="https://hits.sh/dota-gg.kro.kr.svg?style=flat-square&label=방문수&color=5383e8"
          />
        </a>
      </div>
    </div>

    <ul>
      <li>
        <router-link to="/">홈</router-link>
      </li>
      <li>
        <router-link to="/about">소개</router-link>
      </li>
      <li>
        <router-link to="/service">영웅 분석</router-link>
      </li>
      <li>
        <a href="#">통계</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Add your styles here */
</style>