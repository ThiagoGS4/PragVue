<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import DataTable from "../components/DataTable.vue";
import LocationModal from "../components/LocationModal.vue";
import { usePropertyStore } from "../stores/propertyStore";
import { useCustomerStore } from "../stores/customerStore";
import type { IGetPropertiesResponse } from "../types/stores/propertyStore";
import type { IGetCustomersResponse } from "../types/stores/customerStore";
import type { LocationResult } from "../services/useGeocoding";
import { getErrorMessage } from "../helpers/axiosHelper";

// ─── Stores ────────────────────────────────────────────────────────────────
const propertyStore = usePropertyStore();
const customerStore = useCustomerStore();

// ─── Listas ────────────────────────────────────────────────────────────────
const listProperties = ref<IGetPropertiesResponse[]>([]);
const listCustomers = ref<IGetCustomersResponse[]>([]);

// ─── Estados de dialog ─────────────────────────────────────────────────────
const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const deleteId = ref<number | null>(null);

// ─── LocationModal ──────────────────────────────────────────────────────────
const showLocationModal = ref(false);
const modalMode = ref<"insert" | "edit" | "view">("insert");
const location = ref<LocationResult | null>(null);

// ─── Cabeçalhos da tabela ──────────────────────────────────────────────────
const headers = [
  { title: "Apelido", key: "nickname" },
  { title: "Proprietário", value: "customer.name" },
  { title: "Cidade", key: "city" },
  { title: "Estado", key: "state" },
  { title: "Tipo", key: "property_type" },
  { title: "Ativa", key: "is_active" },
  { title: "Ações", key: "actions", sortable: false },
];

// ─── Tipo do formulário ────────────────────────────────────────────────────
type PropertyForm = {
  id?: number | null;
  nickname: string;
  customer_id: number | null;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  formatted_address: string;
  google_place_id: string;
  latitude: number | null;
  longitude: number | null;
  property_type: "PUBLICO" | "PRIVADO";
  is_active: number;
};

const emptyForm = (): PropertyForm => ({
  id: null,
  nickname: "",
  customer_id: null,
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  country: "",
  formatted_address: "",
  google_place_id: "",
  latitude: null,
  longitude: null,
  property_type: "PUBLICO",
  is_active: 1,
});

const formData = ref<PropertyForm>(emptyForm());

const propertyTypeItems = [
  { label: "Público", value: "PUBLICO" },
  { label: "Privado", value: "PRIVADO" },
];

const isActiveItems = [
  { label: "Ativa", value: 1 },
  { label: "Inativa", value: 0 },
];

// ─── Validação ─────────────────────────────────────────────────────────────
const isSaveDisabled = computed(() => {
  return (
    !formData.value.nickname.trim() ||
    !formData.value.customer_id ||
    !formData.value.formatted_address.trim()
  );
});

// ─── Helpers de formulário ─────────────────────────────────────────────────
function clearFields() {
  formData.value = emptyForm();
  location.value = null;
  dialog.value = false;
  isEditing.value = false;
}

function syncLocationToForm(loc: LocationResult | null) {
  if (!loc) return;
  formData.value.formatted_address = loc.address;
  formData.value.latitude = loc.lat;
  formData.value.longitude = loc.lng;
}

// ─── Abertura de diálogos ──────────────────────────────────────────────────
function openCreateDialog() {
  clearFields();
  location.value = null;
  modalMode.value = "insert";
  dialog.value = true;
}

function openEditDialog(item: IGetPropertiesResponse) {
  isEditing.value = true;

  formData.value = {
    id: (item as any).id ?? null,
    nickname: item.nickname,
    customer_id: item.customer.id,
    cep: item.cep,
    street: item.street,
    number: item.number,
    complement: item.complement,
    district: item.district,
    city: item.city,
    state: item.state,
    country: item.country,
    formatted_address: item.formatted_address,
    google_place_id: item.google_place_id,
    latitude: item.latitude,
    longitude: item.longitude,
    property_type: item.property_type,
    is_active: item.is_active,
  };

  location.value =
    item.latitude && item.longitude
      ? {
          lat: item.latitude,
          lng: item.longitude,
          address: item.formatted_address,
        }
      : null;

  modalMode.value = "edit";
  dialog.value = true;
}

function openDeleteDialog(id: number) {
  deleteId.value = id;
  deleteDialog.value = true;
}

// ─── Abrir mapa dentro do dialog ──────────────────────────────────────────
function openMapInDialog() {
  showLocationModal.value = true;
}

function handleLocationSave() {
  syncLocationToForm(location.value);
  showLocationModal.value = false;
}

// ─── View: abrir mapa somente leitura (fora do form) ──────────────────────
function openViewDialog(item: IGetPropertiesResponse) {
  location.value =
    item.latitude && item.longitude
      ? {
          lat: item.latitude,
          lng: item.longitude,
          address: item.formatted_address,
        }
      : null;
  modalMode.value = "view";
  showLocationModal.value = true;
}

// ─── CRUD ──────────────────────────────────────────────────────────────────
function buildPayload() {
  return {
    id: formData.value.id ?? undefined,
    nickname: formData.value.nickname.trim(),
    customer: formData.value.customer_id,
    cep: formData.value.cep.trim(),
    street: formData.value.street.trim(),
    number: formData.value.number.trim(),
    complement: formData.value.complement.trim(),
    district: formData.value.district.trim(),
    city: formData.value.city.trim(),
    state: formData.value.state.trim(),
    country: formData.value.country.trim(),
    formatted_address: formData.value.formatted_address,
    google_place_id: formData.value.google_place_id,
    latitude: formData.value.latitude,
    longitude: formData.value.longitude,
    property_type: formData.value.property_type,
    is_active: formData.value.is_active,
  };
}

