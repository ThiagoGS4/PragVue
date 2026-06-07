<template>
    <div>
        <DataTable
        :lista="lista"
        ></DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from '../components/DataTable.vue';

let lista = ref([
  { name: 'Alex Rivera', email: 'alex@example.com' },
  { name: 'Samantha Cole', email: 'sam@example.com' },
  { name: 'Jordan Sparks', email: 'jordan@example.com' }
]);
</script>

<style scoped>

</style>