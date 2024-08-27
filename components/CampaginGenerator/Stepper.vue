<script setup lang="ts">
import { ref, reactive } from "vue";

const step = ref("1");
const stepOneRef = ref(null);
const stepTwoRef = ref(null);
const isFileReady = ref(true);
const stepItem = reactive({
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
  },
});

const matchingStepName = {
  "1": "one",
  "2": "two",
  "3": "three",
};

const validateChild = () => {
  if (step.value === "1") {
    stepOneRef.value.validate("1", "2");
    return;
  }

  if (step.value === "2") {
    stepTwoRef.value.validateFile("2", "3");
    return;
  }
};

const updateStepAndStatus = (passStep: string, inputStep: string) => {
  step.value = inputStep;
  const stepName = matchingStepName[passStep];
  stepItem[stepName].complete = true;
};
</script>

<template>
  <v-stepper v-model="step" class="elevation-0" alt-labels>
    <template v-slot="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          :title="stepItem.one.title"
          :value="stepItem.one.value"
          :complete="stepItem.one.complete"
          :editable="stepItem.one.complete"
          :color="stepItem.one.complete ? 'green' : '#3969d6'"
        >
        </v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item
          :title="stepItem.two.title"
          :value="stepItem.two.value"
          :complete="stepItem.two.complete"
          :editable="stepItem.two.complete"
          :color="stepItem.two.complete ? 'green' : '#3969d6'"
        ></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item
          :title="stepItem.three.title"
          :value="stepItem.three.value"
          :complete="stepItem.three.complete"
          :editable="stepItem.three.complete"
          :color="stepItem.three.complete ? 'green' : '#3969d6'"
        ></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item key="1-content" value="1">
          <CampaginGeneratorStepOne
            ref="stepOneRef"
            @update-step="updateStepAndStatus"
          />
        </v-stepper-window-item>
        <v-stepper-window-item key="2-content" value="2">
          <CampaginGeneratorStepTwo
            ref="stepTwoRef"
            @update-step="updateStepAndStatus"
          />
        </v-stepper-window-item>
        <v-stepper-window-item key="3-content" value="3">
          Hello 3
        </v-stepper-window-item>
      </v-stepper-window>
      <v-stepper-actions
        @click:next="validateChild"
        @click:prev="prev"
      ></v-stepper-actions>
    </template>
  </v-stepper>
</template>