async function createProperty() {
  try {
    const resp = await propertyStore.insertProperty(buildPayload());

    if (resp.status === 200 || resp.status === 201) {
      toast.success("Propriedade inserida com sucesso!", {
        autoClose: 3000,
        position: "top-right",
        theme: "colored",
      });
      listProperties.value = await propertyStore.getProperties();
      clearFields();
    }
  } catch (error) {
    toast.error(
      getErrorMessage(error, "Não foi possível inserir a propriedade..."),
      { autoClose: 4000, position: "top-right", theme: "colored" }
    );
  }
}

async function updateProperty() {
  try {
    const resp = await propertyStore.editProperty(buildPayload());

    if (resp.status === 200) {
      toast.success("Propriedade editada com sucesso!", {
        autoClose: 3000,
        position: "top-right",
        theme: "colored",
      });
      listProperties.value = await propertyStore.getProperties();
      clearFields();
    }
  } catch (error) {
    toast.error(
      getErrorMessage(error, "Não foi possível editar a propriedade..."),
      { autoClose: 4000, position: "top-right", theme: "colored" }
    );
  }
}

async function confirmDelete() {
  if (!deleteId.value) return;

  try {
    const resp = await propertyStore.deleteProperty(deleteId.value);

    if (resp.status === 204) {
      toast.success("Propriedade excluída com sucesso!", {
        autoClose: 3000,
        position: "top-right",
        theme: "colored",
      });
      listProperties.value = await propertyStore.getProperties();
      deleteDialog.value = false;
      deleteId.value = null;
    }
  } catch (error) {
    toast.error(
      getErrorMessage(error, "Não foi possível excluir a propriedade..."),
      { autoClose: 4000, position: "top-right", theme: "colored" }
    );
  }
}

// ─── Inicialização ─────────────────────────────────────────────────────────
onMounted(async () => {
  [listProperties.value, listCustomers.value] = await Promise.all([
    propertyStore.getProperties(),
    customerStore.getCustomers(),
  ]);
});
</script>

<template>
  <v-container fluid>
    <!-- ── LocationModal (view-only fora do form, ou mapa dentro do dialog) ── -->
    <LocationModal
      v-model="location"
      :open="showLocationModal"
      :mode="modalMode"
      @close="handleLocationSave"
    />

    <!-- ── Botão Nova propriedade ────────────────────────────────────────── -->
    <v-row justify="center" class="mb-4">
      <v-col cols="12" md="10" class="d-flex justify-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Nova propriedade
        </v-btn>
      </v-col>
    </v-row>

    <!-- ── DataTable ─────────────────────────────────────────────────────── -->
    <DataTable
      v-if="listProperties.length"
      :lista="listProperties"
      :headers="headers"
      @openEditDialog="openEditDialog"
      @openDeleteDialog="openDeleteDialog"
    >
      <!-- slot de actions extra: botão View -->
      <template #extra-actions="{ item }">
        <v-tooltip text="Visualizar no mapa" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-map-marker-outline"
              variant="text"
              size="small"
              color="secondary"
              @click="openViewDialog(item)"
            />
          </template>
        </v-tooltip>
      </template>
    </DataTable>

    <!-- ── Dialog criar / editar ─────────────────────────────────────────── -->
    <v-dialog v-model="dialog" max-width="760" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ isEditing ? "Editar propriedade" : "Nova propriedade" }}</span>
          <v-btn icon="mdi-close" variant="text" @click="clearFields" />
        </v-card-title>

        <v-card-text>
          <v-form
            @submit.prevent="isEditing ? updateProperty() : createProperty()"
          >
            <v-row dense>
              <!-- Apelido -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.nickname"
                  label="Apelido / nome da propriedade"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Proprietário (autocomplete) -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="formData.customer_id"
                  :items="listCustomers"
                  item-title="name"
                  item-value="id"
                  label="Proprietário"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  no-data-text="Nenhum cliente encontrado"
                />
              </v-col>

              <!-- Tipo de propriedade -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.property_type"
                  :items="propertyTypeItems"
                  item-title="label"
                  item-value="value"
                  label="Tipo de propriedade"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.is_active"
                  :items="isActiveItems"
                  item-title="label"
                  item-value="value"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Endereço Google (preenchido pelo mapa) -->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.formatted_address"
                  label="Endereço (Google)"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  :placeholder="
                    formData.latitude
                      ? ''
                      : 'Selecione a localização no mapa'
                  "
                  :append-inner-icon="
                    isEditing ? 'mdi-map-marker-edit' : 'mdi-map-marker-plus'
                  "
                  @click:append-inner="openMapInDialog"
                  @click="openMapInDialog"
                />
              </v-col>

              <!-- Dados de endereço (preenchidos manualmente ou vindos do banco) -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.cep"
                  label="CEP"
                  variant="outlined"
                  density="comfortable"
                  maxlength="8"
                />
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field
                  v-model="formData.street"
                  label="Rua"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.number"
                  label="Número"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.complement"
                  label="Complemento"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.district"
                  label="Bairro"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="5">
                <v-text-field
                  v-model="formData.city"
                  label="Cidade"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="formData.state"
                  label="Estado"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.country"
                  label="País"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="clearFields">Cancelar</v-btn>
          <v-btn
            color="primary"
            :disabled="isSaveDisabled"
            @click="isEditing ? updateProperty() : createProperty()"
          >
            {{ isEditing ? "Atualizar" : "Salvar" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Dialog de confirmação de exclusão ─────────────────────────────── -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>Excluir propriedade</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir esta propriedade?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>