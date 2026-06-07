<template>
  <v-container align="center">
    <v-card class="px-8 py-8 rounded-lg">
      <v-form
      @submit.prevent="logar(usuario)"
      @keydown.enter.exact.prevent="logar(usuario)">
        <v-row dense>
        <v-col cols="12">
        <v-img src="./prag_login.png" alt="prag logo" />
        <v-col cols="12">
          <h2>Login</h2>
        </v-col>
        </v-col>
          <v-col cols="12">
            <v-text-field
              label="nome de usuário"
              placeholder="João"
              density="compact"
              variant="solo"
              prepend-icon="mdi-account"
              v-model="usuario.username"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="senha"
              :type="exposePassword ? 'text' : 'password'"
              placeholder="senha"
              density="compact"
              variant="solo"
              v-model="usuario.password"
              prepend-icon="mdi-lock"
              append-inner-icon="mdi-eye"
              @click:append-inner="exposePassword = !exposePassword"
            />
          </v-col>
          <v-col cols="12">
            <v-btn type="submit" height="3rem" width="80%" append-icon="mdi-login">Login</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IUserLoginRegisterInput } from "../types/stores/authStore";
import { useAuthStore } from "../stores/authStore";
import { router } from "../routes/routes";
import { toast } from "vue3-toastify";

const authStore = useAuthStore()

const usuario = ref<IUserLoginRegisterInput>({username: '', password: ''});

const exposePassword = ref(false)

async function logar(logando: IUserLoginRegisterInput) {
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
