import { Game } from '@griffins-scout/game';
import { defineStore } from 'pinia';
import { client } from '~/api';
import { Match } from '@griffins-scout/api';

export const useCurrentGameStore = defineStore('currentGameStore', {
  state: () => {
    return {
      currentMatch: undefined as Match | undefined,
      records: [] as Game[],
    };
  },

  getters: {
    currentRecord(): Game | undefined {
      return this.records.at(-1);
    },

    async matches() {
      return client.query('match.findAll');
    },
  },

  actions: {
    async clear() {
      // TODO all we have to do is just send off the matches

      // TODO deal with the off case
      // BUG THIS IS IMPORTANT BECAUSE OF PRACTICE MATCH SCOUTING.
      // IT WILL NOT EXIST IN TBA. ALSO WE NEED AN ESCAPE HATCH

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
