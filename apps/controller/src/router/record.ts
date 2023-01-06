import {
  ObjectiveInfo,
  objectiveRecordSchema,
  pitRecordSchema,
  SubjectiveInfo,
  subjectiveRecordSchema,
} from "@griffins-scout/game";
import { MatchType } from "@prisma/client";
import { z } from "zod";
import { DBSubjectiveRecord } from "../../types/index.js";
import { createRouter } from "../context.js";

// TODO if you mess with the match types you need to update this
const objectiveInfoMatchTypeToMatchType = (
  infoMatchType: ObjectiveInfo["matchType"]
): MatchType => {
  const map = new Map<ObjectiveInfo["matchType"], MatchType>([
    ["Final", "FINAL"],
    ["Qualification", "QUALIFICATION"],
    ["Practice", "PRACTICE"],
    ["Semifinal", "SEMIFINAL"],
    ["Quarterfinal", "QUARTERFINAL"],
  ]);

  return map.get(infoMatchType) ?? "PRACTICE";
};

const subjectiveInfoMatchTypeToMatchType = (
  infoMatchType: SubjectiveInfo["matchType"]
): MatchType => {
  const map = new Map<SubjectiveInfo["matchType"], MatchType>([
    ["Final", "FINAL"],
    ["Qualification", "QUALIFICATION"],
    ["Practice", "PRACTICE"],
    ["Semifinal", "SEMIFINAL"],
    ["Quarterfinal", "QUARTERFINAL"],
  ]);

  return map.get(infoMatchType) ?? "PRACTICE";
};

export const recordRouter = createRouter().mutation("createRecord", {
  input: z
    .object({
      type: z.literal("subjective"),
      record: subjectiveRecordSchema,
    })
    .or(
      z.object({
        type: z.literal("objective"),
        record: objectiveRecordSchema,
      })
    )
    .or(
      z.object({
        type: z.literal("pit"),
        record: pitRecordSchema,
      })
    ),
  async resolve({ input, ctx: { prisma } }) {
    if (input.type === "pit") {
      const teamNumber = input.record.info.teamNumber;

      return await prisma.pitRecord.create({
        data: {
          data: input.record,
          team: {
            connectOrCreate: {
              create: {
                number: teamNumber,
                name: "Unknown",
              },
              where: { number: teamNumber },
            },
          },
        },
      });
    }

    if (input.type === "objective") {
      const { info } = input.record;
      const matchType = objectiveInfoMatchTypeToMatchType(info.matchType);
      const matchNumber = info.matchNumber;

      const match = await prisma.match.findUnique({
        where: { number_type: { type: matchType, number: matchNumber } },
      });

      const teamNumber = info.teamNumber;
      const record = await prisma.objectiveRecord.create({
        data: {
          data: input.record,
          team: {
            connectOrCreate: {
              where: { number: teamNumber },
              create: { number: teamNumber, name: "Unknown" },
            },
          },
        },
      });

      if (match) {
        await prisma.match.update({
          where: { id: match?.id },
          data: {
            objectiveRecords: {
              connect: { id: record.id },
            },
          },
        });
      }

      return;
    }

    const { info } = input.record;

    const matchType = subjectiveInfoMatchTypeToMatchType(info.matchType);
    const {
      matchNumber,
      scoutId,
      teamOneNumber,
      teamTwoNumber,
      teamThreeNumber,
    } = info;

    const match = await prisma.match.findUnique({
      where: { number_type: { type: matchType, number: matchNumber } },
    });

    const teamOneRecord: DBSubjectiveRecord = {
      info: {
        matchNumber,
        matchType: info.matchType,
        scoutId,
        teamNumber: teamOneNumber,
      },
      other: input.record.other,
      team: input.record.teamOne,
    };

    const teamTwoRecord: DBSubjectiveRecord = {
      info: {
        matchNumber,
        matchType: info.matchType,
        scoutId,
        teamNumber: info.teamTwoNumber,
      },
      other: input.record.other,
      team: input.record.teamTwo,
    };

    // TODO remove for FTC
    const teamThreeRecord: DBSubjectiveRecord = {
      info: {
        matchNumber,
        matchType: info.matchType,
        scoutId,
        teamNumber: info.teamThreeNumber,
      },
      other: input.record.other,
      team: input.record.teamThree,
    };

    const one = await prisma.subjectiveRecord.create({
      data: {
        data: teamOneRecord,
        team: {
          connectOrCreate: {
            where: { number: teamOneNumber },
            create: { number: teamOneNumber, name: "Unknown" },
          },
        },
      },
    });

    const two = await prisma.subjectiveRecord.create({
      data: {
        data: teamTwoRecord,
        team: {
          connectOrCreate: {
            where: { number: teamTwoNumber },
            create: { number: teamTwoNumber, name: "Unknown" },
          },
        },
      },
    });

    // TODO remove for FTC
    const three = await prisma.subjectiveRecord.create({
      data: {
        data: teamThreeRecord,
        team: {
          connectOrCreate: {
            where: { number: teamThreeNumber },
            create: { number: teamThreeNumber, name: "Unknown" },
          },
        },
      },
    });

    if (match) {
      await prisma.match.update({
        where: { id: match.id },
        data: {
          subjectiveRecords: {
            connect: [
              { id: one.id },
              { id: two.id },
              // TODO remove for FTC
              { id: three.id },
            ],
          },
        },
      });
    }
  },
});
