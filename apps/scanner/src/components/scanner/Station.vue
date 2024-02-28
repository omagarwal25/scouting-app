<template>
  <p
    :class="
      present &&
      'font-bold underline ' +
        (station.includes('Red') ? 'text-phoenix-red' : 'text-griffins-blue')
    "
  >
    {{ station }}
  </p>
</template>

<script lang="ts" setup>
import { ObjectiveInfo } from '@griffins-scout/game';

const props = defineProps<{
  station: ObjectiveInfo['scoutId'];
  present: boolean;
}>();
</script>
