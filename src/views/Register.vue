<template>
  <div class="auth-page">
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="10" md="9" lg="7" xl="6">
          <v-card class="auth-card rounded-xl elevation-8">
            <v-row no-gutters>
              <v-col cols="12" md="5" class="auth-side d-none d-md-flex">
                <div class="auth-side-content">
                  <v-avatar size="84" rounded="lg" class="auth-logo bg-white">
                    <v-img src="../public/cropped-Icone-Altoprag-colorido-192x192.webp" alt="AltoPrag" cover></v-img>
                  </v-avatar>

                  <h2 class="auth-side-title">AltoPrag</h2>
                  <p class="auth-side-subtitle">Controle de Pragas</p>

                  <v-divider class="auth-side-divider"></v-divider>

                  <ul class="auth-side-list">
                    <li>
                      <v-icon icon="mdi-calendar-check-outline" size="20"></v-icon>
                      Agendamentos organizados
                    </li>
                    <li>
                      <v-icon icon="mdi-home-city-outline" size="20"></v-icon>
                      Controle de propriedades
                    </li>
                    <li>
                      <v-icon icon="mdi-shield-check-outline" size="20"></v-icon>
                      Histórico de serviços
                    </li>
                  </ul>
                </div>
              </v-col>

              <v-col cols="12" md="7">
                <div class="auth-form-content">
                  <div class="auth-mobile-brand d-flex d-md-none flex-column align-center mb-6">
                    <v-avatar size="64" rounded="lg" class="mb-2">
                      <v-img src="../public/Logo-Altoprag-site-2-scaled.webp" alt="AltoPrag" cover></v-img>
                    </v-avatar>
                    <span class="text-h6 font-weight-bold">AltoPrag</span>
                  </div>

                  <p class="text-overline text-medium-emphasis mb-1">Crie sua conta</p>
                  <h2 class="text-h5 font-weight-bold mb-6">Registrar</h2>

                  <v-form
                    @submit.prevent="registrar(usuario)"
                    @keydown.enter.exact.prevent="registrar(usuario)"
                  >
                    <v-text-field
                      label="Nome de usuário"
                      placeholder="João"
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      prepend-inner-icon="mdi-account-outline"
                      v-model="usuario.username"
                      class="mb-1"
                    />
                    <v-text-field
                      label="Senha"
                      :type="exposePassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                      v-model="usuario.password"
                      prepend-inner-icon="mdi-lock-outline"
                      :append-inner-icon="exposePassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="exposePassword = !exposePassword"
                      class="mb-2"
                    />

                    <v-btn
                      type="submit"
                      color="primary"
                      block
                      height="48"
                      class="text-none font-weight-medium mt-2"
                      append-icon="mdi-account-plus"
                    >
                      Registrar
                    </v-btn>
                  </v-form>

                  <p class="text-center text-body-2 text-medium-emphasis mt-6 mb-0">
                    Já tem uma conta?
                    <router-link :to="{ name: 'Login' }" class="auth-link">
                      Entrar
                    </router-link>
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IUserLoginRegisterInput } from "../types/stores/authStore";
import { useAuthStore } from "../stores/authStore";
import { router } from "../routes/routes";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();

const usuario = ref<IUserLoginRegisterInput>({ username: "", password: "", roles: [] });

const exposePassword = ref(false);

async function registrar(logando: IUserLoginRegisterInput) {
  try {
    await authStore.registrar(logando);
    toast.success("Registro realizado com sucesso!", {
      autoClose: 3000,
      position: "top-right",
      theme: "colored",
    });
    router.push({ name: "Login" });
  } catch (error: any) {
    toast.error(`Erro ao registrar: ${error.message}`, {
      autoClose: 4000,
      position: "top-right",
      theme: "colored",
    });
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  padding: 24px 0;
}

.auth-card {
  overflow: hidden;
}

.auth-side {
  background: linear-gradient(160deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: #ffffff;
  align-items: center;
  justify-content: center;
}

.auth-side-content {
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.auth-logo {
  background-color: rgba(255, 255, 255, 0.15);
  margin-bottom: 24px;
}

.auth-side-title {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.auth-side-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
}

.auth-side-divider {
  border-color: rgba(255, 255, 255, 0.2) !important;
  width: 100%;
  margin-bottom: 24px;
}

.auth-side-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-side-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.92);
}

.auth-form-content {
  padding: 48px 40px;
}

.auth-link {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .auth-form-content {
    padding: 32px 24px;
  }
}
</style>