<template>
<DataTable :lista="auditLogList" :headers="headers"/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useAuditLogStore } from '../stores/auditLogStore';
import DataTable from "../components/DataTable.vue";

const auditLogStore = useAuditLogStore()
const auditLogList = ref()

const fetchLogs = async () => {
    auditLogList.value = await auditLogStore.getAuditLog()
}

const handleExpoMessage = (event: MessageEvent) => {
    try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.type === 'REFRESH_AUDIT_LOG') {
            fetchLogs()
        }
    } catch {}
}

onMounted(async () => {
  await fetchLogs()
  window.addEventListener('message', handleExpoMessage)
  document.addEventListener('message', handleExpoMessage as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('message', handleExpoMessage)
  document.removeEventListener('message', handleExpoMessage as EventListener)
})

const headers = [
  { title: "Operação", key: "operation" },
  { title: "Método", key: "method" },
  { title: "Status", key: "status" },
  { title: "Criado em", key: "created_at", sortable: false },
  { title: "Executor", key: "created_by" },
  { title: "IP", key: "ip" },
  { title: "Conteúdo", key: "payload" },
];
</script>

<style scoped>
</style>