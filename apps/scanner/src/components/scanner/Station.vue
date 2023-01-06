<template>
  <p
    :class="
      exists &&
      'font-bold underline ' +
        ((exists as unknown as string).includes('Red') ? 'text-phoenix-red' : 'text-griffins-blue')
    "
  >
    {{ station }}
  </p>
</template>

<script lang="ts" setup>
import { ObjectiveInfo, SubjectiveInfo } from '@griffins-scout/game';
import { computed } from '@vue/reactivity';
import { useCurrentGameStore } from '~/store';

const props = defineProps<{
  station: ObjectiveInfo['scoutId'] | SubjectiveInfo['scoutId'];
}>();
const store = useCurrentGameStore();

const exists = computed(() =>
  store.records
    .map((r) => (r.type === 'pit' ? '' : r.record.info.scoutId))
    .find((e) => e === props.station)
);
</script>
