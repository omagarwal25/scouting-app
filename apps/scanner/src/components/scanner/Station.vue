<template>
  <p
    :class="
      exists &&
      'font-bold ' +
        (exists.includes('RED') ? 'text-phoenix-red' : 'text-griffins-blue')
    "
  >
    {{ stationToScoutId[station] }}
  </p>
</template>

<script lang="ts" setup>
import { scoutIdToStation, stationToScoutId } from '@griffins-scout/api';
import type { Station } from '@griffins-scout/api';
import { useCurrentGameStore } from '~/store';
import { computed } from '@vue/reactivity';

const props = defineProps<{ station: Station }>();
const store = useCurrentGameStore();

const exists = computed(() =>
  store.records
    .map((r) => scoutIdToStation[r.info.scoutId])
    .find((e) => e === props.station)
);
</script>
