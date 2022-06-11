<template>
  <div class="grid w-full grid-cols-6 grid-rows-3 gap-4">
    <Scanner class="col-span-4 row-span-3" />
    <p class="col-span-2 row-span-1 font-code text-xl">
      <p>Scout ID: {{ store.currentRecord?.info.scoutId }}</p>
      <p>Scout Name: {{ store.currentRecord?.info.scoutName }}</p>
      <p>Match Type: {{ store.currentRecord?.info.matchType }}</p>
      <p>Match Number: {{ store.currentRecord?.info.matchNumber }}</p>
      <p>Team Number: {{ store.currentRecord?.info.teamNumber }}</p>
    </p>
    <p class="col-span-1 row-span-1 font-code text-xl">
      <p class="font-bold">Current Match</p>
      <p >{{store.currentMatch?.type.toLowerCase()}} {{store.currentMatch?.number}}</p>
    </p>
    <p class="col-span-1 row-span-1 text-right font-code text-xl">
      <Station v-for="station in ['RED_1', 'RED_2', 'RED_3', 'BLUE_1', 'BLUE_2', 'BLUE_3']" :station="(station as StationType)"/>
    </p>
    <Buttons />
  </div>
</template>

<script setup lang="ts">
import Scanner from './Scanner.vue';
import Buttons from './Buttons.vue';
import { useCurrentGameStore } from '~/store';
import Station from './Station.vue'
import type { Station as StationType } from '@griffins-scout/api';

const store = useCurrentGameStore();
</script>
