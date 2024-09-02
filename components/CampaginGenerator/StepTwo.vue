<script setup lang="ts">
import { ref } from "vue";
import { type UploadParams } from "../../types/upload";
import { readFirstLineOfFile } from "../../utils/readFirstLine";

const emit = defineEmits<{
  (e: "updateStep", currentStep: string, nextStep: string): void;
}>();

const MANDATORY_COLUMNS = [
  "Current Stock",
  "Cost per unit",
  "Price per unit",
  "Product Name",
];

const props = defineProps({
  uploadParam: {
    type: Object as PropType<UploadParams>,
    required: true,
  },
});

const fileForm = ref();
const file = ref<File | null>(null);
const missingFields = ref<string[]>([]);
const checkMissingFields = async () => {
  if (!file.value) return;
  missingFields.value = [];
  try {
    const firstLine = await readFirstLineOfFile(file.value);
    const columnsNameInFile = firstLine.toLowerCase().split(",");
    missingFields.value = MANDATORY_COLUMNS.filter((m) => {
      const isInclude = columnsNameInFile.includes(m.toLowerCase());
      if (!isInclude) {
        return m;
      }
    });
  } catch (err) {
    throw new Error("Error reading file:", { cause: err });
  }
};

const fileRule = async (value: File[]) => {
  if (value.length === 0) {
    return "File is required.";
  }

  await checkMissingFields();
  if (missingFields.value.length > 0) {
    return `Missing some mandatory columns (${missingFields.value.join(", ")})`;
  }

  return true;
};

const uploadFile = async () => {
  if (file.value === null) return;

  try {
    const formData = new FormData();

    Object.entries(props.uploadParam.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("file", file.value);

    await $fetch(props.uploadParam.url, {
      method: "post",
      body: formData,
    });
  } catch (err) {
    throw err;
  }
};

const validateFile = (currentStep: string, nextStep: string) => {
  fileForm.value?.validate().then(({ valid: isValid }: { valid: boolean }) => {
    if (isValid) {
      try {
        uploadFile();
      } catch (err) {
        throw err;
      }
      emit("updateStep", currentStep, nextStep);
    }
  });
};

defineExpose({
  validateFile,
});
</script>

<template>
  <v-form ref="fileForm">
    <v-container>
      <v-row class="flex flex-column gap-y-4">
        <div>
          <h1>Please upload your store's data in csv format</h1>
          <p class="text-slate-400">
            The file should consist of these columns: Product Name, Current
            Stock, Cost per unit, Price per unit
          </p>
        </div>

        <div>
          <v-file-input
            v-model="file"
            label="File input"
            :rules="[fileRule]"
            accept=".csv"
            validate-on="input"
          >
          </v-file-input>
        </div>
      </v-row>
    </v-container>
  </v-form>
</template>
