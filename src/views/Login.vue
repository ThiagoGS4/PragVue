<template>
  <v-container align="center">
    <v-card class="px-8 rounded-lg">
      <v-form
      @submit.prevent="logar(usuario)"
      @keydown.enter.exact.prevent="logar(usuario)">
        <v-row dense>
          <v-col cols="12" md="10" sm="8" xs="6">
            <v-text-field
              label="nome de usuário"
              placeholder="João"
              density="compact"
              variant="solo"
              v-model="usuario.username"
            />
          </v-col>
          <v-col cols="12" md="10" sm="8" xs="6">
            <v-text-field
              label="senha"
              type="password"
              placeholder="senha"
              density="compact"
              variant="solo"
              v-model="usuario.password"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IUserLoginInput } from "../types/stores/authStore";
import { useAuthStore } from "../stores/authStore";
import { router } from "../routes/routes";
import { toast } from "vue3-toastify";

const authStore = useAuthStore()

const usuario = ref<IUserLoginInput>({username: '', password: ''});

async function logar(logando: IUserLoginInput) {
  try {
    await authStore.login(logando);
    toast.success("Login realizado com sucesso!", {
      autoClose: 3000,
      position: "top-right",
      theme: "colored",
    });
    router.push({ name: "Home" });
  } catch (error: any) {
    toast.error(`Erro ao fazer login: ${error.message}`, {
      autoClose: 4000,
      position: "top-right",
      theme: "colored",
    });
  }
}
</script>
