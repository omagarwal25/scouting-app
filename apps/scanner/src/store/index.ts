import { api } from '~/api';
import { Game } from '@griffins-scout/game';
import { defineStore } from 'pinia';
import { GameQuery } from '@griffins-scout/api';
// import { getNextGame } from '~/api';

export const useCurrentGameStore = defineStore('currentGameStore', {
  state: () => {
    return {
      currentMatch: { number: 1, type: 'QUALIFYING' } as GameQuery,
      records: [] as Game[],
    };
  },

  getters: {
    currentRecord(): Game | undefined {
      return this.records.at(-1);
    },
  },

  actions: {
    async nextGame() {
      const requests = this.records.map((record) => api.game.postData(record));
      await Promise.all(requests);

      this.records = [];
    },

    async undo() {
      this.records.pop();
    },

    async addRecord(record: Game) {
      this.records.push(record);
    },
  },
});
