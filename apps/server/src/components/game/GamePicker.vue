<template>
  <h1 class="border-b font-semibold">Select Game</h1>
  <VertFlex v-if="!schedule.selected" css="gap-5">
    <HorzFlex>
      <VertFlex>
        <label for="matchTypeSelector">Match Type</label>
        <select id="matchTypeSelector" class="rounded p-2" v-model="matchType">
          <option value="qual">Qualifier</option>
          <option value="playoff">Playoff</option>
        </select>
      </VertFlex>
      <GoBtn @click="onGo" />
    </HorzFlex>
    <HorzFlex>
      <select class="rounded p-2" v-model="selected">
        <option disabled value="">Nothing Selected</option>
        <option v-for="game in schedule.games" :key="game.matchNumber">
          {{ game.description }}
        </option>
      </select>
      <Button color="bg-green-700" @click="onSelect">Select</Button>
    </HorzFlex>
  </VertFlex>
  <HorzFlex v-else>
    <Button @click="onChange" color="bg-blue-700">
      Game: {{ schedule.selected?.description }} (Change)
    </Button>
  </HorzFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEventsStore } from '~/stores/events';
import { useScheduleStore } from '~/stores/schedule';
import GoBtn from '~/components/util/GoBtn.vue';
import Button from '~/components/util/Button.vue';
import HorzFlex from '~/components/util/FlexHorz.vue';
import VertFlex from '~/components/util/FlexVert.vue';

const matchType = ref<'qual' | 'playoff'>('qual');
const selected = ref<string>();

const schedule = useScheduleStore();
const event = useEventsStore();

const onGo = () => {
  if (!event.selected) {
    return;
  }

  schedule.fetch({ event: event.selected.code, type: matchType.value });
};

const onSelect = () => {
  schedule.selected =
    schedule.games.find((e) => e.description === selected.value) ?? null;
};

const onChange = () => {
  schedule.selected = null;
};
</script>
