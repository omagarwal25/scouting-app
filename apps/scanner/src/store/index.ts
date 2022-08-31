import { Game } from '@griffins-scout/game';
import { defineStore } from 'pinia';
import { client, inferQueryOutput } from '~/api';
import { Match } from '@griffins-scout/api';

export const useCurrentGameStore = defineStore('currentGameStore', {
  state: () => {
    return {
      currentMatch: undefined as
        | inferQueryOutput<'match.findAll'>[0]
        | undefined,
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
        this.records.map((record) =>
          client.mutation('record.createRecord', record)
        )
      );
    },

    async undo() {
      this.records.pop();
    },

    async addRecord(record: Game) {
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
