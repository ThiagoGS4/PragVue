<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  lista: any[];
  headers?: any[];
  hasSeeActions?: boolean;
  actionsText?: string;
  actionsRouteName?: string;
  actionsIcon?: string;
}>();

const emit = defineEmits<{
  (e: "openEditDialog", value: any): void;
  (e: "openDeleteDialog", value: number): void;
}>();

function mandarPraRota(id: number) {
  router.push({
    name: props.actionsRouteName,
    query: { idQuery: id },
  });
}
</script>

<template>
  <v-row dense justify="center" align="center">
    <v-col cols="12" md="10" sm="8">
      <v-card class="data-table-card elevation-4 rounded-lg overflow-hidden">
        <v-data-table
          :items="props.lista"
          :headers="props.headers"
          :show-select="false"
          class="data-table-custom"
        >
          <template
            v-if="props.headers"
            v-for="field in props.headers
              .map((h) => h.key)
              .filter((key) => key !== 'actions')"
            :key="field"
            #[`item.${field}`]="{ item }"
          >
            <div class="cell-scrolled">
              {{ item[field] }}
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="actions-cell">
              <v-tooltip
                :text="props.actionsText"
                location="top"
                v-if="props.hasSeeActions"
              >
                <template #activator="{ props: activatorProps }">
                  <v-btn
                    v-bind="activatorProps"
                    :icon="props.actionsIcon"
                    @click="mandarPraRota(item.id)"
                    variant="text"
                    size="small"
                    color="info"
                  ></v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Editar" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    @click="emit('openEditDialog', item)"
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    color="warning"
                  ></v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Excluir" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    @click="emit('openDeleteDialog', item.id)"
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    color="error"
                  ></v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.data-table-card {
  border: 1px solid #e3f2fd;
  background-color: #fafbfc;
}

.data-table-custom {
  background-color: white !important;
}

.data-table-custom :deep(.v-table__wrapper) {
  background-color: white;
}

.data-table-custom :deep(thead) {
  background-color: #e3f2fd;
}

.data-table-custom :deep(th) {
  background-color: #e3f2fd !important;
  color: #0f5aa8 !important;
  font-weight: 600 !important;
  border-bottom: 2px solid #1976d2 !important;
}

.data-table-custom :deep(tbody tr) {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.data-table-custom :deep(tbody tr:hover) {
  background-color: #f5f9ff !important;
}

.cell-scrolled {
  max-height: 28px;
  overflow-y: auto;
  white-space: pre-line;
  text-overflow: ellipsis;
  padding-right: 6px;
  color: #424242;
}

.actions-cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.v-btn:focus {
  outline: none;
}
</style>
