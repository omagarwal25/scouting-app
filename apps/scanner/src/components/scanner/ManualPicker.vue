<template>
  <div class="flex flex-col gap-2 items-center">
    <select v-model="selected" class="text-base bg-gray-500 rounded-md">
      <option v-for="(match, index) in matches" :key="index" :value="match.key">
        {{ match.comp_level === 'qm' ? 'Qualification' : match.comp_level }}
        {{ match.match_number }} ({{ match.set_number }}) @ ~{{
          new Date(match.predicted_time).toLocaleTimeString()
        }}
      </option>
    </select>
    <button @click="onSelect" class="p-2 text-base bg-gray-500 rounded-md">
      Select
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { client } from '~/api';
import { useCurrentGameStore } from '~/store';

const emit = defineEmits<{ (e: 'close'): void }>();

const selected = ref<string | null>(null);
const store = useCurrentGameStore();
const matches = (await client.blueAlliance.findAll.query())
  .map((e) => e.content)
  .sort((a, b) =>
    // sort practice, then qual tthen playoff,
    // if same type, then sort by number
    a.comp_level === b.comp_level
      ? a.match_number - b.match_number
      : a.comp_level > b.comp_level
      ? 1
      : -1
  );

const onSelect = async () => {
  if (selected.value) {
    await store.setGame(selected.value);
    emit('close');
  }
};
</script>
