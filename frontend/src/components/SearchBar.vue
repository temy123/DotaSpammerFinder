<template>
  <div class="search-bar">
    <input
      :value="playerId"
      @input="event => playerId = event.target.value"
      type="text"
      placeholder="Enter player ID"
      @keyup.enter="searchPlayer"
    />
    <button @click="searchPlayer">Search</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSearchStore } from '@/stores/search';

const playerId = ref('');
const searchStore = useSearchStore();

const searchPlayer = () => {
  if (playerId.value.trim()) {
    searchStore.fetchPlayerData(playerId.value.trim());
  }
};
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: center;
  padding: 20px;
}

input {
  padding: 10px;
  font-size: 16px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>