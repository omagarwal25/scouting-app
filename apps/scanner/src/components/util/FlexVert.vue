<template>
  <div class="flex flex-col gap-2" :class="css"><slot></slot></div>
</template>

<script lang="ts" setup>
const { css } = defineProps<{ css?: string }>();
</script>
