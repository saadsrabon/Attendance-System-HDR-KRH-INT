<template>
  <div>
    <!-- Top Filter Section -->
    <DxToolbar class="filter-toolbar">
      <DxItem location="before" widget="dxSelectBox">
        <DxSelectBox
          :items="jenisTemplatOptions"
          display-expr="text"
          value-expr="value"
          placeholder="Pilih"
          label="Jenis Templat"
          label-mode="outside"
          :search-enabled="true"
          v-model:value="selectedFilters.jenisTemplat"
          :width="390"
          icon="redo"
        />
      </DxItem>

      <DxItem location="before" widget="dxTextBox">
        <DxSelectBox
          :data-source="namaTemplatOptions"
          display-expr="text"
          placeholder="Pilih"
          v-model:value="selectedFilters.namaTemplat"
          :width="390"
          label="Nama Templat"
          label-mode="outside"
        />
      </DxItem>

      <DxItem location="before" widget="dxSelectBox">
        <DxSelectBox
          :data-source="statusOptions"
          display-expr="text"
          value-expr="value"
          placeholder="Pilih"
          :search-enabled="false"
          v-model:value="selectedFilters.status"
          :width="390"
          label="Status"
          label-mode="outside"
        />
      </DxItem>
    </DxToolbar>

    <DxButton
      text="Cari"
      type="default"
      styling-mode="contained"
      @click="applyFilters"
      :width="80"
    />

    <DxButton
      text="Set Semula"
      icon="redo"
      type="normal"
      styling-mode="outlined"
      @click="resetFilters"
      :width="100"
    />
    <div>
      <DxButton
        icon="plus"
        type="success"
        styling-mode="contained"
        @click="openAddModal"
        :width="40"
        :height="40"
        class="add-button"
      />
    </div>

    <!-- Data Grid -->
    <DxDataGrid
      :data-source="filteredData"
      :show-borders="true"
      :row-alternation-enabled="true"
      key-expr="id"
      class="custom-datagrid"
    >
      <DxSearchPanel :visible="true" :highlight-case-sensitive="false" placeholder="Carian..." />

      <DxColumnChooser :enabled="true" mode="select" />

      <DxPaging :page-size="5" />
      <DxPager
        display-mode="full"
        :visible="true"
        :show-info="true"
        :show-page-size-selector="true"
        :allowed-page-sizes="[5, 10, 20, 30]"
      />

      <DxColumn data-field="id" caption="Bil" :width="60" alignment="center" />
      <DxColumn data-field="kodTemplat" caption="Kod Templat" :width="120" />
      <DxColumn data-field="jenisTemplat" caption="Jenis Templat" :width="120" />
      <DxColumn data-field="namaTemplat" caption="Nama Templat" :min-width="300" />
      <DxColumn data-field="status" caption="Status" :width="120" alignment="center">
        <DxLookup :data-source="statusOptionsForForm" display-expr="text" value-expr="value" />
      </DxColumn>

      <DxColumn
        type="buttons"
        caption="Tindakan"
        :width="120"
        alignment="center"
        :buttons="[
          {
            hint: 'Edit',
            icon: 'edit',
            onClick: (e) => openEditModal(e.row.data),
          },
          {
            hint: 'Delete',
            icon: 'trash',
            onClick: (e) => openDeleteConfirm(e.row.data),
          },
        ]"
      />
    </DxDataGrid>

    <!-- Add/Edit Modal -->
    <DxPopup
      v-model:visible="formPopupVisible"
      :width="600"
      :height="300"
      :title="isEditMode ? 'Kemaskini Templat' : 'Tambah Templat Baru'"
      @hiding="closeFormModal"
      :resize-enabled="true"
      class="form-popup"
    >
      <DxScrollView width="100%" height="100%">
        <form @submit.prevent="saveTemplate">
          <DxForm
            ref="formRef"
            :form-data="formDisplayData"
            label-location="top"
            :col-count="2"
            class="template-form"
          >
            <div class="form-content">
              <DxSimpleItem data-field="id" :visible="false" />
              <DxSimpleItem data-field="kodTemplat" :visible="false" />
              <DxSimpleItem 
                data-field="jenisTemplat" 
                editor-type="dxSelectBox"
                :is-required="true"
              >
                <DxLabel text="Jenis Templat" />
                <DxValidator>
                  <DxRequiredRule message="Jenis Templat diperlukan" />
                </DxValidator>
                <DxSelectBox
                  :data-source="jenisTemplatOptionsForForm"
                  display-expr="text"
                  value-expr="value"
                  placeholder="Pilih jenis templat"
                  :search-enabled="false"
                />
              </DxSimpleItem>

              <DxSimpleItem 
                data-field="namaTemplat" 
                editor-type="dxTextBox"
                :is-required="true"
              >
                <DxLabel text="Nama Templat" />
                <DxValidator>
                  <DxRequiredRule message="Nama Templat diperlukan" />
                  <DxStringLengthRule
                    :min="5"
                    :max="100"
                    message="Nama Templat mesti antara 5-100 aksara"
                  />
                </DxValidator>
                <DxTextBox :max-length="100" placeholder="Masukkan nama templat" />
              </DxSimpleItem>

              <DxSimpleItem 
                data-field="tajuk" 
                editor-type="dxTextBox"
              >
                <DxLabel text="Tajuk" />
                <DxValidator>
                  <DxStringLengthRule :max="50" message="Tajuk maksimum 50 aksara" />
                </DxValidator>
                <DxTextBox :max-length="50" placeholder="Masukkan tajuk (pilihan)" />
              </DxSimpleItem>

              <DxSimpleItem 
                data-field="status" 
                editor-type="dxSelectBox"
                :is-required="true"
              >
                <DxLabel text="Status" />
                <DxValidator>
                  <DxRequiredRule message="Status diperlukan" />
                </DxValidator>
                <DxSelectBox
                  :data-source="statusOptionsForForm"
                  display-expr="text"
                  value-expr="value"
                  placeholder="Pilih status"
                  :search-enabled="false"
                />
              </DxSimpleItem>
            </div>
          </DxForm>
          <div class="flex justify-end gap-2">
            <DxButton
              :text="isEditMode ? 'Kemaskini' : 'Simpan'"
              type="default"
              styling-mode="contained"
            
              :width="120"
              icon="save"
              :use-submit-behavior="true"
            />

            <DxButton
              text="Set Semula"
              icon="redo"
              type="normal"
              styling-mode="contained"
              @click="resetForm"
              :width="120"
            />
          </div>
        </form>
      </DxScrollView>
    </DxPopup>

    <!-- Delete Confirmation -->
    <DxPopup
      v-model:visible="deletePopupVisible"
      :width="400"
      :height="250"
      title="Pengesahan Padam"
      @hiding="closeDeleteConfirm"
      :drag-enabled="true"
    >
      <DxScrollView width="100%" height="100%">
        <div class="delete-confirm-content">
          <p>Adakah anda pasti untuk memadam templat ini?</p>
          <p class="template-name">{{ selectedToDelete?.namaTemplat }}</p>

          <div class="button-container">
            <DxButton
              text="Padam"
              type="danger"
              styling-mode="contained"
              @click="confirmDelete"
              :width="100"
            />

            <DxButton
              text="Batal"
              type="normal"
              styling-mode="outlined"
              @click="closeDeleteConfirm"
              :width="100"
            />
          </div>
        </div>
      </DxScrollView>
    </DxPopup>
  </div>
