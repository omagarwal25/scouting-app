import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { getEvents } from '~/api';
import { Event } from '~/models/event';

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: useStorage<Event[]>('events', []),
    selected: useStorage<Event | null>('selectedEvent', null),
  }),

  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    async fetch(params: { team?: number; week?: number }) {
      this.events = await getEvents(params);
    },

    reset() {
      this.events = [];
    },
  },

  getters: {},
});
