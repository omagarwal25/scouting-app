<template>
  <button
    :class="color"
    @click="click"
    class="rounded-3xl border-2 border-gray-400 p-2 text-white"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const { color } = defineProps<{ color?: string }>();
const { click } = defineEmits<{ click: () => void }>();
</script>
