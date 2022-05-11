<template>
  <!-- <FlexVert class="items-center justify-center gap-5 p-2">
    <Scanner />
    <h1 class="border-t text-2xl font-bold">Generate Codes</h1>
    <Generator />
  </FlexVert> -->

  <div class="grid grid-cols-3 grid-rows-2 gap-4 p-4">
    <Scanner />
    <FlexVert class="h-full gap-5">
      <Button color="bg-pheonix-red font-whtie text-2xl"> Confirm </Button>
      <Button color="bg-pheonix-red font-whtie text-2xl"> Confirm </Button>
      <Button color="bg-pheonix-red font-whtie text-2xl"> Confirm </Button>
    </FlexVert>
  </div>
</template>

<script setup lang="ts">
import Scanner from './components/scanner/Scanner.vue';

import FlexVert from './components/util/FlexVert.vue';
import FlexHorz from './components/util/FlexHorz.vue';
import Button from './components/util/Button.vue';
</script>
