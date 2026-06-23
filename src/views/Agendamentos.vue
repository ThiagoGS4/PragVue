<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Calendar from "../components/Calendar.vue";
import { useScheduleStore } from "../stores/scheduleStore.ts";
import { usePropertyStore } from "../stores/propertyStore.ts";
import { usePlagueStore } from "../stores/plagueStore.ts";
import { useStatusStore } from "../stores/statusStore.ts";
import { useServiceStore } from "../stores/serviceStore.ts";
import { useUserStore } from "../stores/userStore.ts";

import type {
  IFormData,
  IGetSchedulesResponse,
  ISchedulesInput,
} from "../types/views/agendamentos.ts";
import { AppTimePicker } from "@boichikpro/vue3-date-time-picker";
import "@boichikpro/vue3-date-time-picker/assets/style.css";
import "@boichikpro/vue3-date-time-picker/assets/variables.css";
import type { EventSlotScope } from "vuetify/lib/components/VCalendar/VCalendar.mjs";
import { format, parse } from "date-fns";
import { toast } from "vue3-toastify";

const scheduleStore = useScheduleStore();
const propertyStore = usePropertyStore();
const plagueStore = usePlagueStore();
const statusStore = useStatusStore();
const serviceStore = useServiceStore();
const userStore = useUserStore();

const scheduleList = ref<IGetSchedulesResponse[]>();
const listaPropriedades = ref();
const listaPragas = ref();
const listaServicos = ref();
const listaStatus = ref();
const listaTecnicos = ref();
const isEditing = ref(false);

const dialogDelete = ref(false);
const dialog = ref(false);

const completedModel = computed<boolean>({
  get() {
    return !!formData.value.completed
  },
  set(checked) {
    formData.value.completed = checked ? new Date() : undefined
  },
})

const formData = ref<IFormData>({
  date: "",
  notes: "",
  propertyId: null,
  plagueId: null,
  serviceId: null,
  statusId: null,
  technicianId: null,
});

function insertDialog(date: string) {
  formData.value.date = date;
  dialog.value = true;
}

function updateDialogue(data: EventSlotScope) {
  dialog.value = true;
  isEditing.value = true;
  // populando fromData com dados do evento selecionado
  formData.value = {
    id: data.event?.id,
    date: data.eventParsed.start.date,
    startTime: parse(
      data.eventParsed.start.date + ":" + data.eventParsed.start.time,
      "yyyy-MM-dd:HH:mm",
      new Date(),
    ),
    endTime: parse(
      data.eventParsed.end.date + ":" + data.eventParsed.end.time,
      "yyyy-MM-dd:HH:mm",
      new Date(),
    ),
    completed: data.event?.completed ? new Date(data.event.completed) : undefined,
    notes: data.event?.notes,
    propertyId: data.event?.property,
    plagueId: data.event?.plague,
    serviceId: data.event?.service,
    statusId: data.event?.status,
    technicianId: data.event?.technician,
  };
}

async function createNewSchedule(formDataInsert: IFormData) {
  // todo gerar um date para se formDataInsert.completed for true
  const startTemp =
    formDataInsert.date + format(formDataInsert.startTime!, "HH:mm");
  const endTemp =
    formDataInsert.date + format(formDataInsert.endTime!, "HH:mm");
  const payload: ISchedulesInput = {
    scheduled_start: parse(
      startTemp,
      "yyyy-MM-ddHH:mm",
      new Date(),
    ).toTemporalInstant(),
    scheduled_end: parse(
      endTemp,
      "yyyy-MM-ddHH:mm",
      new Date(),
    ).toTemporalInstant(),
    notes: formDataInsert.notes,
    properties: formDataInsert.propertyId!,
    plagues: formDataInsert.plagueId!,
    service: formDataInsert.serviceId!,
    status: formDataInsert.statusId!,
    users: formDataInsert.technicianId!,
  };
  const resp = await scheduleStore.insertSchedule(payload);
  if (resp.status === 200) {
    toast.success(`Agendamento inserido com sucesso!`, {
      autoClose: 3000,
      position: "top-right",
      theme: "colored",
    });
  scheduleList.value = await scheduleStore.getSchedules();
  } else {
    toast.error("Não foi possível inserir o agendamento...", {
      autoClose: 4000,
      position: "top-right",
      theme: "colored",
    });
  }
  clearFields()
}

