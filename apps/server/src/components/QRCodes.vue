<template>
  <FlexVert v-for="team in transformed?.teams" class="items-center">
    <h1
      class="text-xl font-semibold"
      :class="team.color === 'red' ? 'text-red-700' : 'text-blue-700'"
    >
      Team {{ team.number }} ({{ team.scoutId }})
    </h1>
    <QrcodeVue
      :value="`${transformed?.number},${transformed?.type},${team.scoutId},${team.color},${team.number}`"
      :size="500"
    />
  </FlexVert>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useScheduleStore } from '~/stores/schedule';
import QrcodeVue from 'qrcode.vue';
import FlexVert from './util/FlexVert.vue';
import { Station } from '~/models/scheduledGame';

const schedule = useScheduleStore();

const transformed = computed(() => {
  const selected = schedule.selected;

  if (!selected) return;

  const teams: {
    number: number;
    color: 'red' | 'blue';
    scoutId: Station;
  }[] = [];

  selected.teams.forEach((e) => {
    const color =
      e.station === 'Blue1' || e.station === 'Blue2' || e.station === 'Blue3'
        ? 'blue'
        : 'red';

    teams.push({ number: e.teamNumber, color, scoutId: e.station });
  });

  return {
    teams,
    type:
      selected.tournamentLevel === 'Qualification' ? 'qualifier' : 'playoff',
    number: selected.matchNumber,
  };
});
</script>
