<template>
  <v-app>
    <AppHeader />
    <div
      class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:max-w-4xl lg:px-12"
    >
      <CampaginGeneratorTitle />
      <CampaginGeneratorStepper />
    </div>
  </v-app>
</template>

<script setup>
import Logo from "./assets/image/cube.png";
useSeoMeta({
  title: "Inzight",
  ogTitle: "Inzight",
  description:
    "AI models to recommend marketing promotions, target audience, campaign content, image generation, branding, and story creation",
  ogDescription:
    "AI models to recommend marketing promotions, target audience, campaign content, image generation, branding, and story creation",
  ogImage: Logo,
});
</script>
