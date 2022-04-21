<template>
  <EventPicker />
  <GamePicker v-if="events.selected" />
  <QRCodes v-if="schedule.selected?.teams" />
</template>

<script setup lang="ts">
import { useEventsStore } from '~/stores/events';
import { useScheduleStore } from '~/stores/schedule';
import EventPicker from './event/EventPicker.vue';
import GamePicker from './game/GamePicker.vue';
import QRCodes from './QRCodes.vue';

const events = useEventsStore();
const schedule = useScheduleStore();
</script>
