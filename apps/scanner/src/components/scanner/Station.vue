<template>
  <p
    :class="
      exists &&
      'font-bold underline ' +
        (station.includes('Red') ? 'text-phoenix-red' : 'text-griffins-blue')
    "
  >
    {{ station }}
  </p>
</template>

<script lang="ts" setup>
import { ObjectiveInfo, ObjectiveRecord } from '@griffins-scout/game';
import { computed } from '@vue/reactivity';

const props = defineProps<{
  station: ObjectiveInfo['scoutId'];
  records: ObjectiveRecord[];
}>();

console.log(props.records);
console.log(props.station);

const exists = computed(() =>
  props.records.some((record) => record.info.scoutId === props.station)
);
</script>
