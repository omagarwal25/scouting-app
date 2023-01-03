import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import {
  game,
  ObjectiveRecord,
  objectiveRecordDefault,
  PitRecord,
  pitRecordDefault,
  SubjectiveRecord,
  subjectiveRecordDefault,
} from './models';

export const recordTypeAtom = atomWithStorage<
  'subjective' | 'objective' | 'pit'
>(
  'recordType',
  'objective',
  createJSONStorage(() => AsyncStorage)
);

export const subjectiveRecordAtom = atomWithStorage<SubjectiveRecord>(
  'subjectiveRecord',
  { ...subjectiveRecordDefault },
  createJSONStorage(() => AsyncStorage)
);

export const subjectiveTeamOneAtom = focusAtom(subjectiveRecordAtom, (optic) =>
  optic.prop('teamOne')
);

export const subjectiveTeamTwoAtom = focusAtom(subjectiveRecordAtom, (optic) =>
  optic.prop('teamTwo')
);

export const subjectiveTeamThreeAtom =
  game.allianceSize === 3
    ? focusAtom(subjectiveRecordAtom, (optic) => optic.prop('teamThree'))
    : null;

export const subjectiveInfoAtom = focusAtom(subjectiveRecordAtom, (optic) =>
  optic.prop('info')
);

export const subjectiveOtherAtom = focusAtom(subjectiveRecordAtom, (optic) =>
  optic.prop('other')
);

const e: ObjectiveRecord = objectiveRecordDefault;

export const objectiveRecordAtom = atomWithStorage<ObjectiveRecord>(
  'objectiveRecord',
  { ...objectiveRecordDefault },
  createJSONStorage(() => AsyncStorage)
);

export const objectiveInfoAtom = focusAtom(objectiveRecordAtom, (optic) =>
  optic.prop('info')
);

export const objectiveAutoAtom = focusAtom(objectiveRecordAtom, (optic) =>
  optic.prop('auto')
);

export const objectiveTeleopAtom = focusAtom(objectiveRecordAtom, (optic) =>
  optic.prop('teleop')
);

export const objectiveEndgameAtom = focusAtom(objectiveRecordAtom, (optic) =>
  optic.prop('endgame')
);

export const objectivePostgameAtom = focusAtom(objectiveRecordAtom, (optic) =>
  optic.prop('postgame')
);

export const objectivePregameAtom = focusAtom(objectiveRecordAtom, (optic) =>
  optic.prop('pregame')
);

export const pitRecordAtom = atomWithStorage<PitRecord>(
  'pitRecord',
  { ...pitRecordDefault },
  createJSONStorage(() => AsyncStorage)
);

export const pitInfoAtom = focusAtom(pitRecordAtom, (optic) =>
  optic.prop('info')
);

export const pitDriveTrainAtom = focusAtom(pitRecordAtom, (optic) =>
  optic.prop('drive')
);

export const pitSpecificationsAtom = focusAtom(pitRecordAtom, (optic) =>
  optic.prop('specifications')
);

export const pitOtherAtom = focusAtom(pitRecordAtom, (optic) =>
  optic.prop('other')
);

export const pitAutoAtom = focusAtom(pitRecordAtom, (optic) =>
  optic.prop('auto')
);

export const pitTeleopAtom = focusAtom(pitRecordAtom, (optic) =>
  optic.prop('teleop')
);

export const pitEndgameAtom = focusAtom(pitRecordAtom, (optic) =>
  optic.prop('endgame')
);

export const resetAtoms = atom(null, async (get, set, _update) => {
  await set(objectiveRecordAtom, { ...objectiveRecordDefault });
  await set(subjectiveRecordAtom, { ...subjectiveRecordDefault });
  await set(pitRecordAtom, { ...pitRecordDefault });
});
