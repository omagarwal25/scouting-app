<template>
  <HorzFlex>
    <a
      text="Download"
      @click.prevent="onDownload"
      class="rounded bg-green-700 p-2 text-white"
    />
    <Button color="bg-red-500" @click="onReset">Reset</Button>
  </HorzFlex>
</template>

<script setup lang="ts">
import Button from '~/components/util/Button.vue';
import { useGamesStore } from '~/stores/games';
import HorzFlex from '~/components/util/FlexHorz.vue';

const games = useGamesStore();

const onDownload = () => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(games.export);
  link.download = `scouting-save-${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const onReset = () => {
  games.reset();
};
</script>
