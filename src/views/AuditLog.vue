<template>
<DataTable :lista="auditLogList" :headers="headers"/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuditLogStore } from '../stores/auditLogStore';
import DataTable from "../components/DataTable.vue";
import type { IGetAuditLogResponse } from '../types/stores/auditLogStore.ts';

const auditLogStore = useAuditLogStore()
const auditLogList = ref()

onMounted(async () => {
    auditLogList.value = await auditLogStore.getAuditLog()
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