<template>
  <v-form ref="myForm">
    <v-container>
      <v-row class="flex flex-column">
        <h1>Store name:</h1>
        <v-text-field
          v-model="name"
          variant="outlined"
          :rules="[nameRules]"
        ></v-text-field>
      </v-row>
      <v-row class="flex flex-column">
        <p>API Key:</p>
        <p>
          Please enter the API key you received from e-mail to try the feature
        </p>
        <v-text-field
          v-model="apiKey"
          variant="outlined"
          :rules="[keyRules]"
        ></v-text-field>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "updateStep", step: string): void;
}>();

const myForm = ref();
const name = ref("a");
const apiKey = ref("b");

const nameRules = (value) => {
  if (value) return true;
  return "Name is required.";
};
const keyRules = (value) => {
  if (value) return true;
  return "API Key is required.";
};

const validate = (currentStep, nextStep) => {
  myForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      emit("updateStep", currentStep, nextStep);
    }
  });
};

defineExpose({
  validate,
});
</script>
