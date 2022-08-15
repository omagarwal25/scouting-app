<template>
  <div
    class="col-span-2 grid h-full w-full grid-cols-2 grid-rows-2 items-center justify-between gap-5"
  >
    <Button
      color="w-full h-full bg-griffins-blue font-white text-4xl"
      @click="onNext"
    >
      Next Game
    </Button>
    <Button
      color="w-full h-full bg-phoenix-red font-white text-4xl"
      @click="onUndo"
    >
      Undo
    </Button>
    <Button
      color="w-full h-full bg-griffins-blue font-white text-4xl col-span-2"
    >
      Fetch New TBA Data
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/util/Button.vue';
import { useCurrentGameStore } from '~/store';

const store = useCurrentGameStore();

const onUndo = () => {
  store.undo();
};

const onNext = async () => {
  await store.clear();
};
</script>
