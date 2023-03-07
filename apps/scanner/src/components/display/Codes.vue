<template>
  <span
    class="mb-2 flex w-full items-center justify-center text-4xl font-bold lowercase"
    >{{ subjectiveMatchType }} {{ props.match.match_number }} ({{
      props.match.set_number
    }})</span
  >
  <div class="grid grid-cols-3 gap-2">
    <ObjectiveCode
      v-for="(team, index) in [
        ...props.match.alliances.red.team_keys.map((team) => team.slice(3)),
        ...props.match.alliances.blue.team_keys.map((team) => team.slice(3)),
      ]"
      :color="
        index < props.match.alliances.blue.team_keys.length ? 'red' : 'blue'
      "
      :info="{
        scoutId: objectiveScoutIds[index],
        matchType: objectiveMatchType,
        teamNumber: parseInt(team),
        matchNumber: props.match.match_number,
      }"
    />
    <SubjectiveCode
      color="blue"
      :info="{
        scoutId: 'Blue S',
        matchType: subjectiveMatchType,
        teamOneNumber: parseInt(blueTeams[0]),
        teamTwoNumber: parseInt(blueTeams[1]),
        teamThreeNumber: parseInt(blueTeams[2]),
        matchNumber: props.match.match_number,
      }"
    />
    <SubjectiveCode
      color="red"
      :info="{
        scoutId: 'Red S',
        matchType: subjectiveMatchType,
        teamOneNumber: parseInt(redTeams[0]),
        teamTwoNumber: parseInt(redTeams[1]),
        teamThreeNumber: parseInt(redTeams[2]),
        matchNumber: props.match.match_number,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ObjectiveInfo, objectiveInfoSchema } from '@griffins-scout/game';
import { computed } from '@vue/reactivity';
import { RouterOutput } from '~/api';
import {
  matchTypeToObjectiveInfoMatchType,
  matchTypeToSubjectiveInfoMatchType,
} from '../util/converter';
import ObjectiveCode from './ObjectiveCode.vue';
import SubjectiveCode from './SubjectiveCode.vue';

const props = defineProps<{
  match: RouterOutput['match']['findAll'][number];
}>();

const objectiveMatchType = computed(() =>
  matchTypeToObjectiveInfoMatchType(props.match.comp_level)
);

const subjectiveMatchType = computed(() =>
  matchTypeToSubjectiveInfoMatchType(props.match.comp_level)
);

const objectiveScoutIds = computed(
  () =>
    [
      ...Object.keys(objectiveInfoSchema._def.shape().scoutId.Values),
    ] as ObjectiveInfo['scoutId'][]
);

// TODO: make this work for FTC
const blueTeams = computed(() =>
  props.match.alliances.blue.team_keys.map((team) => team.slice(3))
);
const redTeams = computed(() =>
  props.match.alliances.red.team_keys.map((team) => team.slice(3))
);
</script>
