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
      :height="550"
      :title="isEditMode ? 'Kemaskini Templat' : 'Tambah Templat Baru'"
      @hiding="closeFormModal"
      :resize-enabled="true"
      class="form-popup"
    >
      <DxScrollView width="100%" height="100%">
        <DxForm
          ref="formRef"
          :form-data="formRecord"
          :show-validation-summary="true"
          validation-group="templateForm"
          label-location="top"
          :col-count="1"
          class="template-form"
        >
          <div class="form-content">
            <DxSimpleItem data-field="kodTemplat" :is-required="true" editor-type="dxTextBox">
              <DxLabel text="Kod Templat" />
              <DxRequiredRule message="Kod Templat diperlukan" />
              <DxStringLengthRule :max="10" message="Kod Templat maksimum 10 aksara" />
              <DxAsyncRule
                message="Kod Templat sudah wujud"
                :validation-callback="validateUniqueKodTemplat"
              />
              <DxTextBox
                :max-length="10"
                placeholder="Masukkan kod templat"
                :disabled="isEditMode"
              />
            </DxSimpleItem>

            <DxSimpleItem data-field="jenisTemplat" :is-required="true" editor-type="dxSelectBox">
              <DxLabel text="Jenis Templat" />
              <DxRequiredRule message="Jenis Templat diperlukan" />
              <DxSelectBox
                :data-source="jenisTemplatOptionsForForm"
                display-expr="text"
                value-expr="value"
                placeholder="Pilih jenis templat"
                :search-enabled="false"
              />
            </DxSimpleItem>

            <DxSimpleItem data-field="namaTemplat" :is-required="true" editor-type="dxTextBox">
              <DxLabel text="Nama Templat" />
              <DxRequiredRule message="Nama Templat diperlukan" />
              <DxStringLengthRule
                :min="5"
                :max="100"
                message="Nama Templat mesti antara 5-100 aksara"
              />
              <DxTextBox :max-length="100" placeholder="Masukkan nama templat" />
            </DxSimpleItem>

            <DxSimpleItem data-field="tajuk" editor-type="dxTextBox">
              <DxLabel text="Tajuk" />
              <DxRequiredRule message="Status diperlukan" />
              <DxStringLengthRule :max="50" message="Tajuk maksimum 50 aksara" />
              <DxTextBox :max-length="50" placeholder="Masukkan tajuk (pilihan)" />
            </DxSimpleItem>

            <DxSimpleItem data-field="status" :is-required="true" editor-type="dxSelectBox">
              <DxLabel text="Status" />
              <DxRequiredRule message="Status diperlukan" />
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
        <div class="">
          <DxButton
            :text="isEditMode ? 'Kemaskini' : 'Simpan'"
            type="default"
            styling-mode="contained"
            @click="saveTemplate"
            :width="120"
          />

          <DxButton
            text="Set Semula"
            icon="redo"
            type="normal"
            styling-mode="contained"
            @click="resetForm"
            :width="120"
          />

          <DxButton
            text="Batal"
            type="normal"
            styling-mode="outlined"
            @click="cancelForm"
            :width="120"
          />
        </div>
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
  DxRequiredRule,
  DxStringLengthRule,
  DxAsyncRule,
} from "devextreme-vue/form";
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
const selectedToDelete = ref(null);
const nextId = ref(6);
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

// Validation function for unique kod templat
const validateUniqueKodTemplat = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingTemplate = templateData.value.find(
        (item) => item.kodTemplat === params.value && item.id !== formRecord.value.id
      );
      resolve(!existingTemplate);
    }, 100);
  });
};

// Modal functions
const openAddModal = () => {
  isEditMode.value = false;
  formRecord.value = {
    kodTemplat: "",
    jenisTemplat: "",
    namaTemplat: "",
    tajuk: "",
    status: "Aktif", // Default status
  };
  originalFormData.value = {};
  formPopupVisible.value = true;
};

