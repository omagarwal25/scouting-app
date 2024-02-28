<template>
  <div class="grid grid-cols-6 grid-rows-3 gap-4 w-full">
    <Scanner class="col-span-4 row-span-3" />
    <p v-if="currentRecord?.type === 'objective'" class="col-span-2 row-span-1 text-xl font-code">
      <p>Objective</p>
      <p>Scout ID: {{ currentRecord.record.info.scoutId }}</p>
      <p>Scout Name: {{ currentRecord.record.other.scoutNameOne }} {{ currentRecord.record.other.scoutNameTwo }}</p>
      <p>Match Type: {{ currentRecord.record.info.matchType }}</p>
      <p>Match Number: {{ currentRecord.record.info.matchNumber }}</p>
      <p>Team Number: {{ currentRecord.record.info.teamNumber }}</p>
    </p>
    <p v-else class="col-span-2 row-span-1 text-xl font-code">
      <p>Pit</p>
      <p>Scout Name: {{ currentRecord?.record.other.scoutNameOne }} {{ currentRecord?.record.other.scoutNameTwo }}</p>
      <p>Team Number: {{ currentRecord?.record.info.teamNumber }}</p>
    </p>
    <p class="col-span-1 row-span-1 text-xl font-code">
      <p class="font-bold">Current Match</p>
      <p >{{store.currentMatch?.comp_level === "qm" ? "qualification" : store.currentMatch?.comp_level}} {{store.currentMatch?.match_number}} ({{ store.currentMatch?.set_number }}) @ ~{{ new Date(store.currentMatch?.predicted_time ?? 0).toLocaleTimeString() }}</p>
    </p>
    <p class="col-span-1 row-span-1 text-xl text-right font-code">
      <Station v-for="station in objectiveInfoSchema._def.shape().scoutId.Values" :station="station" :present="currentRecords.some(e => e.info.scoutId === station)"/>
    </p>
    <Buttons />
  </div>
</template>

<script setup lang="ts">
import { ObjectiveRecord, objectiveInfoSchema } from '@griffins-scout/game';
import { computed, ref } from 'vue';
import { client } from '~/api';
import { useCurrentGameStore } from '~/store';
import Buttons from './Buttons.vue';
import Scanner from './Scanner.vue';
import Station from './Station.vue';

const recordsFromCurrentMatch = (async () => {
  const store = useCurrentGameStore();

  const curr = store.currentMatch;

  if (!curr) {
    return [];
  }

  const type = curr.comp_level === 'qm' ? 'Qualification' : "Elimination"
  const number = type === 'Qualification' ? curr.match_number : curr?.set_number;

  return (await client.objective.findByMatch.query({
    matchType: type,
    matchNumber: number,
  })).map(r => r.content).concat(store.records.filter(r=> r.type === 'objective').map(r=> r.record as unknown as ObjectiveRecord).filter(r => r.info.matchType === type && r.info.matchNumber === number));
})

// reactive variable
const currentRecords = ref(await recordsFromCurrentMatch())

// every 30 seconds, update the currentRecord
setInterval(async () => {
  console.log("updating current records")
  currentRecords.value = await  recordsFromCurrentMatch()
}, 30 * 1000)

const store = useCurrentGameStore();

const currentRecord = computed(() => store.currentRecord);

</script>
