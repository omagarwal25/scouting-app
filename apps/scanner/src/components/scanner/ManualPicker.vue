<template>
  <div class="flex flex-col items-center gap-2">
    <select v-model="selected" class="rounded-md bg-gray-500 text-base">
      <option v-for="(match, index) in matches" :key="index" :value="match.id">
        {{ match.type }} {{ match.number }}
      </option>
    </select>
    <button @click="onSelect" class="rounded-md bg-gray-500 p-2 text-base">
      Select
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { client } from '~/api';
import { useCurrentGameStore } from '~/store';

const emit = defineEmits<{ (e: 'close'): void }>();

const selected = ref<number | null>(null);
const store = useCurrentGameStore();
const matches = (await client.query('match.findAll')).sort((a, b) =>
  // sort practice, then qual tthen playoff,
  // if same type, then sort by number
  a.type === b.type ? a.number - b.number : a.type > b.type ? 1 : -1
);

const onSelect = async () => {
  if (selected.value) {
    await store.setGame(selected.value);
    emit('close');
  }
};
</script>
