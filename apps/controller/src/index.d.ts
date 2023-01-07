import type {
  ObjectiveRecord as GameObjective,
  PitRecord as GamePit,
  SubjectiveRecord as GameSubjective,
} from "@griffins-scout/game";

declare global {
  namespace PrismaJson {
    type SubjectiveRecord = GameSubjective;
    type ObjectiveRecord = GameObjective;
    type PitRecord = GamePit;
  }
}
