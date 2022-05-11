import { Game } from 'scouting-app-game';
import { defineStore } from 'pinia';
import { getNextGame } from '~/api';

export const useCurrentGameStore = defineStore<
  'currentGameStore',
  {
    hash: string;
    records: Game[];
  }
>('currentGameStore', {
  state: () => {
    return {
      hash: '',
      records: [],
    };
  },

  actions: {
    async nextGame() {
      this.hash = await getNextGame({ current: this.hash });
    },
  },
});
