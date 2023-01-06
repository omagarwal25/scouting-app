<template>
  <div
    class="flex flex-col items-center justify-center text-2xl font-bold"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    {{ props.info.matchType }} {{ props.info.matchNumber }} -
    {{ props.info.teamOneNumber }}, {{ props.info.teamTwoNumber }},
    {{ props.info.teamThreeNumber }}
    {{ props.info.scoutId }}
    <span class="font-mono text-base text-gray-500">Hover To Show Code</span>
    <QrcodeVue
      :value="value"
      :size="300"
      level="H"
      :foreground="props.color === 'red' ? '#9B3A2A' : '#013D61'"
      v-if="show"
      class="transition-all"
    />

    <div
      v-else
      class="h-[300px] w-[300px] transition-all"
      :class="props.color === 'red' ? 'bg-phoenix-red' : 'bg-griffins-blue'"
    />
  </div>
</template>

<script setup lang="ts">
import { encodeSubjectiveInfo, SubjectiveInfo } from '@griffins-scout/game';
import { computed } from '@vue/reactivity';
import QrcodeVue from 'qrcode.vue';
import { ref } from 'vue';

const show = ref(false);

const onMouseEnter = () => {
  show.value = true;
};

const onMouseLeave = () => {
  show.value = false;
};

const props = defineProps<{
  color?: 'red' | 'blue';
  info: SubjectiveInfo;
}>();

const value = computed(() => encodeSubjectiveInfo(props.info));
</script>
