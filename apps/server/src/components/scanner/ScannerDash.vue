<template>
  <FlexVert v-if="!isLoading" class="items-center gap-1">
    <h1 class="text-red-500" v-if="error">{{ error }}</h1>
    <CodeResult v-else-if="result" :value="result" label="Result" />
    <DownloadButton />
  </FlexVert>
  <Loading v-else v-model:active="isLoading" :can-cancel="false" is-full-page />
</template>

<script lang="ts" setup>
import DownloadButton from './DownloadButton.vue';
import Loading from 'vue-loading-overlay';
import CodeResult from '~/components/util/CodeResult.vue';
import FlexVert from '../util/FlexVert.vue';

const { result, isLoading, error } = defineProps<{
  result?: string;
  isLoading: boolean;
  error?: string;
}>();
</script>
