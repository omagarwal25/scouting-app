import { MatchType } from '@griffins-scout/api';
import { ObjectiveInfo, SubjectiveInfo } from '@griffins-scout/game';

export const matchTypeToObjectiveInfoMatchType = (
  matchType: MatchType
): ObjectiveInfo['matchType'] => {
  const map = new Map<MatchType, ObjectiveInfo['matchType']>([
    ['FINAL', 'Final'],
    ['QUALIFICATION', 'Qualification'],
    ['PRACTICE', 'Practice'],
    ['SEMIFINAL', 'Semifinal'],
    ['QUARTERFINAL', 'Quarterfinal'],
  ]);

  return map.get(matchType) ?? 'Practice';
};

export const matchTypeToSubjectiveInfoMatchType = (
  matchType: MatchType
): SubjectiveInfo['matchType'] => {
  const map = new Map<MatchType, SubjectiveInfo['matchType']>([
    ['FINAL', 'Final'],
    ['QUALIFICATION', 'Qualification'],
    ['PRACTICE', 'Practice'],
    ['SEMIFINAL', 'Semifinal'],
    ['QUARTERFINAL', 'Quarterfinal'],
  ]);

  return map.get(matchType) ?? 'Practice';
};
