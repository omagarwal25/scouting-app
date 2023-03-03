import { TBAMatch } from '@griffins-scout/api';

import { ObjectiveInfo, SubjectiveInfo } from '@griffins-scout/game';

export const matchTypeToObjectiveInfoMatchType = (
  matchType: TBAMatch['comp_level']
): ObjectiveInfo['matchType'] => {
  const map = new Map<TBAMatch['comp_level'], ObjectiveInfo['matchType']>([
    ['f', 'Elimination'],
    ['qm', 'Qualification'],
    ['sf', 'Elimination'],
    ['qf', 'Elimination'],
  ]);

  return map.get(matchType) ?? 'Practice';
};

export const matchTypeToSubjectiveInfoMatchType = (
  matchType: TBAMatch['comp_level']
): SubjectiveInfo['matchType'] => {
  const map = new Map<TBAMatch['comp_level'], SubjectiveInfo['matchType']>([
    ['f', 'Elimination'],
    ['qm', 'Qualification'],
    ['sf', 'Elimination'],
    ['qf', 'Elimination'],
  ]);

  return map.get(matchType) ?? 'Practice';
};
