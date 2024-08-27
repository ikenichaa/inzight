<script setup>
import Logo from "./assets/image/cube.png";
</script>

<template>
  <header class="bg-white border-b">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
    >
      <div class="flex">
        <a href="#" class="-m-1.5 p-1.5">
          <img class="h-8 w-auto" :src="Logo" alt="" />
        </a>
        <span class="pt-1 pl-2 font-bold"> Inzight </span>
      </div>
    </nav>
  </header>
</template>
