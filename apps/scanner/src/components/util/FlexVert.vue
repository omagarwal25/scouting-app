<template>
  <div class="flex flex-col gap-2" :class="props.css"><slot></slot></div>
</template>

<script lang="ts" setup>
const props = defineProps<{ css?: string }>();
</script>
