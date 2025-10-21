<template>
  <div class="results-table">
    <div v-if="isLoading" class="loader">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="playerData.length">
      <table>
        <thead>
          <tr>
            <th>Hero</th>
            <th>Result</th>
            <th>KDA</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="match in playerData" :key="match.match_id">
            <td>{{ match.hero_id }}</td> <!-- 나중에 영웅 이름으로 변경 필요 -->
            <td>{{ match.win ? 'Win' : 'Lose' }}</td>
            <td>{{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</td>
            <td>{{ (match.duration / 60).toFixed(0) }} mins</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSearchStore } from '@/stores/search';

const searchStore = useSearchStore();

const isLoading = computed(() => searchStore.isLoading);
const playerData = computed(() => searchStore.playerData);
const error = computed(() => searchStore.error);
</script>

<style scoped>
.results-table {
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
.loader, .error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}
.error {
  color: red;
}
</style>