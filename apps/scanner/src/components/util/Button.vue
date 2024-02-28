<template>
  <button
    :class="props.color"
    @click="emits('click')"
    :disabled="props.disabled"
    class="rounded-3xl border-2 border-gray-400 p-2 text-white"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{ color?: string; disabled?: boolean }>();
const emits = defineEmits<{ click: [] }>();
</script>
