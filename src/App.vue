<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "./stores/authStore";
import { useRoute } from "vuetify/lib/composables/router.mjs";
import { useRouter } from "vuetify/lib/composables/router.mjs";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const drawer = ref(true);

const items = [
  {
    title: "Home",
    icon: "mdi-view-dashboard-outline",
  },
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

function logout() {
  authStore.logout();
  router?.push({ name: "Login" });
}
</script>

<template>
  <v-app>
    <v-app-bar
      v-if="authStore.isAuthenticated && route?.name !== 'NotFound'"
      flat
      color="surface"
      class="app-bar-custom"
    >
      <v-app-bar-nav-icon
        class="d-md-none"
        @click="drawer = !drawer"
      />

      <div class="brand">
        <v-avatar class="brand-logo bg-white" rounded="lg" size="40">
          <v-img src="../public/cropped-Icone-Altoprag-colorido-192x192.webp" cover></v-img>
        </v-avatar>
        <div class="brand-text">
          <span class="brand-title">AltoPrag</span>
          <span class="brand-subtitle">Gerenciamento de Extermínio</span>
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-menu min-width="200">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="user-menu-btn" rounded="lg">
            <v-avatar color="primary" size="36" class="mr-2">
              <span class="text-body-2 font-weight-bold">{{ authStore.userInitials }}</span>
            </v-avatar>
            <span class="d-none d-sm-inline text-body-2 font-weight-medium">
              {{ authStore.username }}
            </span>
            <v-icon class="ml-1" icon="mdi-chevron-down" size="20"></v-icon>
          </v-btn>
        </template>

        <v-list density="comfortable">
          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            @click="logout"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-if="authStore.isAuthenticated && route?.name !== 'NotFound'"
      v-model="drawer"
      class="drawer-custom"
    >
      <div class="drawer-header border-lg" border="orange-900">
        <v-avatar rounded="lg" size="44" class="drawer-logo bg-white">
          <v-img src="../public/cropped-Icone-Altoprag-colorido-192x192.webp" cover></v-img>
        </v-avatar>
        <div class="drawer-header-text">
          <span class="drawer-title">AltoPrag</span>
          <span class="drawer-subtitle">Painel de controle</span>
        </div>
      </div>

      <v-divider class="drawer-divider"></v-divider>

      <v-list class="drawer-list" nav>
        <v-list-item
          v-for="rota in items"
          :key="rota.title"
          @click="goToRoute(rota.title)"
          :active="isRouteActive(rota.title)"
          rounded="lg"
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

    <v-main class="app-background">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-bar-custom {
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
}

.app-background {
  background-color: rgb(var(--v-theme-background));
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 4px;
}

.brand-logo,
.drawer-logo {
  background-color: rgb(var(--v-theme-surface-variant));
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.5px;
}

.brand-subtitle {
  font-size: 0.7rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.user-menu-btn {
  text-transform: none;
}

.drawer-custom {
  background-color: rgb(var(--v-theme-drawer-bg)) !important;
  color: #ffffff;
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
}

.drawer-header-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.drawer-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.drawer-subtitle {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

.drawer-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
  margin-bottom: 8px;
}

.drawer-list {
  padding: 0 12px;
}

.list-item-custom {
  color: rgba(255, 255, 255, 0.78);
  margin-bottom: 4px;
}

.list-item-custom :deep(.v-icon) {
  color: rgba(255, 255, 255, 0.6);
}

.list-item-custom.v-list-item--active {
  background-color: rgb(var(--v-theme-primary));
  color: #ffffff;
}

.list-item-custom.v-list-item--active :deep(.v-icon) {
  color: #ffffff;
}
</style>
