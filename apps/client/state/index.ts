import { Game, gameDefault } from '../models/index';
import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const gameAtom = atomWithStorage<Game>(
  'game',
  gameDefault,
  createJSONStorage(() => AsyncStorage)
);

export const previousGamesAtom = atomWithStorage<Array<Game>>(
  'games',
  [],
  createJSONStorage(() => AsyncStorage)
);
export const infoAtom = focusAtom(gameAtom, (optic) => optic.prop('info'));
export const postgameAtom = focusAtom(gameAtom, (optic) =>
  optic.prop('postgame')
);
export const pregameAtom = focusAtom(gameAtom, (optic) =>
  optic.prop('pregame')
);
export const endgameAtom = focusAtom(gameAtom, (optic) =>
  optic.prop('endgame')
);
export const teleopAtom = focusAtom(gameAtom, (optic) => optic.prop('teleop'));
export const autoAtom = focusAtom(gameAtom, (optic) => optic.prop('auto'));

export const resetGameAtom = atom(null, async (get, set, _update) => {
  await set(gameAtom, { ...gameDefault });
});

// export const saveGameAtom = atom(null, async (get, set) => {
//   const previousGames = await get(previousGamesAtom);
//   const newPreviousGames = [...previousGames, { ...(await get(gameAtom)) }];

//   set(previousGamesAtom, { ...newPreviousGames });
// });
