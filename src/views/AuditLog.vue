<template>
<DataTable :lista="auditLogList" :headers="headers"/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuditLogStore } from '../stores/auditLogStore';
import DataTable from "../components/DataTable.vue";

const auditLogStore = useAuditLogStore()
const auditLogList = ref()

onMounted(async () => {
    auditLogList.value = await auditLogStore.getAuditLog()
})
const headers = [
  { title: "Operação", key: "operation" },
  { title: "Método", key: "method" },
  { title: "Executor", key: "created_by" },
  { title: "Criado em", key: "created_at" },
  { title: "Status", key: "status" }
];
</script>

<style scoped>
</style>