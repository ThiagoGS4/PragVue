<script setup lang="ts">
import { useAuthStore } from "./stores/authStore";
import { useRoute } from "vuetify/lib/composables/router.mjs";
import { useRouter } from "vuetify/lib/composables/router.mjs";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const items = [
  {
    title: "Agendamentos",
    icon: "mdi-calendar-edit-outline",
  },
  {
    title: "Clientes",
    icon: "mdi-human-queue",
  },
  {
    title: "Propriedades",
    icon: "mdi-home-city",
  },
  {
    title: "AuditLog",
    icon: "mdi-account-tie",
  },
];

const goToRoute = (routeName: string) => {
  router?.push({ name: routeName });
};

const isRouteActive = (routeName: string) => route.value?.name === routeName;
</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar
        v-if="authStore.isAuthenticated && route?.name !== 'NotFound'"
        title="Prag: Gerenciamento de extermínio"
      >
      <v-img src="../public/Logo-Altoprag-site-2-scaled.webp"></v-img>
      </v-app-bar>

      <v-navigation-drawer
        v-if="authStore.isAuthenticated && route?.name !== 'NotFound'"
      >
        <v-list>
        <v-list-item
          v-for="rota in items"
          :key="rota.title"
          @click="goToRoute(rota.title)"
          :active="isRouteActive(rota.title)"
          class="list-item-custom"
        >
          <template #prepend>
            <v-icon :icon="rota.icon" />
          </template>
          <v-list-item-title>
            {{ rota.title }}
          </v-list-item-title>
        </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped></style>
