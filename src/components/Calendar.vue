<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { CalendarDaySlotScope, CalendarEvent } from "vuetify/lib/components/VCalendar/types.mjs";
import type { CalendarType, ICalendarEvents } from "../types/components/calendar";
import { format, getDate, toDate } from "date-fns";
import type { IGetSchedulesResponse } from "../types/views/agendamentos";

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

const props = defineProps<{
  events: IGetSchedulesResponse[]
}>()

console.log('events -> ', props.events); // montar eventos no calendário


const emit = defineEmits<{
  (e: 'dayClicked', date: string): void
  
}>()

const upsertDialog = ref(false)

const weekday = ref([0, 1, 2, 3, 4, 5, 6]);

const weekdays = [
  { title: "Dom - Sáb", value: [0, 1, 2, 3, 4, 5, 6] },
  { title: "Seg - Dom", value: [1, 2, 3, 4, 5, 6, 0] },
  { title: "Seg - Sex", value: [1, 2, 3, 4, 5] },
];
const value = ref("");
const schedules = ref<ICalendarEvents[]>([]);

function handleDayClick( date: CalendarDaySlotScope){
  console.log('date -> ', date);
  
    upsertDialog.value = true
}

onMounted(() => {
  for (const element of props.events) {
    schedules.value?.push({
      color: 'primary', // todo fazer um color baseado em data, quanto mais próximo do vencimento muda cor
      start: toDate(element.scheduled_start),
      end: toDate(element.scheduled_end),
      name: element.properties + element.service,
      timed: true
    })
  } 
  console.log('schedules.value --> ', schedules.value);
  
})

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
        @click:day="(_event, data) => handleDayClick(data)"
      >
<template #day-label="{ day, month, year }" v-if="calendarType === 'month'">
  <div
    
    :class="[
      'calendar-day',
      format(new Date(), 'dd/MM/yyyy') === `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}` ? 'bg-yellow-darken-4' : 'bg-grey-darken-1'
    ]"
  >
    {{ day }}
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
