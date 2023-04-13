<template>
  <div class="aspect-5/4 rounded-md border-2 border-gray-400">
    <!-- @ts-ignore -->
    <QrStream @decode="onDecode">
      <div
        style="color: red"
        class="absolute top-0 bottom-0 left-0 right-0 m-auto aspect-square h-4/5 border-2 border-phoenix-red"
      />
    </QrStream>
  </div>
</template>

<script lang="ts" setup>
import { decodeRecord } from '@griffins-scout/game';
// @ts-ignore
import { QrStream } from 'vue3-qr-reader';
import { useCurrentGameStore } from '~/store';

const store = useCurrentGameStore();

const onDecode = (decoded: string) => {
  store.addRecord(decodeRecord(decoded));
};
</script>
