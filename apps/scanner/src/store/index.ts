import { defineStore } from 'pinia';
import { client } from '~/api';
import { RouterInput, RouterOutput } from './../api/index';

type Record = RouterInput['record']['createRecord'];

export const useCurrentGameStore = defineStore('currentGameStore', {
  state: () => {
    return {
      currentMatch: undefined as
        | RouterOutput['match']['findAll'][number]
        | undefined,
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
    async setGame(id: number) {
      const matches = await this.matches;
      this.currentMatch = matches.find((m) => m.id === id);
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
    },

    async undo() {
      this.records.pop();
    },

    async addRecord(record: Record) {
      this.records.push(record);
    },

    async getNextGame() {
      const currentMatch = this.currentMatch;
      const matches = await this.matches;

      if (!currentMatch) return undefined;

      const currentType = currentMatch.type;
      const currentNumber = currentMatch.number;

      return matches
        .filter((match) => match.type === currentType)
        .find((match) => match.number === currentNumber + 1)?.id;
    },
  },
});
