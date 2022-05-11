<template>
  <div class="grid w-full grid-cols-6 grid-rows-2 gap-4">
    <Scanner class="col-span-2 row-span-2" />
    <Buttons />
    <p class="col-span-2 row-span-1 font-code text-xl">ScoutId: uwu</p>
    <p class="col-span-1 row-span-1 font-code text-xl">ScoutId: uwu</p>
    <p class="col-span-1 row-span-1 text-right font-code text-xl">
      ScoutId: uwu
    </p>
  </div>
</template>

<script setup lang="ts">
import Scanner from './Scanner.vue';
import Buttons from './Buttons.vue';
</script>