async function updateSchedule(formData: IFormData) {
  // todo gerar um date para se formData.completed for true
  const startTemp = formData.date + format(formData.startTime!, "HH:mm");
  const endTemp = formData.date + format(formData.endTime!, "HH:mm");
  const payload: ISchedulesInput = {
    id: formData.id,
    completed_at: formData.completed ? formData.completed.toTemporalInstant() : null,
    scheduled_start: parse(
      startTemp,
      "yyyy-MM-ddHH:mm",
      new Date(),
    ).toTemporalInstant(),
    scheduled_end: parse(
      endTemp,
      "yyyy-MM-ddHH:mm",
      new Date(),
    ).toTemporalInstant(),
    notes: formData.notes,
    properties: formData.propertyId!,
    plagues: formData.plagueId!,
    service: formData.serviceId!,
    status: formData.statusId!,
    users: formData.technicianId!,
  };
  const resp = await scheduleStore.updateSchedule(payload);
  if (resp.status === 200) {
    toast.success(`Agendamento editado com sucesso!`, {
      autoClose: 3000,
      position: "top-right",
      theme: "colored",
    });
  scheduleList.value = await scheduleStore.getSchedules();
  } else {
    toast.error("Não foi possível inserir o agendamento...", {
      autoClose: 4000,
      position: "top-right",
      theme: "colored",
    });
  }
  clearFields()
}

async function deleteSchedule(scheduleId: number){
  const resp = await scheduleStore.deleteSchedule(scheduleId);
  if (resp.status === 204) {
    toast.success(`Agendamento excluído com sucesso!`, {
      autoClose: 3000,
      position: "top-right",
      theme: "colored",
    });
  scheduleList.value = await scheduleStore.getSchedules();
  } else {
    toast.error("Não foi possível excluir o agendamento...", {
      autoClose: 4000,
      position: "top-right",
      theme: "colored",
    });
  }
  dialogDelete.value = false
  clearFields()
}

function clearFields() {
  formData.value = {
    date: "",
    startTime: undefined,
    endTime: undefined,
    completed: undefined,
    notes: "",
    propertyId: null,
    plagueId: null,
    serviceId: null,
    statusId: null,
    technicianId: null,
  };
  dialog.value = false;
  isEditing.value = false;
}

onMounted(async () => {
  scheduleList.value = await scheduleStore.getSchedules();
  listaPropriedades.value = await propertyStore.getProperties();
  listaPragas.value = await plagueStore.getPlagues();
  listaServicos.value = await serviceStore.getServices();
  listaStatus.value = await statusStore.getStatuses();
  listaTecnicos.value = await userStore.getTechnicians();
});
</script>

