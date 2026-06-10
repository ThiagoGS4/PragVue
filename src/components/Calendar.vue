<script setup lang="ts">
import { computed, ref } from "vue";
import type {
  CalendarType,
  ICalendarEvents,
} from "../types/components/calendar";
import { differenceInMinutes, format, isValid } from "date-fns";
import type { IGetSchedulesResponse } from "../types/views/agendamentos";
import type { CalendarDayBodySlotScope } from "vuetify/lib/components/VCalendar/types.mjs";

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
  events: IGetSchedulesResponse[];
}>();

function getScheduleColor(element: IGetSchedulesResponse) {
  if (element.completed_at) return "green";

  const end = new Date(element.scheduled_end);

  if (!isValid(end)) return "primary";

  const diff = differenceInMinutes(end, new Date());

  if (diff < 0) return "red";
  if (diff === 0) return "teal";
  if (diff <= 3) return "yellow-darken-2";
  return "blue";
}

const schedules = computed<ICalendarEvents[]>(() => {
  return props.events.map((element) => {
    return {
      id: element.id,
      color: getScheduleColor(element),
      start: new Date(element.scheduled_start),
      end: new Date(element.scheduled_end),
      name: `${element.properties.name}, ${element.service.name}`,
      notes: element.notes,
      completed: element.completed_at ? new Date(element.completed_at) : null,
      property: element.properties.id,
      plague: element.plagues.id,
      service: element.service.id,
      status: element.status.id,
      technician: element.user.id,
      timed: true,
    };
  });
});

const emit = defineEmits<{
  (e: "dayClicked", date: string): void;
  (e: "elementClicked", elemData: any): void;
}>();

const weekday = ref([0, 1, 2, 3, 4, 5, 6]);

const weekdays = [
  { title: "Dom - Sáb", value: [0, 1, 2, 3, 4, 5, 6] },
  { title: "Seg - Dom", value: [1, 2, 3, 4, 5, 6, 0] },
  { title: "Seg - Sex", value: [1, 2, 3, 4, 5] },
];
const value = ref("");

const dayHeight = ref(600)

function handleDayClick(eventProps: CalendarDayBodySlotScope) {
  emit("dayClicked", eventProps.date);
}

function handleTimeClick(eventProps: CalendarDayBodySlotScope) {
  emit("dayClicked", eventProps.date);
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
    <v-sheet :height="dayHeight">
      <v-calendar
        ref="calendar"
        v-model="value"
        event-overlap-mode="stack"
        :event-overlap-threshold="30"
        :events="schedules"
        :type="calendarType"
        :weekdays="weekday"
        @click:day="(_event, data) => handleDayClick(data)"
        @click:time="(_event, data) => handleTimeClick(data)"
        @click:event.stop="(_event, data) => emit('elementClicked', data)"
        @click:more.stop="(_event, data) => dayHeight+=data.index * 100"
      >
        <template
          #day-label="{ day, month, year }"
          v-if="calendarType === 'month'"
        >
          <div
            :class="[
              'calendar-day',
              format(new Date(), 'dd/MM/yyyy') ===
              `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
                ? 'bg-yellow-darken-4'
                : 'bg-grey-darken-1',
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
  background-color: #90a4ae !important;
}
</style>
