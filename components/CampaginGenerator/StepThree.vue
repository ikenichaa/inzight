<template>
  <div v-if="!isLoading" class="text-justify break-words leading-8">
    <vue-markdown v-if="isErrorParseJson" :source="generatedText" />

    <div v-else v-for="result in generatedObj">
      <div
        class="w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg mb-7"
      >
        <div class="text-lg font-semibold">{{ result.product }}</div>
        <div>
          <span class="font-semibold">Discount: </span>
          {{ result.discounted_percentage }}%
        </div>
        <div>
          <span class="font-semibold">Recommended Price: </span>
          {{ result.price_after_discounted }} baht
        </div>
        <div>
          <span class="font-semibold">Explanation: </span>
          {{ result.explanation }}
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center">
    <v-progress-circular indeterminate color="primary"> </v-progress-circular>
  </div>

  <!-- <button @click="sendMessage">Resend</button> -->
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueMarkdown from "vue-markdown-render";
const emit = defineEmits<{
  (e: "updateStep", currentStep: string, nextStep: string): void;
}>();

type resultObject = {
  product: string;
  discounted_percentage: string;
  price_after_discounted: string;
  explanation: string;
};

const generatedText = ref("");
const generatedObj = ref<resultObject[]>();
const isErrorParseJson = ref(false);
const isSocketOpen = ref(false);
const isLoading = computed(() => generatedText.value === "");
const websocket = ref<WebSocket | null>(null);

const props = defineProps({
  s3Path: String,
});

const onSocketOpen = () => {
  isSocketOpen.value = true;
  sendMessage();
};

const onSocketClose = (event: Event) => {
  isSocketOpen.value = false;
};

const sendMessage = () => {
  if (websocket.value) {
    const messageData = {
      action: "call-model",
      s3Path: props.s3Path,
    };

    const jsonString = JSON.stringify(messageData);
    websocket.value.send(jsonString);
  }
};

onMounted(() => {
  websocket.value = new WebSocket(
    "wss://ocx72c1py4.execute-api.us-west-2.amazonaws.com/demo"
  );

  websocket.value.onopen = onSocketOpen;
  websocket.value.onclose = onSocketClose;

  websocket.value?.addEventListener("message", (event) => {
    const data = event.data as string;
    generatedText.value = data.replace(/\\n/g, "\n").slice(2, -1);
    try {
      generatedObj.value = JSON.parse(generatedText.value.replace(/\\/g, ""));
    } catch (err) {
      isErrorParseJson.value = true;
    }
    emit("updateStep", "3", "3");
  });
});

onUnmounted(() => {
  websocket.value!.close();
});
</script>
