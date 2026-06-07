import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/authStore"

const routes = [
  { path: "/", name: "Login", component: () => import("../views/Login.vue") },
  { path: "/register", name: "Register", component: () => import("../views/Register.vue") },
  { path: "/home", name: "Home", component: () => import("../views/Home.vue"), meta: { requiresAuth: true } },
    {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.hydrate()

  const isPublic = to.name === "Login" || to.name === "Register"

  if (authStore.isAuthenticated && isPublic) {
    return { name: "Home" }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: "Login",
      query: { redirect: to.fullPath },
    }
  }

  return true
})