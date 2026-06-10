<template>
  <v-container fluid>
    <v-row justify="center" class="mb-4">
      <v-col cols="12" md="10" class="d-flex justify-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Novo cliente
        </v-btn>
      </v-col>
    </v-row>

    <DataTable
      v-if="listCustomers"
      :lista="listCustomers"
      :headers="headers"
      @openEditDialog="openEditDialog"
      @openDeleteDialog="openDeleteDialog"
    />

    <v-dialog v-model="dialog" max-width="680">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ isEditing ? "Editar cliente" : "Novo cliente" }}</span>
          <v-btn icon="mdi-close" variant="text" @click="clearFields" />
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="isEditing ? updateCustomer() : createCustomer()">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-select
                  v-model="customerType"
                  :items="customerTypeItems"
                  item-title="label"
                  item-value="value"
                  label="Tipo de cliente"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  key="name-field"
                  v-model="formData.name"
                  label="Nome"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6" v-if="customerType === 'PF'">
                <v-text-field
                  key="cpf-field"
                  v-model="formData.cpf"
                  label="CPF"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6" v-if="customerType === 'PJ'">
                <v-text-field
                  key="cnpj-field"
                  v-model="formData.cnpj"
                  label="CNPJ"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.phone"
                  label="Telefone"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
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
            @click="isEditing ? updateCustomer() : createCustomer()"
            :disabled="isSaveDisabled"
          >
            {{ isEditing ? "Atualizar" : "Salvar" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>Excluir cliente</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir este cliente?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import DataTable from "../components/DataTable.vue";
import { useCustomerStore } from "../stores/customerStore.ts";
import type {
  IGetCustomersResponse,
  IUpsertCustomer,
} from "../types/stores/customerStore.ts";
import { getErrorMessage } from "../helpers/axiosHelper.ts";

const customerStore = useCustomerStore();

const listCustomers = ref<IGetCustomersResponse[]>([]);
const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const deleteId = ref<number | null>(null);

const headers = [
  { title: "Nome", key: "name" },
  { title: "CPF", key: "cpf" },
  { title: "CNPJ", key: "cnpj" },
  { title: "Telefone", key: "phone" },
  { title: "Email", key: "email" },
  { title: "Ações", key: "actions", sortable: false },
];

type CustomerType = "PF" | "PJ";

const customerType = ref<CustomerType>("PF");

const customerTypeItems = [
  { label: "Pessoa física", value: "PF" },
  { label: "Pessoa jurídica", value: "PJ" },
];

type CustomerForm = {
  id?: number;
  name: string;
  cpf: string;
  cnpj: string;
  phone: string;
  email: string;
};

const formData = ref<CustomerForm>({
  name: "",
  cpf: "",
  cnpj: "",
  phone: "",
  email: "",
});

watch(customerType, (value) => {
  if (value === "PF") {
    formData.value.cnpj = "";
  } else {
    formData.value.cpf = "";
  }
});

const isSaveDisabled = computed(() => {
  const hasName = !!formData.value.name.trim();
  const hasPhone = !!formData.value.phone.trim();
  const hasEmail = !!formData.value.email.trim();

  if (customerType.value === "PF") {
    return !(
      hasName &&
      hasPhone &&
      hasEmail &&
      formData.value.cpf.trim()
    );
  }

  return !(
    hasName &&
    hasPhone &&
    hasEmail &&
    formData.value.cnpj.trim()
  );
});

function clearFields() {
  formData.value = {
    name: "",
    cpf: "",
    cnpj: "",
    phone: "",
    email: "",
  };
  customerType.value = "PF";
  dialog.value = false;
  isEditing.value = false;
}

function openCreateDialog() {
  clearFields();
  dialog.value = true;
}

function openEditDialog(item: IGetCustomersResponse) {
  isEditing.value = true;
  dialog.value = true;

  const isPf = !!item.cpf;

  customerType.value = isPf ? "PF" : "PJ";

  formData.value = {
    id: item.id,
    name: item.name ?? "",
    cpf: item.cpf ?? "",
    cnpj: item.cnpj ?? "",
    phone: item.phone ?? "",
    email: item.email ?? "",
  };
}

function openDeleteDialog(id: number) {
  deleteId.value = id;
  deleteDialog.value = true;
}

function buildPayload(): IUpsertCustomer {
  const base = {
    id: formData.value.id,
    name: formData.value.name.trim(),
    phone: formData.value.phone.trim(),
    email: formData.value.email.trim(),
  };

  if (customerType.value === "PJ") {
    return {
      ...base,
      cnpj: formData.value.cnpj.trim(),
    };
  }

  return {
    ...base,
    cpf: formData.value.cpf.trim(),
  };
}

async function createCustomer() {
  try {
    const resp = await customerStore.insertCustomer(buildPayload());

    if (resp.status === 200 || resp.status === 201) {
      toast.success(`Cliente inserido com sucesso!`, {
        autoClose: 3000,
        position: "top-right",
        theme: "colored",
      });
      listCustomers.value = await customerStore.getCustomers();
      clearFields();
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível inserir o cliente..."), {
      autoClose: 4000,
      position: "top-right",
      theme: "colored",
    });
  }
}

async function updateCustomer() {
  try {
    const resp = await customerStore.updateCustomer(buildPayload());

    if (resp.status === 200) {
      toast.success(`Cliente editado com sucesso!`, {
        autoClose: 3000,
        position: "top-right",
        theme: "colored",
      });
      listCustomers.value = await customerStore.getCustomers();
      clearFields();
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível editar o cliente..."), {
      autoClose: 4000,
      position: "top-right",
      theme: "colored",
    });
  }
}

async function confirmDelete() {
  if (!deleteId.value) return;

  try {
    const resp = await customerStore.deleteCustomer(deleteId.value);

    if (resp.status === 204) {
      toast.success(`Cliente excluído com sucesso!`, {
        autoClose: 3000,
        position: "top-right",
        theme: "colored",
      });
      listCustomers.value = await customerStore.getCustomers();
      deleteDialog.value = false;
      deleteId.value = null;
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Não foi possível excluir o cliente..."), {
      autoClose: 4000,
      position: "top-right",
      theme: "colored",
    });
  }
}

async function loadCustomers() {
  listCustomers.value = await customerStore.getCustomers();
}

onMounted(loadCustomers);
</script>