<template>
  <span
    class="mb-2 flex w-full items-center justify-center text-4xl font-bold lowercase"
    >{{ subjectiveMatchType }} {{ props.match.number }}</span
  >
  <div class="grid grid-cols-3 gap-2">
    <ObjectiveCode
      v-for="(team, index) in [
        ...props.match.redTeams,
        ...props.match.blueTeams,
      ]"
      :color="index < props.match.blueTeams.length ? 'red' : 'blue'"
      :info="{
        scoutId: objectiveScoutIds[index],
        matchType: objectiveMatchType,
        teamNumber: team.number,
        matchNumber: props.match.number,
      }"
    />
    <SubjectiveCode
      color="blue"
      :info="{
        scoutId: 'Blue S',
        matchType: subjectiveMatchType,
        teamOneNumber: blueTeams[0],
        teamTwoNumber: blueTeams[1],
        teamThreeNumber: blueTeams[2],
        matchNumber: props.match.number,
      }"
    />
    <SubjectiveCode
      color="red"
      :info="{
        scoutId: 'Red S',
        matchType: subjectiveMatchType,
        teamOneNumber: redTeams[0],
        teamTwoNumber: redTeams[1],
        teamThreeNumber: redTeams[2],
        matchNumber: props.match.number,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ObjectiveInfo, objectiveInfoSchema } from '@griffins-scout/game';
import { computed } from '@vue/reactivity';
import { inferQueryOutput } from '~/api';
import {
  matchTypeToObjectiveInfoMatchType,
  matchTypeToSubjectiveInfoMatchType,
} from '../util/converter';
import ObjectiveCode from './ObjectiveCode.vue';
import SubjectiveCode from './SubjectiveCode.vue';

const props = defineProps<{
  match: inferQueryOutput<'match.findAll'>[0];
}>();

const objectiveMatchType = computed(() =>
  matchTypeToObjectiveInfoMatchType(props.match.type)
);

const subjectiveMatchType = computed(() =>
  matchTypeToSubjectiveInfoMatchType(props.match.type)
);

const objectiveScoutIds = computed(
  () =>
    [
      ...Object.keys(objectiveInfoSchema._def.shape().scoutId.Values),
    ] as ObjectiveInfo['scoutId'][]
);

// TODO: make this work for FTC
const blueTeams = computed(() =>
  props.match.blueTeams.map((team) => team.number)
);
const redTeams = computed(() =>
  props.match.redTeams.map((team) => team.number)
);
</script>
