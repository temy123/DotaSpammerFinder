<template>
  <div class="home">
    <SearchBar />
    <ResultsTable />
  </div>
</template>

<script setup>
import SearchBar from '@/components/SearchBar.vue';
import ResultsTable from '@/components/ResultsTable.vue';
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>