import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import {
  AllianceSubjective,
  allianceSubjectiveDefault,
  Game,
  gameDefault,
} from '~/models/index';

export const allianceSubjectiveAtom = atomWithStorage<AllianceSubjective>(
  'allianceSubjective',
  allianceSubjectiveDefault,
  createJSONStorage(() => AsyncStorage)
);

export const subjTeamOneAtom = focusAtom(allianceSubjectiveAtom, (optic) =>
  optic.prop('teamOne')
);
export const subjTeamTwoAtom = focusAtom(allianceSubjectiveAtom, (optic) =>
  optic.prop('teamTwo')
);
export const subjTeamThreeAtom = focusAtom(allianceSubjectiveAtom, (optic) =>
  optic.prop('teamThree')
);

export const subjInfoAtom = focusAtom(allianceSubjectiveAtom, (optic) =>
  optic.prop('info')
);

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

export const resetAtoms = atom(null, async (get, set, _update) => {
  await set(gameAtom, { ...gameDefault });
  await set(allianceSubjectiveAtom, { ...allianceSubjectiveDefault });
});

// export const saveGameAtom = atom(null, async (get, set) => {
//   const previousGames = await get(previousGamesAtom);
//   const newPreviousGames = [...previousGames, { ...(await get(gameAtom)) }];

//   set(previousGamesAtom, { ...newPreviousGames });
// });
