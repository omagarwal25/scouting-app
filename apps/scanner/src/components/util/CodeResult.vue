<template>
  <h1 class="flex gap-1">
    {{ label }}:
    <code class="">{{ value }}</code>
  </h1>
</template>

<script lang="ts" setup>
const { label, value } = defineProps<{ label: string; value: string }>();
</script>
