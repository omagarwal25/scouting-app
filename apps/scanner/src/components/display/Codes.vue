<template>
  <span
    class="mb-2 flex w-full items-center justify-center text-4xl font-bold lowercase"
    >{{ match.type }} {{ match.number }}</span
  >
  <div class="grid grid-cols-3 gap-2">
    <Code
      v-for="(team, index) in [...match.redTeams, ...match.blueTeams]"
      :color="index < match.blueTeams.length ? 'red' : 'blue'"
      :info="{
        scoutId: scoutIds[index],
        matchType,
        teamNumber: team.number,
        matchNumber: match.number,
      }"
    />
  </div>
</template>

<script setup lang="ts">
// TODO maybe itll be difficult to show all codes at once
import { Info, infoSchema } from '@griffins-scout/game';
import { inferQueryOutput } from '~/api';
import Code from './Code.vue';

const { match } = defineProps<{
  match: inferQueryOutput<'match.findAll'>[0];
}>();

const matchType = (match.type.charAt(0).toUpperCase() +
  match.type.slice(1).toLowerCase()) as Info['matchType'];

const scoutIds = [
  ...Object.keys(infoSchema._def.shape().scoutId.Values),
] as Info['scoutId'][];
</script>
