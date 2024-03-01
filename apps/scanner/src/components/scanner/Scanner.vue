<template>
  <div class="aspect-5/4 rounded-md border-2 border-gray-400">
    <QrStream @detect="onDecode">
      <div
        style="color: red"
        class="absolute bottom-0 left-0 right-0 top-0 m-auto aspect-square h-4/5 border-2 border-phoenix-red"
      />
    </QrStream>
  </div>
</template>

<script lang="ts" setup>
import { decodeRecord } from '@griffins-scout/game';
import { QrcodeStream as QrStream } from 'vue-qrcode-reader';
import { useCurrentGameStore } from '~/store';

const store = useCurrentGameStore();

const onDecode = (decoded: { rawValue: string }[]) => {
  store.addRecord(decodeRecord(decoded[0].rawValue));
  // console.log(decoded);
};
</script>
