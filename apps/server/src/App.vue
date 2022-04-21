<template>
  <FlexVert class="items-center justify-center gap-5 p-2">
    <Scanner />
    <h1 class="border-t text-2xl font-bold">Generate Codes</h1>
    <Generator />
  </FlexVert>
</template>

<script setup lang="ts">
import Scanner from './components/scanner/Scanner.vue';
import Generator from './components/Generator.vue';
import FlexVert from './components/util/FlexVert.vue';
import FlexHorz from './components/util/FlexHorz.vue';
</script>
