<template>
  <div class="grid w-full grid-cols-6 grid-rows-3 gap-4">
    <Scanner class="col-span-4 row-span-3" />
    <p v-if="currentRecord?.type === 'objective'" class="col-span-2 row-span-1 font-code text-xl">
      <p>Objective</p>
      <p>Scout ID: {{ currentRecord.record.info.scoutId }}</p>
      <p>Scout Name: {{ currentRecord.record.other.scoutName }}</p>
      <p>Match Type: {{ currentRecord.record.info.matchType }}</p>
      <p>Match Number: {{ currentRecord.record.info.matchNumber }}</p>
      <p>Team Number: {{ currentRecord.record.info.teamNumber }}</p>
    </p>
    <p v-else-if="currentRecord?.type === 'subjective'" class="col-span-2 row-span-1 font-code text-xl">
      <p>Subjective</p>
      <p>Scout ID: {{ currentRecord.record.info.scoutId }}</p>
      <p>Scout Name: {{ currentRecord.record.other.scoutName }}</p>
      <p>Match Type: {{ currentRecord.record.info.matchType }}</p>
      <p>Match Number: {{ currentRecord.record.info.matchNumber }}</p>
      <!-- TODO if using FTC then remove the last set -->
      <p>Team Numbers: {{ currentRecord.record.info.teamOneNumber }} {{ currentRecord.record.info.teamTwoNumber }} {{ currentRecord.record.info.teamThreeNumber }}</p>
    </p>
    <p v-else class="col-span-2 row-span-1 font-code text-xl">
      <p>Pit</p>
      <p>Scout Name: {{ currentRecord?.record.other.scoutName }}</p>
      <p>Team Number: {{ currentRecord?.record.info.teamNumber }}</p>
    </p>
    <p class="col-span-1 row-span-1 font-code text-xl">
      <p class="font-bold">Current Match</p>
      <p >{{store.currentMatch?.comp_level === "qm" ? "qualification" : store.currentMatch?.comp_level}} {{store.currentMatch?.match_number}} ({{ store.currentMatch?.set_number }}) @ ~{{ new Date(store.currentMatch?.predicted_time ?? 0).toLocaleTimeString() }}</p>
    </p>
    <p class="col-span-1 row-span-1 text-right font-code text-xl">
      <Station v-for="station in objectiveInfoSchema._def.shape().scoutId.Values" :station="station"/>
      <Station v-for="station in subjectiveInfoSchema._def.shape().scoutId.Values" :station="station"/>
    </p>
    <Buttons />
  </div>
</template>

<script setup lang="ts">
import { objectiveInfoSchema, subjectiveInfoSchema } from '@griffins-scout/game';
import { computed } from '@vue/reactivity';
import { useCurrentGameStore } from '~/store';
import Buttons from './Buttons.vue';
import Scanner from './Scanner.vue';
import Station from './Station.vue';

const store = useCurrentGameStore();
const currentRecord = computed(() => store.currentRecord);
</script>
