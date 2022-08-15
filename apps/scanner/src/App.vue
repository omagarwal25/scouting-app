<template>
  <!-- <FlexVert class="items-center justify-center gap-5 p-2">
    <Scanner />
    <h1 class="border-t text-2xl font-bold">Generate Codes</h1>
    <Generator />
  </FlexVert> -->

  <div class="w-full">
    <div class="w-full p-4">
      <ScannerDash />
    </div>
  </div>
</template>

<script setup lang="ts">
import ScannerDash from './components/scanner/ScannerDash.vue';
</script>
