<template>
  <Button @click="click" color="bg-green-700">Go!</Button>
</template>

<script setup lang="ts">
import Button from './Button.vue';
const { click } = defineEmits<{ click: () => void }>();
</script>
