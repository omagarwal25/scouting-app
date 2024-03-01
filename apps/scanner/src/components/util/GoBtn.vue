<template>
  <Button @click="emits('click')" color="bg-green-700">Go!</Button>
</template>

<script setup lang="ts">
import Button from './Button.vue';
const emits = defineEmits<{ (e: 'click'): void }>();
</script>
