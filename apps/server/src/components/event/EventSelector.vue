<template>
  <HorzFlex>
    <select class="rounded p-2" v-model="selected">
      <option disabled value="">Nothing Selected</option>
      <option v-for="event in events.events" :key="event.code">
        {{ event.name }}
      </option>
    </select>
    <Button color="bg-green-700" @click="onSelect"> Select </Button>
  </HorzFlex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useEventsStore } from '~/stores/events';
import { useScheduleStore } from '~/stores/schedule';
import HorzFlex from '~/components/util/FlexHorz.vue';
import Button from '~/components/util/Button.vue';

const selected = ref<string>();

const events = useEventsStore();
const scheduled = useScheduleStore();

const onSelect = () => {
  events.selected =
    events.events.find((e) => e.name === selected.value) ?? null;
  scheduled.games = [];
};
</script>
