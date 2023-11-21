import { TBAMatch } from '@griffins-scout/api';
import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage } from 'jotai/utils';
import {
  ObjectiveRecord,
  PitRecord,
  SubjectiveRecord,
  game,
  objectiveRecordDefault,
  pitRecordDefault,
  subjectiveRecordDefault,
  SubjectiveInfo,
  ObjectiveInfo,
} from './models';

type AppSettings =
  | {
    connection: 'offline';
  }
  | {
    connection: 'online';
    scoutId: SubjectiveInfo['scoutId'] | ObjectiveInfo['scoutId'] | null;
    match: TBAMatch | null;
  };

export const appSettingsAtom = atomWithStorage<AppSettings>('appSettings', {
  connection: 'offline',
});

export const onlineAtom = atom(
  (get) => get(appSettingsAtom).connection === 'online'
);

export const recordTypeAtom = atomWithStorage<
  'subjective' | 'objective' | 'pit'
>('recordTypeT', 'objective');

export const subjectiveRecordAtom = atomWithStorage<SubjectiveRecord>(
  'subjectiveRecord',
  { ...subjectiveRecordDefault }
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

export const objectiveRecordAtom = atomWithStorage<ObjectiveRecord>(
  'objectiveRecord',
  { ...objectiveRecordDefault }
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

export const objectiveOtherAtom = focusAtom(objectiveRecordAtom, (optic) =>
  optic.prop('other')
);

export const pitRecordAtom = atomWithStorage<PitRecord>('pitRecord', {
  ...pitRecordDefault,
});

export const pitInfoAtom = focusAtom(pitRecordAtom, (optic) =>
  optic.prop('info')
);

export const pitDriveAtom = focusAtom(pitRecordAtom, (optic) =>
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

export const resetAtom = atom(null, async (_get, set, _update) => {
  set(objectiveRecordAtom, { ...objectiveRecordDefault });
  set(subjectiveRecordAtom, { ...subjectiveRecordDefault });
  set(pitRecordAtom, { ...pitRecordDefault });

  set(recordTypeAtom, 'objective');
});
