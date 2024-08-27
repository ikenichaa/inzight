<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "updateStep", step: string): void;
}>();

const fileForm = ref();
const file = ref(null);

const fileRule = (value) => {
  if (value.length !== 0) return true;
  return "File is required.";
};

const validateFile = (currentStep, nextStep) => {
  fileForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
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
          <p>
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
            validate-on="input blur"
          >
          </v-file-input>
        </div>
      </v-row>
    </v-container>
  </v-form>
</template>
