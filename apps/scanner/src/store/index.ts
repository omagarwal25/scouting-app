import { Game } from '@griffins-scout/game';
import { defineStore } from 'pinia';
import { Game as DBGame } from '@griffins-scout/api';
import { client } from '~/api';

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

    async games() {
      return client.query('game.findAll');
    },
  },

  actions: {
    async clear() {
      if (this.currentMatch !== undefined) {
        const game = await client.query(
          'game.findByKey',
          this.currentMatch.key
        );

        if (game !== null) {
          // iterate over all the records, fetch them from db and update
          for (const record of this.records) {
            const dbRecord = await client.query('record.findByGameKeyAndTeam', {
              gameKey: game.key,
              team: record.info.teamNumber,
            });

            if (dbRecord !== null) {
              dbRecord.data.push(JSON.stringify(record));

              await client.mutation('record.updateOne', {
                id: dbRecord.id,
                data: dbRecord.data,
              });
            } else {
              // TODO figure some way to handle this
            }
          }
        }

        // TODO deal with the off case
        // BUG THIS IS IMPORTANT BECAUSE OF PRACTICE MATCH SCOUTING.
        // IT WILL NOT EXIST IN TBA. ALSO WE NEED AN ESCAPE HATCH
      }

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
