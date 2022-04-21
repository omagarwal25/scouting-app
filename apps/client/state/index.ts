import { Game, gameDefault, gameSchema } from '../models/index';
import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initialValues: Game = {
  ...gameDefault,
  gameInfo: {
    scoutId: 'Red1',
    teamNumber: 0,
    matchNumber: 0,
    matchType: 'qualifier',
    teamColor: 'red',
  },
};

export const gameAtom = atomWithStorage<Game>(
  'game',
  initialValues,
  createJSONStorage(() => AsyncStorage)
);

export const previousGamesAtom = atomWithStorage<Array<Game>>(
  'games',
  [],
  createJSONStorage(() => AsyncStorage)
);
export const gameInfoAtom = focusAtom(gameAtom, (optic) =>
  optic.prop('gameInfo')
);
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
  await set(gameAtom, { ...initialValues });
});

// export const saveGameAtom = atom(null, async (get, set) => {
//   const previousGames = await get(previousGamesAtom);
//   const newPreviousGames = [...previousGames, { ...(await get(gameAtom)) }];

//   set(previousGamesAtom, { ...newPreviousGames });
// });