</template>

<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxPager,
  DxSearchPanel,
  DxColumnChooser,
  DxLookup,
} from "devextreme-vue/data-grid";
import { DxPopup } from "devextreme-vue/popup";
import { DxScrollView } from "devextreme-vue/scroll-view";
import { DxButton } from "devextreme-vue/button";
import DxSelectBox from "devextreme-vue/select-box";
import { DxTextBox } from "devextreme-vue/text-box";
import { DxToolbar, DxItem } from "devextreme-vue/toolbar";
import {
  DxForm,
  DxSimpleItem,
  DxLabel,
} from "devextreme-vue/form";
import {
  DxValidator,
  DxRequiredRule,
  DxStringLengthRule,
} from "devextreme-vue/validator";
import { ref, computed } from "vue";
import notify from "devextreme/ui/notify";
import { initialTemplateData } from "@/stores/templates/data";

function getUniqueOptions(data, key) {
  const seen = new Set();
  return data
    .filter((item) => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    })
    .map((item) => ({ text: item[key], value: item[key] }));
}

const jenisTemplatOptions = getUniqueOptions(initialTemplateData, "jenisTemplat");
const statusOptions = getUniqueOptions(initialTemplateData, "status");
const namaTemplatOptions = getUniqueOptions(initialTemplateData, "namaTemplat");

const jenisTemplatOptionsForForm = [
  { text: "E-mel", value: "E-mel" },
  { text: "SMS", value: "SMS" },
];

