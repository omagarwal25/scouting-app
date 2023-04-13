import { TBAMatch } from '@griffins-scout/api';
import {
  GameRecord,
  ObjectiveRecord,
  PitRecord,
  SubjectiveRecord,
  convertObjectiveFieldsToArray,
  convertPitFieldsToArray,
  convertSubjectiveFieldsToArray,
  objectiveHeaders,
  pitHeaders,
  subjectiveHeaders,
} from '@griffins-scout/game';
import { defineStore } from 'pinia';
import { RouterInput, client } from '~/api';
import { downloadCSVData } from '~/components/util/csv';

export const useCurrentGameStore = defineStore('currentGameStore', {
  state: () => {
    return {
      currentMatch: undefined as TBAMatch | undefined,
      records: [] as GameRecord[],
    };
  },

  getters: {
    currentRecord(): GameRecord | undefined {
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

      downloadCSVData(
        this.records
          .filter((e) => e.type === 'subjective')
          .map((r) =>
            convertSubjectiveFieldsToArray(r.record as SubjectiveRecord)
          ),
        subjectiveHeaders(),
        `${Date.now().toLocaleString()}-subjective`
      );

      downloadCSVData(
        this.records
          .filter((e) => e.type === 'pit')
          .map((r) => convertPitFieldsToArray(r.record as PitRecord)),
        pitHeaders(),
        `${Date.now().toLocaleString()}-pit`
      );

      downloadCSVData(
        this.records
          .filter((e) => e.type === 'objective')
          .map((r) =>
            convertObjectiveFieldsToArray(
              r.record as unknown as ObjectiveRecord
            )
          ),
        objectiveHeaders(),
        `${Date.now().toLocaleString()}-objective`
      );

      try {
        client.record.createRecord.mutate(
          this.records as unknown as RouterInput['record']['createRecord']
        );
      } catch (e) {
        console.log(e);
      }
    },

    async undo() {
      this.records.pop();
    },

    async addRecord(record: GameRecord) {
      console.log(record);
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
