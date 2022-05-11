<template>
  <FlexVert
    class="col-span-2 row-span-2 h-full w-full items-center justify-between gap-5"
  >
    <Button color="w-full h-full bg-phoenix-red font-whtie text-4xl">
      Undo
    </Button>
    <Button
      color="w-full h-full bg-griffins-blue font-whtie text-4xl"
      @click="onNextGame"
    >
      Next Game
    </Button>
  </FlexVert>
</template>

<script setup lang="ts">
import FlexVert from '~/components/util/FlexVert.vue';
import Button from '~/components/util/Button.vue';
import { useCurrentGameStore } from '~/store';

const currentGame = useCurrentGameStore();

const onNextGame = async () => {
  await currentGame.nextGame();
};
</script>
