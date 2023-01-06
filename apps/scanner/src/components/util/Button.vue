<template>
  <button
    :class="props.color"
    @click="click"
    :disabled="props.disabled"
    class="rounded-3xl border-2 border-gray-400 p-2 text-white"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{ color?: string; disabled?: boolean }>();
const { click } = defineEmits<{ click: () => void }>();
</script>
