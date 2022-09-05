<template>
  <div
    class="flex flex-col items-center justify-center text-2xl font-bold"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    {{ info.matchType }} {{ info.matchNumber }} - {{ info.teamNumber }}
    {{ info.scoutId }}
    <span class="font-mono text-base text-gray-500">Hover To Show Code</span>
    <QrcodeVue
      :value="value"
      :size="300"
      level="H"
      :foreground="color === 'red' ? '#9B3A2A' : '#013D61'"
      v-if="show"
      class="transition-all"
    />

    <div
      v-else
      class="h-[300px] w-[300px] transition-all"
      :class="color === 'red' ? 'bg-phoenix-red' : 'bg-griffins-blue'"
    />
  </div>
</template>

<script setup lang="ts">
import { encode, Info, infoKeys } from '@griffins-scout/game';
// import type { Game } from '@griffins-scout/game';
import QrcodeVue from 'qrcode.vue';
import { ref } from 'vue';

const show = ref(false);

const onMouseEnter = () => {
  show.value = true;
};

const onMouseLeave = () => {
  show.value = false;
};

const { color, info } = defineProps<{
  color?: 'red' | 'blue';
  info: Info;
}>();

const value = encode(info, infoKeys);
</script>
