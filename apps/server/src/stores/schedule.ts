import { ScheduledGame } from '~/models/scheduledGame';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { getSchedule } from '~/api';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    games: useStorage<ScheduledGame[]>('scheduledGames', []),
    selected: useStorage<ScheduledGame | null>('selectedScheduledGame', null),
  }),

  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    async fetch(params: { event: string; type: string }) {
      this.games = await getSchedule(params);
    },

    reset() {
      this.games = [];
    },
  },

  getters: {},
});
