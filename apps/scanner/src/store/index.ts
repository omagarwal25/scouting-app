import { TBAMatch } from '@griffins-scout/api';
import { defineStore } from 'pinia';
import { client } from '~/api';
import { RouterInput } from './../api/index';

type Record = RouterInput['record']['createRecord'];

export const useCurrentGameStore = defineStore('currentGameStore', {
  state: () => {
    return {
      currentMatch: undefined as TBAMatch | undefined,
      records: [] as Record[],
    };
  },

  getters: {
    currentRecord(): Record | undefined {
      return this.records.at(-1);
    },

    async matches() {
      return client.match.findAll.query();
    },
  },

  actions: {
    async setGame(key: string) {
      const matches = await this.matches;
      this.currentMatch = matches.find((m) => m.key === key);
    },

    clearRecords() {
      this.records = [];
    },

    async sendRecords() {
      // TODO all we have to do is just send off the matches

      // TODO deal with the off case
      // BUG THIS IS IMPORTANT BECAUSE OF PRACTICE MATCH SCOUTING.
      // IT WILL NOT EXIST IN TBA. ALSO WE NEED AN ESCAPE HATCH
      // all goods
      // tbh, i dont think it matters what game its associated

      await Promise.all(
        this.records.map((record) => client.record.createRecord.mutate(record))
      );

      client.match.importFromTba.mutate();
    },

    async undo() {
      this.records.pop();
    },

    async addRecord(record: Record) {
      this.records.push(record);
    },

    async getNextGame(): Promise<string | undefined> {
      const currentMatch = this.currentMatch;
      const matches = await this.matches;

      if (!currentMatch) return undefined;

      const currentType = currentMatch.comp_level;
      const currentNumber = currentMatch.match_number;

      return matches
        .filter((match) => match.comp_level === currentType)
        .find((match) => match.match_number === currentNumber + 1)?.key;
    },
  },
});
