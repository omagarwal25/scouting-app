<template>
  <h1 class="flex gap-1">
    {{ props.label }}:
    <code class="">{{ props.value }}</code>
  </h1>
</template>

<script lang="ts" setup>
const props = defineProps<{ label: string; value: string }>();
</script>
