<template>
  <!-- upsert service -->
  <v-dialog v-model="serviceDialog" max-width="680">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ isEditingService ? "Editar serviço" : "Novo serviço" }}</span>
        <v-btn icon="mdi-close" variant="text" @click="clearServiceFields" />
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="isEditingService ? updateService() : createService()">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                key="service-name-field"
                v-model="serviceFormData.serviceName"
                label="Nome do Serviço"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="clearServiceFields">Cancelar</v-btn>
        <v-btn
          color="primary"
          @click="isEditingService ? updateService() : createService()"
          :disabled="!serviceFormData.serviceName"
        >
          {{ isEditingService ? "Atualizar" : "Salvar" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- delete service confirm -->
  <v-dialog v-model="deleteServiceDialog" max-width="420">
    <v-card>
      <v-card-title>Excluir serviço</v-card-title>
      <v-card-text>Tem certeza que deseja excluir este serviço?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="deleteServiceDialog = false">Cancelar</v-btn>
        <v-btn color="error" @click="confirmDeleteService">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- upsert status -->
  <v-dialog v-model="statusDialog" max-width="680">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ isEditingStatus ? "Editar status" : "Novo status" }}</span>
        <v-btn icon="mdi-close" variant="text" @click="clearStatusFields" />
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="isEditingStatus ? updateStatus() : createStatus()">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                key="status-name-field"
                v-model="statusFormData.statusName"
                label="Nome do Status"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="clearStatusFields">Cancelar</v-btn>
        <v-btn
          color="primary"
          @click="isEditingStatus ? updateStatus() : createStatus()"
          :disabled="!statusFormData.statusName"
        >
          {{ isEditingStatus ? "Atualizar" : "Salvar" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- delete status confirm -->
  <v-dialog v-model="deleteStatusDialog" max-width="420">
    <v-card>
      <v-card-title>Excluir status</v-card-title>
      <v-card-text>Tem certeza que deseja excluir este status?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="deleteStatusDialog = false">Cancelar</v-btn>
        <v-btn color="error" @click="confirmDeleteStatus">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- upsert plague -->
  <v-dialog v-model="plagueDialog" max-width="680">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ isEditingPlague ? "Editar praga" : "Nova praga" }}</span>
        <v-btn icon="mdi-close" variant="text" @click="clearPlagueFields" />
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="isEditingPlague ? updatePlague() : createPlague()">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                key="plague-name-field"
                v-model="plagueFormData.plagueName"
                label="Nome da Praga"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="clearPlagueFields">Cancelar</v-btn>
        <v-btn
          color="primary"
          @click="isEditingPlague ? updatePlague() : createPlague()"
          :disabled="!plagueFormData.plagueName"
        >
          {{ isEditingPlague ? "Atualizar" : "Salvar" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- delete plague confirm -->
  <v-dialog v-model="deletePlagueDialog" max-width="420">
    <v-card>
      <v-card-title>Excluir praga</v-card-title>
      <v-card-text>Tem certeza que deseja excluir esta praga?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="deletePlagueDialog = false">Cancelar</v-btn>
        <v-btn color="error" @click="confirmDeletePlague">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="d-flex">
    <div>
      <v-row justify="center">
        <v-col cols="12" md="10" class="d-flex justify-end">
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateServiceDialog">
            Novo serviço
          </v-btn>
        </v-col>
      </v-row>
      <DataTable
        v-if="serviceList"
        :lista="serviceList"
        :headers="serviceHeaders"
        :tableHeight="tableHeight"
        @open-edit-dialog="openEditServiceDialog"
        @open-delete-dialog="openDeleteServiceDialog"
      />
    </div>

    <div>
      <v-row justify="center">
        <v-col cols="12" md="10" class="d-flex justify-end">
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateStatusDialog">
            Novo status
          </v-btn>
        </v-col>
      </v-row>
      <DataTable
        v-if="statusList"
        :lista="statusList"
        :headers="statusHeaders"
        :tableHeight="tableHeight"
        @open-edit-dialog="openEditStatusDialog"
        @open-delete-dialog="openDeleteStatusDialog"
      />
    </div>

    <div>
      <v-row justify="center">
        <v-col cols="12" md="10" class="d-flex justify-end">
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreatePlagueDialog">
            Nova praga
          </v-btn>
        </v-col>
      </v-row>
      <DataTable
        v-if="plagueList"
        :lista="plagueList"
        :headers="plagueHeaders"
        :tableHeight="tableHeight"
        @open-edit-dialog="openEditPlagueDialog"
        @open-delete-dialog="openDeletePlagueDialog"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from "../components/DataTable.vue";
import { useServiceStore } from "../stores/serviceStore.ts";
import { useStatusStore } from "../stores/statusStore.ts";
import { usePlagueStore } from "../stores/plagueStore.ts";
import { toast } from "vue3-toastify";
import { computed, onMounted, ref } from "vue";
import { getErrorMessage } from "../helpers/axiosHelper.ts";
import type { PlagueForm, ServiceForm, StatusForm } from "../types/views/dadosOpcoes.ts";

const serviceStore = useServiceStore();
const statusStore = useStatusStore();
const plagueStore = usePlagueStore();

const serviceList = ref();
const statusList = ref();
const plagueList = ref();

// service
const serviceDialog = ref(false);
const isEditingService = ref(false);
const serviceFormData = ref<ServiceForm>({ serviceName: "" });
const deleteServiceId = ref<number | null>(null);
const deleteServiceDialog = ref(false);

function clearServiceFields() {
  serviceDialog.value = false;
  serviceFormData.value = { serviceName: "" };
  isEditingService.value = false;
}

// status
const statusDialog = ref(false);
const isEditingStatus = ref(false);
const statusFormData = ref<StatusForm>({ statusName: "" });
const deleteStatusId = ref<number | null>(null);
const deleteStatusDialog = ref(false);

function clearStatusFields() {
  statusDialog.value = false;
  statusFormData.value = { statusName: "" };
  isEditingStatus.value = false;
}

// plague
const plagueDialog = ref(false);
const isEditingPlague = ref(false);
const plagueFormData = ref<PlagueForm>({ plagueName: "" });
const deletePlagueId = ref<number | null>(null);
const deletePlagueDialog = ref(false);

function clearPlagueFields() {
  plagueDialog.value = false;
  plagueFormData.value = { plagueName: "" };
  isEditingPlague.value = false;
}

const serviceHeaders = [
  { title: "Services", key: "serviceName" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];
const statusHeaders = [
  { title: "Status", key: "statusName" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];
const plagueHeaders = [
  { title: "Plague", key: "plagueName" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];

const tableHeight = computed(() => {
  const serviceLength = serviceList.value?.length ?? 0;
  const statusLength = statusList.value?.length ?? 0;
  const plagueLength = plagueList.value?.length ?? 0;
  const maxNum = Math.max(serviceLength, statusLength, plagueLength);
  const headerHeight = 56;
  const footerHeight = 60;
  const rowHeight = 52;
  return headerHeight + footerHeight + maxNum * rowHeight;
});

// service actions
async function createService() {
  try {
    const resp = await serviceStore.insertService(serviceFormData.value);
    if (resp.status === 200 || resp.status === 201) {
      toast.success(`Serviço inserido com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      serviceList.value = await serviceStore.getServices();
      clearServiceFields();
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível inserir o serviço..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

async function updateService() {
  try {
    const resp = await serviceStore.editService(serviceFormData.value);
    if (resp.status === 200) {
      toast.success(`Serviço editado com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      serviceList.value = await serviceStore.getServices();
      clearServiceFields();
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível editar o serviço..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

async function confirmDeleteService() {
  if (!deleteServiceId.value) return;
  try {
    const resp = await serviceStore.deleteService(deleteServiceId.value);
    if (resp.status === 204) {
      toast.success(`Serviço excluído com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      serviceList.value = await serviceStore.getServices();
      deleteServiceDialog.value = false;
      deleteServiceId.value = null;
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível excluir o serviço..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

function openCreateServiceDialog() {
  clearServiceFields();
  serviceDialog.value = true;
}

function openEditServiceDialog(item: any) {
  isEditingService.value = true;
  serviceDialog.value = true;
  serviceFormData.value = { id: item.id, serviceName: item.serviceName ?? "" };
}

function openDeleteServiceDialog(id: number) {
  deleteServiceId.value = id;
  deleteServiceDialog.value = true;
}

// status actions
async function createStatus() {
  try {
    const resp = await statusStore.insertStatus(statusFormData.value);
    if (resp.status === 200 || resp.status === 201) {
      toast.success(`Status inserido com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      statusList.value = await statusStore.getStatuses();
      clearStatusFields();
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível inserir o status..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

async function updateStatus() {
  try {
    const resp = await statusStore.editStatus(statusFormData.value);
    if (resp.status === 200) {
      toast.success(`Status editado com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      statusList.value = await statusStore.getStatuses();
      clearStatusFields();
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível editar o status..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

async function confirmDeleteStatus() {
  if (!deleteStatusId.value) return;
  try {
    const resp = await statusStore.deleteStatus(deleteStatusId.value);
    if (resp.status === 204) {
      toast.success(`Status excluído com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      statusList.value = await statusStore.getStatuses();
      deleteStatusDialog.value = false;
      deleteStatusId.value = null;
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível excluir o status..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

function openCreateStatusDialog() {
  clearStatusFields();
  statusDialog.value = true;
}

function openEditStatusDialog(item: any) {
  isEditingStatus.value = true;
  statusDialog.value = true;
  statusFormData.value = { id: item.id, statusName: item.statusName ?? "" };
}

function openDeleteStatusDialog(id: number) {
  deleteStatusId.value = id;
  deleteStatusDialog.value = true;
}

// plague actions
async function createPlague() {
  try {
    const resp = await plagueStore.insertPlague(plagueFormData.value);
    if (resp.status === 200 || resp.status === 201) {
      toast.success(`Praga inserida com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      plagueList.value = await plagueStore.getPlagues();
      clearPlagueFields();
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível inserir a praga..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

async function updatePlague() {
  try {
    const resp = await plagueStore.editPlague(plagueFormData.value);
    if (resp.status === 200) {
      toast.success(`Praga editada com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      plagueList.value = await plagueStore.getPlagues();
      clearPlagueFields();
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível editar a praga..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

async function confirmDeletePlague() {
  if (!deletePlagueId.value) return;
  try {
    const resp = await plagueStore.deletePlague(deletePlagueId.value);
    if (resp.status === 204) {
      toast.success(`Praga excluída com sucesso!`, { autoClose: 3000, position: "top-right", theme: "colored" });
      plagueList.value = await plagueStore.getPlagues();
      deletePlagueDialog.value = false;
      deletePlagueId.value = null;
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível excluir a praga..."), { autoClose: 4000, position: "top-right", theme: "colored" });
  }
}

function openCreatePlagueDialog() {
  clearPlagueFields();
  plagueDialog.value = true;
}

function openEditPlagueDialog(item: any) {
  isEditingPlague.value = true;
  plagueDialog.value = true;
  plagueFormData.value = { id: item.id, plagueName: item.plagueName ?? "" };
}

function openDeletePlagueDialog(id: number) {
  deletePlagueId.value = id;
  deletePlagueDialog.value = true;
}

onMounted(async () => {
  serviceList.value = await serviceStore.getServices();
  statusList.value = await statusStore.getStatuses();
  plagueList.value = await plagueStore.getPlagues();
});
</script>

<style scoped></style>