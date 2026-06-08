<script setup lang="ts">
import { ref } from "vue";
import type { CalendarEvent } from "vuetify/lib/components/VCalendar/types.mjs";
import type { CalendarType } from "../types/components/calendar";
import { getDate, getDay } from "date-fns";

const calendarType = ref<CalendarType>("month");
const types = ["month", "week", "day"];

type CalendarInstance = {
  prev: () => void;
  next: () => void;
};

const calendar = ref<CalendarInstance | null>(null);

function goPrev() {
  calendar.value?.prev();
}

function goNext() {
  calendar.value?.next();
}

const upsertDialog = ref(false)

const weekday = ref([0, 1, 2, 3, 4, 5, 6]);

const weekdays = [
  { title: "Dom - Sáb", value: [0, 1, 2, 3, 4, 5, 6] },
  { title: "Seg - Dom", value: [1, 2, 3, 4, 5, 6, 0] },
  { title: "Seg - Sex", value: [1, 2, 3, 4, 5] },
];
const value = ref("");
const schedules = ref<CalendarEvent[]>(); // todo?: tipar isso para input -> ISchedules[]

function handleDayClick(date: string){
    upsertDialog.value = true
}

</script>

<template>
  <div>
    <v-sheet class="d-flex" tile>
      <v-btn class="ma-2" variant="text" icon @click="goPrev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="calendarType"
        :items="types"
        class="ma-2"
        density="comfortable"
        label="type"
        variant="outlined"
        hide-details
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        class="ma-2"
        density="comfortable"
        label="weekdays"
        variant="outlined"
        hide-details
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn class="ma-2" variant="text" icon @click="goNext()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="value"
        event-overlap-mode="stack"
        :event-overlap-threshold="30"
        :events="schedules"
        :type="calendarType"
        :weekdays="weekday"
        @click:day="console.log(($event.target as HTMLElement).textContent.slice(-10))"
      >
<template #day-label="{ day }" v-if="calendarType === 'month'">
  <div
    
    :class="[
      'calendar-day',
      getDate(new Date()) === day ? 'bg-yellow-darken-4' : 'bg-grey-darken-1'
    ]"
  >
    {{ day }}
  </div>
</template>

<template #day="{ date }">
  <div v-show="false">
    {{ date }}
  </div>
</template>
      </v-calendar>
    </v-sheet>
  </div>
</template>

<style scoped>
:deep(.v-calendar-daily_head-day.v-present) {
  background-color: orange !important;
}
:deep(.v-calendar-daily_head-day) {
  background-color: #90A4AE !important;
}
</style>
