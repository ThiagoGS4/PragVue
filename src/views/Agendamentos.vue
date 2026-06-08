<template>
<Calendar></Calendar>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import Calendar from '../components/Calendar.vue';
import { useScheduleStore } from '../stores/scheduleStore.ts';
import type { IGetSchedulesResponse } from '../types/views/agendamentos.ts';

const schedule = useScheduleStore()

const scheduleList = ref<IGetSchedulesResponse[]>()

onMounted(async() => {
    scheduleList.value = await schedule.getSchedules()

    // todo: parei aqui, preciso trazer dados de schedules, fazer um two way databiding entre agendamentos e componente calendar para passar dados e fazer os modais de crud.
    console.log('scheduleList.value', toRaw(scheduleList.value));
    
})
</script>

<style scoped>
</style>