<template>
  <div
    class="col-span-2 grid h-full w-full grid-cols-2 grid-rows-2 items-center justify-between gap-5"
  >
    <Button
      v-if="!manualPicker"
      color="w-full h-full bg-griffins-blue text-white text-4xl"
      @click="onNext"
    >
      Next Game
    </Button>
    <div
      class="font-white h-full w-full rounded-3xl border-2 border-gray-400 bg-griffins-blue p-2 text-4xl text-white"
      v-else
    >
      <Suspense>
        <ManualPicker @close="onPickerClose" />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
    <Button color="w-full h-full bg-phoenix-red text-4xl" @click="onUndo">
      Undo
    </Button>
    <Button
      color="w-full h-full bg-griffins-blue text-4xl col-span-2"
      @click="onFetchTBA"
    >
      Fetch New TBA Data
    </Button>
  </div>
</template>

<script async setup lang="ts">
import { ref } from 'vue';
import Button from '~/components/util/Button.vue';
import { Suspense } from 'vue';
import { useCurrentGameStore } from '~/store';
import ManualPicker from './ManualPicker.vue';
import { client } from '~/api';

const manualPicker = ref(false);
const store = useCurrentGameStore();

const onUndo = () => {
  store.undo();
};

const onPickerClose = () => {
  manualPicker.value = false;
};

const onNext = async () => {
  await store.sendRecords();
  store.clearRecords();

  const next = await store.getNextGame();

  if (next) {
    store.setGame(next);
  } else {
    manualPicker.value = true;
  }

  // const allMatches = await store.matches;
  // store.setGame(allMatches[0].id);
};

const onFetchTBA = async () => {
  await client.mutation('match.importFromTBA');
};
</script>