const openEditModal = (data) => {
  isEditMode.value = true;
  // Create a deep copy of the data to avoid direct mutation
  formRecord.value = {
    id: data.id,
    kodTemplat: data.kodTemplat,
    jenisTemplat: data.jenisTemplat,
    namaTemplat: data.namaTemplat,
    tajuk: data.tajuk || "",
    status: data.status,
  };
  // Store original data for comparison
  originalFormData.value = { ...formRecord.value };
  formPopupVisible.value = true;
};

const closeFormModal = () => {
  formPopupVisible.value = false;
  if (formRef.value?.instance) {
    formRef.value.instance.resetValues();
  }
  // Reset form data
  formRecord.value = {};
  originalFormData.value = {};
};

const cancelForm = () => {
  closeFormModal();
  notify("Operasi dibatalkan", "info", 2000);
};

const resetForm = () => {
  if (isEditMode.value) {
    // Reset to original data in edit mode
    formRecord.value = { ...originalFormData.value };
  } else {
    // Reset to empty values in add mode
    formRecord.value = {
      kodTemplat: "",
      jenisTemplat: "",
      namaTemplat: "",
      tajuk: "",
      status: "Aktif",
    };
  }

  // Reset form validation
  if (formRef.value?.instance) {
    formRef.value.instance.resetValues();
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

      // Add new template
      const newTemplate = {
        ...formRecord.value,
        id: nextId.value++,
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
.filter-label {
  margin-right: 8px;
  align-self: center;
}
/* Header styling to match the blue theme */
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

/* Row styling */
:deep(.dx-row-alt) {
  background-color: #f7fafc;
}

:deep(.dx-datagrid .dx-row > td) {
  border-color: #e2e8f0;
  padding: 8px 12px;
}

/* Toolbar styling */
.filter-toolbar {
  height: 100px;
  margin-bottom: 20px;
  padding: 15px 0;
  /* background-color: #f8f9fa;
  border: 1px solid #dee2e6; */
  border-radius: 8px;

 
}

:deep(.dx-toolbar .dx-item) {
  margin-right: 10px;
}

/* Form styling */
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

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  color: black;
}

/* Custom DataGrid styling */
.custom-datagrid {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Delete confirmation styling */
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

/* Validation styling */
:deep(.dx-invalid .dx-texteditor-input) {
  border-color: #dc3545 !important;
}

:deep(.dx-invalid .dx-dropdowneditor-button) {
  border-color: #dc3545 !important;
}

:deep(.dx-validationsummary-item) {
  color: #dc3545;
  margin-bottom: 10px;
}

/* Notification styling */
:deep(.dx-toast-success) {
  background-color: #28a745;
}

:deep(.dx-toast-error) {
  background-color: #dc3545;
}

:deep(.dx-toast-info) {
  background-color: #17a2b8;
}

/* Button styling */
:deep(.dx-button.dx-button-success) {
  background-color: #28a745;
  border-color: #28a745;
}

:deep(.dx-button.dx-button-danger) {
  background-color: #dc3545;
  border-color: #dc3545;
}

/* Selectbox and textbox styling */
:deep(.dx-selectbox),
:deep(.dx-textbox) {
  border-radius: 4px;
}

:deep(.dx-selectbox .dx-texteditor-input),
:deep(.dx-textbox .dx-texteditor-input) {
  padding: 8px 12px;
}

/* Popup styling */
:deep(.dx-popup-title) {
  background-color: #2c5282;
  color: white;
  font-weight: 600;
}

/* Search panel styling */
:deep(.dx-datagrid-search-panel) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

/* Pager styling */
:deep(.dx-pager) {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

/* Disabled field styling */
:deep(.dx-state-disabled .dx-texteditor-input) {
  background-color: #f8f9fa;
  color: #6c757d;
}
.add-button{
  background-color: #2c5282 !important;
  color: white !important;
  font-weight: 600;
  margin: 20px 0;
}
</style>