<template>
  <v-form ref="myForm">
    <v-container>
      <v-dialog v-model="loading" max-width="400" persistent>
        <v-card
          max-width="400"
          prepend-icon="mdi-update"
          title="Checking API Key validity"
        >
          <div class="flex justify-center align-center pb-4">
            <v-progress-circular indeterminate color="primary">
            </v-progress-circular>
          </div>
        </v-card>
      </v-dialog>
      <v-row class="flex flex-column">
        <h1>Store name:</h1>
        <v-text-field
          v-model="storeName"
          variant="outlined"
          :rules="[nameRules]"
        ></v-text-field>
      </v-row>
      <v-row class="flex flex-column">
        <p>API Key:</p>
        <p class="text-slate-400">
          Please enter the API key you received from e-mail to try the feature
        </p>
        <v-text-field
          v-model="apiKey"
          variant="outlined"
          :rules="[keyRules]"
        ></v-text-field>
      </v-row>
      <v-row v-if="isError">
        <v-alert text="Invalid API Key" title="Alert" type="error"></v-alert>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type UploadParams } from "../../types/upload";

const emit = defineEmits<{
  (
    e: "presigned",
    res: UploadParams | null,
    currentStep: string,
    nextStep: string
  ): void;
}>();

const myForm = ref();
const storeName = ref("");
const apiKey = ref("");
const loading = ref(false);
const isError = ref(false);

const nameRules = (value: string) => {
  if (value) return true;
  return "Name is required.";
};
const keyRules = (value: string) => {
  if (value) return true;
  return "API Key is required.";
};

const presignedURL = async () => {
  isError.value = false;
  const {
    data: responseData,
    error: errorData,
    status,
  } = await useFetch<Omit<UploadParams, "storeName">>(
    "https://3ivwi0ph73.execute-api.us-west-2.amazonaws.com/demo-stage/presigned-url",
    {
      method: "post",
      body: {
        store_name: storeName.value,
      },
      headers: {
        "Content-type": "application/json",
        "x-api-key": apiKey.value,
      },
    }
  );

  if (status.value === "error") isError.value = true;
  if (errorData.value) {
    return null;
  } else {
    return {
      url: responseData.value!.url,
      fields: responseData.value!.fields,
      storeName: storeName.value,
    };
  }
};

const validateAndGetPresignedURL = async (
  currentStep: string,
  nextStep: string,
  shouldGetPresignedURL: boolean
) => {
  loading.value = true;
  myForm.value
    ?.validate()
    .then(async ({ valid: isValid }: { valid: boolean }) => {
      if (isValid) {
        if (shouldGetPresignedURL) {
          const res = await presignedURL();
          if (!!res) {
            emit("presigned", res, currentStep, nextStep);
          }
        } else {
          emit("presigned", null, currentStep, nextStep);
        }
      }

      loading.value = false;
    });
};

defineExpose({
  validateAndGetPresignedURL,
});
</script>