<template>
  <Calendar
    v-if="scheduleList"
    :events="scheduleList"
    @day-clicked="insertDialog"
    @element-clicked="updateDialogue"
  ></Calendar>

 <v-dialog v-model="dialogDelete" max-width="520">
    <v-card class="dialog-card rounded-xl elevation-8">
      <div class="dialog-header-delete">
        <h3 class="text-h6 font-weight-bold text-white">
          ⚠️ Confirmar Exclusão
        </h3>
        <v-btn
          icon
          @click="dialogDelete = false"
          variant="text"
          color="white"
          size="small"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="pa-6 text-center">
        <p class="text-h6 mb-2">
          Tem certeza que deseja excluir o agendamento selecionado?
        </p>
        <p class="text-caption text-grey-darken-1">
          Esta ação não pode ser desfeita.
        </p>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          @click="dialogDelete = false"
          prepend-icon="mdi-close"
          class="text-capitalize"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="red-accent-4"
          variant="elevated"
          @click="deleteSchedule(formData.id!)"
          prepend-icon="mdi-delete"
          class="text-capitalize font-weight-medium"
        >
          Deletar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="dialog"
    class="text-center pa-4"
    max-width="640"
    @update:modelValue="clearFields()"
  >
    <v-card class="dialog-card rounded-xl elevation-8">
      <!-- Header do dialog -->
      <div class="dialog-header">
        <h3 class="text-h5 font-weight-bold text-white">
          {{ isEditing ? "✏️ Editar Agendamento" : "➕ Novo Agendamento" }}
        </h3>
        <v-btn
          icon
          @click="clearFields"
          variant="text"
          color="white"
          size="small"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="pa-6">
        <v-form
          @keydown.enter.exact.prevent="
            isEditing
              ? !formData.id ||
                !formData.startTime ||
                !formData.endTime ||
                !formData.propertyId ||
                !formData.plagueId ||
                !formData.serviceId ||
                !formData.statusId ||
                !formData.technicianId
                ? updateSchedule(formData)
                : ''
              : !formData.startTime ||
                  !formData.endTime ||
                  !formData.propertyId ||
                  !formData.plagueId ||
                  !formData.serviceId ||
                  !formData.statusId ||
                  !formData.technicianId
                ? createNewSchedule(formData)
                : ''
          "
        >
          <v-row dense>
            <v-text-field v-if="false" v-model="formData.id" />
            <v-col cols="12" md="6">
              <AppTimePicker
              placeholder="hora de início"
                v-model="formData.startTime"
                :z-index="2404"
                format="HH:mm"
              />
            </v-col>
            <v-col cols="12" md="6">
              <AppTimePicker
                placeholder="hora de término"
                v-model="formData.endTime"
                :z-index="2404"
                format="HH:mm"
                :min="formData.startTime"
              />
            </v-col>
            <v-col cols="12" md="6">
              <h5>esse campo só deve ser preenchido ao terminar o serviço</h5>
            <v-checkbox
              v-model="completedModel"
              :color="completedModel ? 'green' : 'white'"
              label="Serviço terminado"
              hide-details
            />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Anotações"
                v-model="formData.notes"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-text"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Propriedade"
                v-model="formData.propertyId"
                :items="listaPropriedades"
                item-title="nickname"
                item-value="id"
                variant="outlined"
                density="comfortable"
                color="primary"
                maxlength="15"
                prepend-inner-icon="mdi-account"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Tipo de Praga"
                v-model="formData.plagueId"
                :items="listaPragas"
                item-title="plague_name"
                item-value="id"
                variant="outlined"
                density="comfortable"
                color="primary"
                maxlength="15"
                prepend-inner-icon="mdi-account"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Tipo de Serviço"
                v-model="formData.serviceId"
                :items="listaServicos"
                item-title="service_name"
                item-value="id"
                variant="outlined"
                density="comfortable"
                color="primary"
                maxlength="15"
                prepend-inner-icon="mdi-account"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Status"
                v-model="formData.statusId"
                :items="listaStatus"
                item-title="status_name"
                item-value="id"
                variant="outlined"
                density="comfortable"
                color="primary"
                maxlength="15"
                prepend-inner-icon="mdi-account"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Técnico"
                v-model="formData.technicianId"
                :items="listaTecnicos"
                item-title="username"
                item-value="id"
                variant="outlined"
                density="comfortable"
                color="primary"
                maxlength="15"
                prepend-inner-icon="mdi-account"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          @click="clearFields()"
          prepend-icon="mdi-close"
          class="text-capitalize"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="createNewSchedule(formData)"
          v-if="!isEditing"
          prepend-icon="mdi-check"
          class="text-capitalize font-weight-medium"
          :disabled="
            !formData.startTime ||
            !formData.endTime ||
            !formData.propertyId ||
            !formData.plagueId ||
            !formData.serviceId ||
            !formData.statusId
          "
        >
          Salvar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="updateSchedule(formData)"
          :disabled="
            !formData.id ||
            !formData.startTime ||
            !formData.endTime ||
            !formData.propertyId ||
            !formData.plagueId ||
            !formData.serviceId ||
            !formData.statusId ||
            !formData.technicianId
          "
          v-if="isEditing"
          prepend-icon="mdi-check"
          class="text-capitalize font-weight-medium"
        >
        Atualizar
        </v-btn>
        <v-btn
          color="red-accent-4"
          variant="elevated"
          @click="dialogDelete = true"
          :disabled="formData.completed ? true : false"
          v-if="isEditing"
          prepend-icon="mdi-delete"
          class="text-capitalize font-weight-medium"
        >
          Excluir Registro
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  background-color: #fafbfc;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #00814c 0%, #1976d2 100%);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header-delete {
  background: linear-gradient(135deg, #c62828 0%, #e53935 100%);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.v-btn:focus {
  outline: none !important;
}
</style>
