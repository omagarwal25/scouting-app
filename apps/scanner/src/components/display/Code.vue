<template>
  <div class="flex flex-col items-center justify-center text-2xl font-bold">
    {{ info.matchType }} {{ info.matchNumber }} - {{ info.teamNumber }}
    {{ info.scoutId }}
    <QrcodeVue :value="value" :size="300" level="H" :foreground="color" />
  </div>
</template>

<script setup lang="ts">
import { encode, Info, infoKeys } from '@griffins-scout/game';
// import type { Game } from '@griffins-scout/game';
import QrcodeVue from 'qrcode.vue';

const { color, info } = defineProps<{
  color?: string;
  info: Info;
}>();

const value = encode(info, infoKeys);
</script>
