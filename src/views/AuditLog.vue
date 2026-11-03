<template>
<DataTable :lista="auditLogList" :headers="headers"/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useAuditLogStore } from '../stores/auditLogStore';
import DataTable from "../components/DataTable.vue";
import { handleExpoMessageType } from '../helpers/expoHelper.ts';

const auditLogStore = useAuditLogStore()
const auditLogList = ref()

const fetchLogs = async () => {
    auditLogList.value = await auditLogStore.getAuditLog()
}

const handleExpoMessage = (event: MessageEvent) => {
  handleExpoMessageType(event, 'REFRESH_AUDIT_LOG', fetchLogs)
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