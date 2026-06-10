<script setup lang="ts">
const props = defineProps<{
  lista: any[];
  headers?: { title: string; key: string; sortable?: boolean }[];
}>();

const emit = defineEmits<{
  (e: "openEditDialog", value: any): void;
  (e: "openDeleteDialog", value: number): void;
}>();
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
            v-for="field in props.headers?.map((h) => h.key).filter((key) => key !== 'actions')"
            :key="field"
            #[`item.${field}`]="{ item }"
          >
            <div class="cell-scrolled">
              {{ item[field] }}
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="actions-cell">
              <v-tooltip text="Editar" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    @click="emit('openEditDialog', item)"
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    color="primary"
                  />
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
                  />
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>