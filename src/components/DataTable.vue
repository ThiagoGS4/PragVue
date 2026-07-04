<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  lista: any[];
  headers?: { title: string; key?: string; sortable?: boolean }[];
  defaultSortHeader?: string;
  actionsEnd?: boolean;
  tableHeight?: number;
}>();

const emit = defineEmits<{
  (e: "openEditDialog", value: any): void;
  (e: "openDeleteDialog", value: number): void;
}>();

const ehJson = (valor: string) => {
  if (typeof valor !== "string") return false;
  try {
    const res = JSON.parse(valor);
    return res && typeof res === "object";
  } catch (e) {
    return false;
  }
};

const formatarSeForJson = (valor: string) => {
  try {
    return JSON.stringify(JSON.parse(valor), null, 2);
  } catch (e) {
    return valor;
  }
};
const jsonDialog = ref(false);
const jsonView = ref("");

function handleJsonClick(conteudo: string) {
  jsonDialog.value = true;
  jsonView.value = conteudo;
}
</script>

<template>
  <v-container fluid>
  <v-dialog v-model="jsonDialog">
    <v-card class="dialog-card rounded-xl elevation-8 mx-auto pa-4">
      <v-card-text>
        <pre>{{ jsonView }}</pre>
      </v-card-text>
      <v-card-actions class="pa-2 pt-0">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          @click="jsonDialog = false"
          prepend-icon="mdi-close"
          class="text-capitalize"
        >
          fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row dense justify="center" align="center">
    <v-col cols="12">
      <v-card
        class="main-content data-table-card elevation-4 rounded-lg overflow-hidden"
      >
<v-data-table
  :items="props.lista"
  :headers="props.headers"
  :show-select="false"
  :sort-by="props.defaultSortHeader ? [{ key: props.defaultSortHeader, order: 'asc' }] : []"
  class="data-table-custom"
  :height="tableHeight"
>
  <template
    v-for="field in props.headers
      ?.map((h) => h.key)
      .filter((key) => key && key !== 'actions')"
    :key="field"
    #[`item.${field}`]="{ item }"
  >
    <div class="cell-scrolled">
      <span
        v-if="ehJson(item[field!])"
        class="json-formatado"
        @click="handleJsonClick(formatarSeForJson(item[field!]))"
      >
        ver conteúdo
      </span>

      <span v-else :style="item[field!] ?? 'color: #9E9E9E'">
        {{ item[field!] ?? 'sem conteúdo' }}
      </span>
    </div>
  </template>

  <template #item.actions="{ item }">
    <div :class="props.actionsEnd ? 'actions-cell' : 'actions-cell-center'">
      <slot name="extra-actions" :item="item" />

      <v-tooltip text="Editar" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            @click="emit('openEditDialog', item)"
            icon="mdi-pencil"
            variant="text"
            size="small"
            color="primary"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Excluir" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            @click="emit('openDeleteDialog', item.id)"
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
          />
        </template>
      </v-tooltip>
    </div>
  </template>
</v-data-table>
      </v-card>
    </v-col>
  </v-row>
  </v-container>
</template>

<style scoped>
.main-content {
  border: 2px solid #43a047;
  border-radius: 4px;
}

.actions-cell{
  display: flex;
  justify-content: end;
}

.actions-cell-center{
  display: flex;
  justify-content: left;
}

.json-formatado:hover{
  transition: 0.5s;
  cursor: pointer;
  color: #429ec9;
}

.json-formatado{
  text-decoration: underline;
}
</style>
