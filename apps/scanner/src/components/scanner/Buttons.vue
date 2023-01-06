<template>
  <div
    class="col-span-2 grid h-full w-full grid-cols-6 grid-rows-2 items-center justify-between gap-5"
  >
    <Button
      color="w-full h-full bg-griffins-blue text-white text-4xl disabled:bg-gray-600 col-span-3"
      @click="onNext"
      :disabled="manualPicker"
    >
      Next Game (Auto)
    </Button>
    <Button
      v-if="!manualPicker"
      color="w-full h-full bg-griffins-blue text-white text-4xl col-span-3"
      @click="onPickerOpen"
    >
      Next Game (Manual)
    </Button>
    <div
      class="font-white col-span-3 h-full w-full rounded-3xl border-2 border-gray-400 bg-griffins-blue p-2 text-4xl text-white"
      v-else
    >
      <Suspense>
        <ManualPicker @close="onPickerClose" />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
    <Button
      color="w-full h-full bg-griffins-blue text-white text-4xl col-span-2 disabled:bg-gray-600"
      @click="sendRecords"
      :disabled="store.records.length === 0 || manualPicker"
    >
      Send Records ({{ store.records.length }})
    </Button>

    <Button
      color="w-full h-full bg-phoenix-red text-4xl col-span-2"
      @click="onUndo"
    >
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

<script setup lang="ts">
import { ref, Suspense } from 'vue';
import { client } from '~/api';
import Button from '~/components/util/Button.vue';
import { useCurrentGameStore } from '~/store';
import ManualPicker from './ManualPicker.vue';

const manualPicker = ref(false);
const store = useCurrentGameStore();

const onUndo = () => {
  store.undo();
};

const onPickerClose = () => {
  manualPicker.value = false;
};

const sendRecords = async () => {
  await store.sendRecords();
  store.clearRecords();
};

const onPickerOpen = async () => {
  await sendRecords();

  manualPicker.value = true;
};

const onNext = async () => {
  await sendRecords();

  const next = await store.getNextGame();

  if (next) {
    store.setGame(next);
  } else {
    manualPicker.value = true;
  }
};

const onFetchTBA = async () => {
  await client.mutation('match.importFromTBA');
};
</script>
