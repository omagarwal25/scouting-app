<template>
  <div class="h-[500px] w-[500px]">
    <QrStream @decode="onDecode">
      <div style="color: red" class="frame"></div>
    </QrStream>
  </div>
  <Buttons :is-loading="isLoading" :result="result" :error="error" />
  <GameTable v-if="games.games.length !== 0" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import 'vue-loading-overlay/dist/vue-loading.css';
// @ts-ignore
import { QrStream } from 'vue3-qr-reader';
import { useGamesStore } from '~/stores/games';
import Buttons from '~/components/scanner/ScannerDash.vue';

const result = ref<string>();
const isLoading = ref(false);
const error = ref<string>();
</script>

<style scoped>
.frame {
  border-style: solid;
  border-width: 2px;
  border-color: red;
  height: 350px;
  width: 350px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  margin: auto;
}
</style>
