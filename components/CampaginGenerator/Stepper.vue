<script setup lang="ts">
import { ref, reactive } from "vue";
import { type UploadParams } from "../../types/upload";
import CampaginGeneratorStepOne from "./StepOne.vue";
import CampaginGeneratorStepTwo from "./StepTwo.vue";

const step = ref("1");
const stepOneRef = ref<typeof CampaginGeneratorStepOne | null>(null);
const stepTwoRef = ref<typeof CampaginGeneratorStepTwo | null>(null);
const stepThreeRef = ref(null);
const stepItem: {
  [key: string]: { title: string; value: string; complete: boolean };
} = reactive({
  one: {
    title: "Store Name & API Key",
    value: "1",
    complete: false,
  },
  two: {
    title: "Upload data",
    value: "2",
    complete: false,
  },
  three: {
    title: "Generate Result",
    value: "3",
    complete: false,
    editable: true,
  },
});

const matchingStepName: { [key: string]: string } = {
  "1": "one",
  "2": "two",
  "3": "three",
};

const uploadInfo = reactive<UploadParams>({
  url: "",
  fields: {},
  storeName: "",
});

const onClickNext = () => {
  if (step.value === "1") {
    const shouldGetPresignedURL = !uploadInfo.url;
    stepOneRef.value!.validateAndGetPresignedURL(
      "1",
      "2",
      shouldGetPresignedURL
    );
    return;
  }

  if (step.value === "2") {
    stepTwoRef.value!.validateFile("2", "3");
    return;
  }
};

const storePresignedURL = (
  res: UploadParams | null,
  currentStep: string,
  nextStep: string
) => {
  if (!!res) {
    uploadInfo.url = res.url;
    uploadInfo.fields = res.fields;
    uploadInfo.storeName = res.storeName;
  }

  updateStepAndStatus(currentStep, nextStep);
};

const updateStepAndStatus = (passStep: string, inputStep: string) => {
  step.value = inputStep;
  const stepName = matchingStepName[passStep];
  stepItem[stepName].complete = true;
};
</script>

<template>
  <v-stepper v-model="step" class="elevation-0" alt-labels>
    <template v-slot="{ prev }">
      <v-stepper-header>
        <div v-for="item in stepItem">
          <v-stepper-item
            :title="item.title"
            :value="item.value"
            :complete="item.complete"
            :editable="item.complete"
            :color="item.complete ? 'green' : '#3969d6'"
          >
          </v-stepper-item>
        </div>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item key="1-content" value="1">
          <CampaginGeneratorStepOne
            ref="stepOneRef"
            @presigned="storePresignedURL"
          />
        </v-stepper-window-item>
        <v-stepper-window-item key="2-content" value="2">
          <CampaginGeneratorStepTwo
            ref="stepTwoRef"
            @update-step="updateStepAndStatus"
            :upload-param="uploadInfo"
          />
        </v-stepper-window-item>
        <v-stepper-window-item key="3-content" value="3">
          <CampaginGeneratorStepThree
            ref="stepThreeRef"
            :s3-path="uploadInfo.fields['key']"
            @update-step="updateStepAndStatus"
          />
        </v-stepper-window-item>
      </v-stepper-window>
      <v-stepper-actions
        @click:next="onClickNext"
        @click:prev="prev"
      ></v-stepper-actions>
    </template>
  </v-stepper>
</template>
