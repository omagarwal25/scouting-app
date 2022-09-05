<template>
  <p
    :class="
      exists &&
      'font-bold ' +
        ((exists as unknown as string).includes('Red') ? 'text-phoenix-red' : 'text-griffins-blue')
    "
  >
    {{ station }}
  </p>
</template>

<script lang="ts" setup>
import { useCurrentGameStore } from '~/store';
import { computed } from '@vue/reactivity';
import { Game } from '@griffins-scout/game';

const props = defineProps<{
  station: Game['info']['scoutId'];
}>();
const store = useCurrentGameStore();

const exists = computed(() =>
  store.records.map((r) => r.info.scoutId).find((e) => e === props.station)
);
</script>
