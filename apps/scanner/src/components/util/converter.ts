import { TBAMatch } from '@griffins-scout/api';

import { ObjectiveInfo } from '@griffins-scout/game';

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

