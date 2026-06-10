<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vuetify/lib/composables/router.mjs";
import { format, isToday, isWithinInterval, addDays, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useScheduleStore } from "../stores/scheduleStore";
import { useCustomerStore } from "../stores/customerStore";
import { usePropertyStore } from "../stores/propertyStore";
import { useAuthStore } from "../stores/authStore";
import type { IGetSchedulesResponse } from "../types/views/agendamentos";

const router = useRouter();
const scheduleStore = useScheduleStore();
const customerStore = useCustomerStore();
const propertyStore = usePropertyStore();
const authStore = useAuthStore();

const loading = ref(true);
const schedules = ref<IGetSchedulesResponse[]>([]);
const totalCustomers = ref<number | null>(null);
const totalProperties = ref<number | null>(null);

onMounted(async () => {
  try {
    const [schedulesResp, customersResp, propertiesResp] = await Promise.all([
      scheduleStore.getSchedules(),
      customerStore.getCustomers(),
      propertyStore.getProperties(),
    ]);

    schedules.value = schedulesResp ?? [];
    totalCustomers.value = customersResp?.length ?? 0;
    totalProperties.value = propertiesResp?.length ?? 0;
  } finally {
    loading.value = false;
  }
});

const todaySchedules = computed(() =>
  schedules.value.filter((item) => isToday(new Date(item.scheduled_start)))
);

const completedToday = computed(() =>
  todaySchedules.value.filter((item) => !!item.completed_at)
);

const pendingToday = computed(() =>
  todaySchedules.value.filter((item) => !item.completed_at)
);

const next7Days = computed(() =>
  schedules.value.filter((item) => {
    const start = new Date(item.scheduled_start);
    return isWithinInterval(start, { start: new Date(), end: addDays(new Date(), 7) });
  })
);

const sortedTodaySchedules = computed(() =>
  [...todaySchedules.value].sort(
    (a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
  )
);

const stats = computed(() => [
  {
    label: "Agendamentos de hoje",
    value: todaySchedules.value.length,
    icon: "mdi-calendar-today",
    color: "primary",
  },
  {
    label: "Serviços finalizados hoje",
    value: completedToday.value.length,
    icon: "mdi-check-decagram-outline",
    color: "success",
  },
  {
    label: "Pendentes para hoje",
    value: pendingToday.value.length,
    icon: "mdi-clock-alert-outline",
    color: "warning",
  },
  {
    label: "Agendamentos (próx. 7 dias)",
    value: next7Days.value.length,
    icon: "mdi-calendar-range-outline",
    color: "secondary",
  },
]);

const todayFormatted = computed(() =>
  format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })
);

function scheduleStatus(item: IGetSchedulesResponse) {
  if (item.completed_at) {
    return { label: "Concluído", color: "success", icon: "mdi-check-circle" };
  }

  const end = new Date(item.scheduled_end);
  const diff = differenceInMinutes(end, new Date());

  if (diff < 0) {
    return { label: "Atrasado", color: "error", icon: "mdi-alert-circle-outline" };
  }
  if (diff <= 30) {
    return { label: "Em breve", color: "warning", icon: "mdi-clock-fast" };
  }

  return { label: "Agendado", color: "primary", icon: "mdi-calendar-clock" };
}

function formatTimeRange(item: IGetSchedulesResponse) {
  const start = format(new Date(item.scheduled_start), "HH:mm");
  const end = format(new Date(item.scheduled_end), "HH:mm");
  return `${start} - ${end}`;
}

function goTo(routeName: string) {
  router?.push({ name: routeName });
}
</script>

