<template>
  <h1 class="border-b font-semibold">Select Event</h1>
  <VertFlex v-if="!events.selected">
    <HorzFlex>
      <NumberInput
        id="teamNumberPicker"
        v-model="teamNumber"
        label="Team Number"
        placeholder="Team Number"
      />
      <NumberInput
        id="weekNumberPicker"
        v-model="week"
        label="Week Number"
        placeholder="Week Number"
      />
      <GoBtn @click="onGo" />
    </HorzFlex>
    <EventSelector />
  </VertFlex>

  <Button v-else @click="onChange" color="bg-blue-700">
    Event: {{ events.selected.name }} (Change)
  </Button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useEventsStore } from '~/stores/events';
import { useScheduleStore } from '~/stores/schedule';

import GoBtn from '~/components/util/GoBtn.vue';
import NumberInput from '~/components/util/NumberInput.vue';
import Button from '~/components/util/Button.vue';
import EventSelector from './EventSelector.vue';
import HorzFlex from '~/components/util/FlexHorz.vue';
import VertFlex from '~/components/util/FlexVert.vue';

const teamNumber = ref<number>();
const week = ref<number>();

const events = useEventsStore();
const scheduled = useScheduleStore();

const onGo = async () => {
  await events.fetch({ team: teamNumber.value, week: week.value });
};

const onChange = () => {
  events.selected = null;
  scheduled.selected = null;
};
</script>