const statusOptionsForForm = [
  { text: "Aktif", value: "Aktif" },
  { text: "Tidak Aktif", value: "Tidak Aktif" },
];

// Reactive variables
const templateData = ref([...initialTemplateData]);
const formPopupVisible = ref(false);
const deletePopupVisible = ref(false);
const isEditMode = ref(false);
const formRecord = ref({});
const formDisplayData = ref({});
const selectedToDelete = ref(null);
const formRef = ref(null);

// Filter states
const selectedFilters = ref({
  jenisTemplat: "",
  namaTemplat: "",
  status: "",
});

const activeFilters = ref({
  jenisTemplat: "",
  namaTemplat: "",
  status: "",
});

// Store original data for edit mode
const originalFormData = ref({});

// Computed property for filtered data
const filteredData = computed(() => {
  let filtered = [...templateData.value];

  if (activeFilters.value.jenisTemplat) {
    filtered = filtered.filter((item) => item.jenisTemplat === activeFilters.value.jenisTemplat);
  }

  if (activeFilters.value.namaTemplat) {
    filtered = filtered.filter((item) => 
      item.namaTemplat === activeFilters.value.namaTemplat.text || 
      item.namaTemplat === activeFilters.value.namaTemplat
    );
  }

  if (activeFilters.value.status) {
    filtered = filtered.filter((item) => item.status === activeFilters.value.status);
  }

  return filtered;
});

// Apply filters when search button is clicked
const applyFilters = () => {
  activeFilters.value = {
    jenisTemplat: selectedFilters.value.jenisTemplat,
    namaTemplat: selectedFilters.value.namaTemplat?.value || selectedFilters.value.namaTemplat,
    status: selectedFilters.value.status
  };
  notify(
    `Carian selesai. Ditemukan ${filteredData.value.length} templat.`,
    "success",
    2000
  );
};

// Reset filters
const resetFilters = () => {
  selectedFilters.value = {
    jenisTemplat: "",
    namaTemplat: "",
    status: "",
  };
  activeFilters.value = {
    jenisTemplat: "",
    namaTemplat: "",
    status: "",
  };
  notify("Filter telah diset semula", "success", 2000);
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  formRecord.value = {
    jenisTemplat: "",
    namaTemplat: "",
    tajuk: "",
    status: "", // Default status
  };
  formDisplayData.value = {
    jenisTemplat: "",
    namaTemplat: "",
    tajuk: "",
    status: "",
  };
  originalFormData.value = {};
  formPopupVisible.value = true;
};

const openEditModal = (data) => {
  isEditMode.value = true;
  formRecord.value = {
    id: data.id,
    kodTemplat: data.kodTemplat,
    jenisTemplat: data.jenisTemplat,
    namaTemplat: data.namaTemplat,
    tajuk: data.tajuk || "",
    status: data.status,
  };
  formDisplayData.value = {
    jenisTemplat: data.jenisTemplat,
    namaTemplat: data.namaTemplat,
    tajuk: data.tajuk || "",
    status: data.status,
  };
  originalFormData.value = { ...formRecord.value };
  formPopupVisible.value = true;
};

const closeFormModal = () => {
  formPopupVisible.value = false;
  if (formRef.value?.instance) {
    formRef.value.instance.resetValues();
  }
  formRecord.value = {};
  originalFormData.value = {};
};

const resetForm = () => {
  if (isEditMode.value) {
    formRecord.value = { ...originalFormData.value };
    formDisplayData.value = {
      jenisTemplat: originalFormData.value.jenisTemplat,
      namaTemplat: originalFormData.value.namaTemplat,
      tajuk: originalFormData.value.tajuk || "",
      status: originalFormData.value.status,
    };
  } else {
    formRecord.value = {
      jenisTemplat: "",
      namaTemplat: "",
      tajuk: "",
      status: "Aktif",
    };
    formDisplayData.value = {
      jenisTemplat: "",
      namaTemplat: "",
      tajuk: "",
      status: "Aktif",
    };
  }

  notify("Borang telah diset semula", "info", 2000);
};

