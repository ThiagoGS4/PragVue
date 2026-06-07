<script setup lang="ts">
import { useAuthStore } from './stores/authStore';
import { useRoute } from 'vuetify/lib/composables/router.mjs';

const route = useRoute()
const authStore = useAuthStore()

</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar v-if="authStore.isAuthenticated && route?.name !== 'NotFound'" title="App bar"></v-app-bar>

      <v-navigation-drawer v-if="authStore.isAuthenticated && route?.name !== 'NotFound'">
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
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

<style scoped>

</style>
