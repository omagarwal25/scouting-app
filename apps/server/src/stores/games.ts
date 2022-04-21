import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import sha256 from 'crypto-js/sha256';

interface Game {
  data: string;
  hash: string;
  // exported: boolean;
}

export const useGamesStore = defineStore('games', {
  state: () => ({
    games: useStorage<Game[]>('games', []),
  }),

  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    add(game: string) {
      this.games.push({ data: game, hash: sha256(game).toString() });
    },

    remove(game: string) {
      this.games = this.games.filter((e) => e.hash !== game);
    },

    reset() {
      this.games = [];
    },
  },

  getters: {
    export(): Blob {
      const data = this.games.reduce(
        (e, c) => (c.data == '' ? e : e + c.data + '\r\n'),
        'apron,human player low,human player high,auto intake floor,auto intake human,auto missed,auto scored high,auto scored low,preloaded balls,defense?,penalties?,tele intake floor,tele intake human,tele missed,tele scored high,tele scored low,climb height,climb success,match number,match type,scout id,team color,team number,rank,scout initials\r\n'
      );
      // this.games.forEach((e) => (e.exported = true));
      return new Blob([data]);
    },
  },
});
