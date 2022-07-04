import { Game } from '@griffins-scout/game';
import { defineStore } from 'pinia';
import { Game as DBGame } from '@griffins-scout/api';
import { client } from '~/api';
// import { getNextGame } from '~/api';

export const useCurrentGameStore = defineStore('currentGameStore', {
  state: () => {
    return {
      currentMatch: undefined as DBGame | undefined,
      records: [] as Game[],
    };
  },

  getters: {
    currentRecord(): Game | undefined {
      return this.records.at(-1);
    },

    async games(): Promise<DBGame[]> {
      return client.query('game.findAll');
    },
  },

  actions: {
    async nextGame() {
      if (this.currentMatch !== undefined) {
        const record = await client.query(
          'record.findById',
          this.currentMatch.id
        );

        if (record) {
          record.data.push(...this.records.map((e) => JSON.stringify(e)));

          await client.mutation('record.updateOne', {
            id: record.id,
            data: record.data,
          });
        }
        this.records = [];
      }
    },

    async undo() {
      this.records.pop();
    },

    async addRecord(record: Game) {
      this.records.push(record);
    },
  },
});