<template>
  <div class="home-dashboard">
    <v-row>
      <v-col cols="12">
        <v-card class="welcome-card" rounded="lg" flat>
          <div class="welcome-content">
            <div>
              <p class="text-overline text-medium-emphasis mb-1">Painel de controle</p>
              <h2 class="text-h5 font-weight-bold">
                Olá, {{ authStore.username }}
                <span aria-hidden="true">👋</span>
              </h2>
              <p class="text-body-2 text-medium-emphasis text-capitalize mb-0">
                {{ todayFormatted }}
              </p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-calendar-plus"
              class="text-none"
              @click="goTo('Agendamentos')"
            >
              Ir para Agendamentos
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
        <v-card class="stat-card" rounded="lg" flat>
          <div class="stat-icon" :class="`bg-${stat.color}`">
            <v-icon :icon="stat.icon" size="26" color="white"></v-icon>
          </div>
          <div class="stat-text">
            <p class="text-h4 font-weight-bold mb-0">
              <v-progress-circular
                v-if="loading"
                size="22"
                width="2"
                indeterminate
                color="primary"
              ></v-progress-circular>
              <template v-else>{{ stat.value }}</template>
            </p>
            <p class="text-caption text-medium-emphasis mb-0">{{ stat.label }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card rounded="lg" flat class="section-card">
          <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
            <span>Agenda de hoje</span>
            <v-btn
              variant="text"
              size="small"
              color="primary"
              class="text-none"
              append-icon="mdi-arrow-right"
              @click="goTo('Agendamentos')"
            >
              Ver agenda completa
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <div v-if="loading" class="pa-8 text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>

          <v-list v-else-if="sortedTodaySchedules.length" lines="two" class="py-0">
            <template v-for="(item, index) in sortedTodaySchedules" :key="item.id">
              <v-list-item>
                <template #prepend>
                  <v-avatar :color="scheduleStatus(item).color" variant="tonal" size="44">
                    <v-icon :icon="scheduleStatus(item).icon"></v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ item.properties?.name }} · {{ item.service?.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatTimeRange(item) }} · Praga: {{ item.plagues?.name }} · Técnico:
                  {{ item.user?.name }}
                </v-list-item-subtitle>

                <template #append>
                  <v-chip :color="scheduleStatus(item).color" size="small" variant="tonal">
                    {{ scheduleStatus(item).label }}
                  </v-chip>
                </template>
              </v-list-item>
              <v-divider v-if="index < sortedTodaySchedules.length - 1"></v-divider>
            </template>
          </v-list>

          <div v-else class="pa-8 text-center text-medium-emphasis">
            <v-icon icon="mdi-calendar-check-outline" size="40" class="mb-2"></v-icon>
            <p class="mb-0">Nenhum agendamento para hoje.</p>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card rounded="lg" flat class="section-card mb-4">
          <v-card-title>Resumo geral</v-card-title>
          <v-divider></v-divider>
          <v-list density="comfortable">
            <v-list-item prepend-icon="mdi-account-group-outline" title="Clientes cadastrados">
              <template #append>
                <v-progress-circular
                  v-if="loading"
                  size="18"
                  width="2"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <span v-else class="text-h6 font-weight-bold">{{ totalCustomers }}</span>
              </template>
            </v-list-item>
            <v-list-item prepend-icon="mdi-home-city-outline" title="Propriedades cadastradas">
              <template #append>
                <v-progress-circular
                  v-if="loading"
                  size="18"
                  width="2"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <span v-else class="text-h6 font-weight-bold">{{ totalProperties }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card rounded="lg" flat class="section-card">
          <v-card-title>Acesso rápido</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="d-flex flex-column ga-2">
            <v-btn
              variant="tonal"
              color="primary"
              prepend-icon="mdi-calendar-edit-outline"
              class="text-none"
              block
              @click="goTo('Agendamentos')"
            >
              Agendamentos
            </v-btn>
            <v-btn
              variant="tonal"
              color="secondary"
              prepend-icon="mdi-human-queue"
              class="text-none"
              block
              @click="goTo('Clientes')"
            >
              Clientes
            </v-btn>
            <v-btn
              variant="tonal"
              color="secondary"
              prepend-icon="mdi-home-city"
              class="text-none"
              block
              @click="goTo('Propriedades')"
            >
              Propriedades
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.home-dashboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.welcome-card {
  padding: 20px 24px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: #ffffff;
}

.welcome-card :deep(.text-overline),
.welcome-card :deep(.text-medium-emphasis) {
  color: rgba(255, 255, 255, 0.85) !important;
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.welcome-content h2 {
  color: #ffffff;
}

.welcome-content .v-btn {
  background-color: #ffffff;
  color: rgb(var(--v-theme-primary));
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  height: 100%;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  flex-shrink: 0;
}

.stat-text {
  min-width: 0;
}

.section-card {
  height: 100%;
}
</style>