const saveTemplate = async () => {
  const formInstance = formRef.value?.instance;
  if (!formInstance) return;

  const validationResult = formInstance.validate();
  if (!validationResult.isValid) {
    notify("Sila lengkapkan semua field yang diperlukan dengan betul", "error", 3000);
    return;
  }

  try {
    if (isEditMode.value) {
      // Update existing template
      const index = templateData.value.findIndex((item) => item.id === formRecord.value.id);
      if (index > -1) {
        templateData.value[index] = { ...formRecord.value };
        notify(`Templat "${formRecord.value.namaTemplat}" berjaya dikemaskini`, "success", 3000);
      }
    } else {
      // Generate new kod templat if not provided
      if (!formRecord.value.kodTemplat) {
        const maxKod = Math.max(...templateData.value.map((t) => parseInt(t.kodTemplat) || 0));
        formRecord.value.kodTemplat = String(maxKod + 1).padStart(2, "0");
      }
      //generate new id
      if(!formRecord.value.id){
        const maxId = Math.max(...templateData.value.map((t) => parseInt(t.id) || 0));
        formRecord.value.id = String(maxId + 1);
      }
      // Add new template
      const newTemplate = {
        ...formRecord.value,
      };
      templateData.value.unshift(newTemplate);
      notify(`Templat "${formRecord.value.namaTemplat}" berjaya ditambah`, "success", 3000);
    }

    closeFormModal();
  } catch (error) {
    notify("Ralat berlaku semasa menyimpan data", "error", 3000);
  }
};

const openDeleteConfirm = (data) => {
  selectedToDelete.value = data;
  deletePopupVisible.value = true;
};

const closeDeleteConfirm = () => {
  deletePopupVisible.value = false;
  selectedToDelete.value = null;
};

const confirmDelete = () => {
  if (selectedToDelete.value) {
    const templateName = selectedToDelete.value.namaTemplat;
    templateData.value = templateData.value.filter((item) => item.id !== selectedToDelete.value.id);
    notify(`Templat "${templateName}" berjaya dipadam`, "success", 3000);
  }
  closeDeleteConfirm();
};
</script>

<style scoped>
/* Your existing styles remain unchanged */
.filter-label {
  margin-right: 8px;
  align-self: center;
}

:deep(.dx-datagrid-headers) {
  background-color: #2c5282 !important;
  color: white !important;
  font-weight: 600;
}

:deep(.dx-datagrid .dx-header-row > td) {
  background-color: #2c5282 !important;
  color: white !important;
  border-color: #2c5282 !important;
}

:deep(.dx-datagrid .dx-header-row .dx-datagrid-text-content) {
  color: white !important;
}

:deep(.dx-row-alt) {
  background-color: #f7fafc;
}

:deep(.dx-datagrid .dx-row > td) {
  border-color: #e2e8f0;
  padding: 8px 12px;
}

.filter-toolbar {
  height: 100px;
  padding: 15px 0;
  border-radius: 8px;
}

:deep(.dx-toolbar .dx-item) {
  margin-right: 10px;
}

.form-popup :deep(.dx-popup-content) {
  padding: 20px;
}

.template-form {
  padding: 20px;
}

.form-content {
  margin-bottom: 30px;
}

.form-content :deep(.dx-field-item) {
  margin-bottom: 20px;
}

.form-content :deep(.dx-field-label) {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.custom-datagrid {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.delete-confirm-content {
  text-align: center;
  padding: 20px;
}

.template-name {
  font-weight: bold;
  margin: 15px 0;
  color: #dc3545;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

:deep(.dx-invalid .dx-texteditor-input) {
  border-color: #dc3545 !important;
}

:deep(.dx-invalid .dx-dropdowneditor-button) {
  border-color: #dc3545 !important;
}

:deep(.dx-toast-success) {
  background-color: #28a745;
}

:deep(.dx-toast-error) {
  background-color: #dc3545;
}

:deep(.dx-toast-info) {
  background-color: #17a2b8;
}

:deep(.dx-button.dx-button-success) {
  background-color: #28a745;
  border-color: #28a745;
}

:deep(.dx-button.dx-button-danger) {
  background-color: #dc3545;
  border-color: #dc3545;
}

:deep(.dx-selectbox),
:deep(.dx-textbox) {
  border-radius: 4px;
}

:deep(.dx-selectbox .dx-texteditor-input),
:deep(.dx-textbox .dx-texteditor-input) {
  padding: 8px 12px;
}

:deep(.dx-popup-title) {
  background-color: #2c5282;
  color: white;
  font-weight: 600;
}

:deep(.dx-datagrid-search-panel) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

:deep(.dx-pager) {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

:deep(.dx-state-disabled .dx-texteditor-input) {
  background-color: #f8f9fa;
  color: #6c757d;
}

.add-button {
  background-color: #2c5282 !important;
  color: white !important;
  font-weight: 600;
  margin: 20px 0;
}
</style>