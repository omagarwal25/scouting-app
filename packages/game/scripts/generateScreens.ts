import { CodeBlockWriter, Project, VariableDeclarationKind } from "ts-morph";
import { game } from "../src/game";
import { ScoutingElement } from "../src/types";
import { getSchema } from "./helpers";

// get all screens remove dupes
const screens = game.elements
  .map((i) => i.screens)
  .flat()
  .filter((i, index, self) => self.indexOf(i) === index);

const project = new Project();
const file = project.createSourceFile("src/screens.ts");
const defaultFile = project.createSourceFile("src/defaults.ts");

function lowerCaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

file.addImportDeclaration({
  moduleSpecifier: "zod",
  namedImports: ["z"],
});

defaultFile.addImportDeclaration({
  moduleSpecifier: "zod",
  namedImports: ["z"],
});

function writeSchema(screen: string, elements: ScoutingElement[]) {
  const objectMap: Record<string, { zod: string; default: string }> = {};

  elements.forEach((element) => {
    let defaultStr = "";

    if (element.field.fieldType === "Boolean") {
      defaultStr = "false";
    } else if (element.field.fieldType === "Text") {
      defaultStr = `""`;
    } else if (element.field.fieldType === "Numeric") {
      if (element.field.min !== undefined) {
        defaultStr = `${element.field.min}`;
      } else {
        defaultStr = "0";
      }
    } else if (element.field.fieldType === "Dropdown") {
      defaultStr = `"${element.field.options[0]}"`;
    } else if (element.field.fieldType === "Grouping") {
      defaultStr = `[]`;
    }

    objectMap[element.name] = {
      zod: getSchema(element.field),
      default: `.default(${defaultStr})`,
    };
  });

  // const schema = z.object(objectMap);

  // const jSchema = zodToJsonSchema(schema) as JSONSchema7;
  // const finalSchema = jsonSchemaToZod(
  //   jSchema,
  //   screen.toLowerCase() + "Schema",
  //   false
  // );

  file.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: lowerCaseFirstLetter(screen) + "Schema",
        initializer: (w: CodeBlockWriter) => {
          w.write("z.object(");
          w.block(() => {
            Object.keys(objectMap).forEach((key) => {
              w.write(`${key}: ${objectMap[key].zod},`);
            });
          });

          w.write(")");
        },
      },
      {
        name: lowerCaseFirstLetter(screen) + "Keys",
        initializer: (w: CodeBlockWriter) => {
          w.write("[");

          Object.keys(objectMap).forEach((key) => {
            w.write(`"${key}",`);
          });

          w.write("] as const");
        },
      },
    ],
  });

  defaultFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: lowerCaseFirstLetter(screen) + "Schema",
        initializer: (w: CodeBlockWriter) => {
          w.write("z.object(");
          w.block(() => {
            Object.keys(objectMap).forEach((key) => {
              w.write(
                `${key}: ${objectMap[key].zod}${objectMap[key].default},`
              );
            });
          });

          w.write(")");
        },
      },
    ],
  });

  file.addTypeAlias({
    name: capitalizeFirstLetter(screen),
    isExported: true,
    type: `z.infer<typeof ${lowerCaseFirstLetter(screen) + "Schema"}>`,
  });
}

// for every screen, get all the elements with that screen and then generate types and more zod schemas

screens.forEach((screen) => {
  const elements = game.elements.filter((i) =>
    i.screens.some((j: string) => j === screen)
  );

  writeSchema(screen, elements);
});

file.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "objectiveRecordSchema",
      initializer: `z.object({
        pregame: objectivePregameSchema,
        auto: objectiveAutoSchema,
        teleop: objectiveTeleopSchema,
        endgame: objectiveEndgameSchema,
        postgame: objectivePostgameSchema,
        info: objectiveInfoSchema,
        other: objectiveOtherSchema
      })`,
    },
  ],
});

file.addTypeAlias({
  name: "ObjectiveRecord",
  isExported: true,
  type: `z.infer<typeof objectiveRecordSchema>`,
});

file.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "subjectiveRecordSchema",
      initializer: `z.object({
        teamOne: subjectiveTeamSchema,
        teamTwo: subjectiveTeamSchema,
        ${game.allianceSize === 3 ? "teamThree: subjectiveTeamSchema" : ""},
        info: subjectiveInfoSchema,
        other: subjectiveOtherSchema
      })`,
    },
  ],
});

file.addTypeAlias({
  name: "SubjectiveRecord",
  isExported: true,
  type: `z.infer<typeof subjectiveRecordSchema>`,
});

file.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "pitRecordSchema",
      initializer: `z.object({
        auto: pitAutoSchema,
        teleop: pitTeleopSchema,
        endgame: pitEndgameSchema,
        other: pitOtherSchema,
        info: pitInfoSchema,
        specifications: pitSpecificationsSchema,
        drive: pitDriveSchema
      })`,
    },
  ],
});

file.addTypeAlias({
  name: "PitRecord",
  isExported: true,
  type: `z.infer<typeof pitRecordSchema>`,
});

file.saveSync();

// // Capitalize First Letter
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

defaultFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  declarations: [
    {
      name: "objectiveRecordSchema",
      initializer: (w: CodeBlockWriter) => {
        w.write("z.object(");
        w.block(() => {
          // grab all the screens
          screens
            .filter((s) => s.startsWith("Objective"))
            .forEach((screen) => {
              w.write(
                `${lowerCaseFirstLetter(screen.slice("objective".length))}: ${
                  lowerCaseFirstLetter(screen) + "Schema"
                }.default(${
                  lowerCaseFirstLetter(screen) + "Schema"
                }.parse({})),`
              );
            });
        });

        w.write(")");
      },
    },
  ],
});

defaultFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  declarations: [
    {
      name: "pitRecordSchema",
      initializer: (w: CodeBlockWriter) => {
        w.write("z.object(");
        w.block(() => {
          // grab all the screens
          screens
            .filter((s) => s.startsWith("Pit"))
            .forEach((screen) => {
              w.write(
                // remove the pit from the screen name
                `${lowerCaseFirstLetter(screen.slice("pit".length))}: ${
                  lowerCaseFirstLetter(screen) + "Schema"
                }.default(${
                  lowerCaseFirstLetter(screen) + "Schema"
                }.parse({})),`
              );
            });
        });

        w.write(")");
      },
    },
  ],
});

defaultFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  declarations: [
    {
      name: "subjectiveRecordSchema",
      initializer: (w: CodeBlockWriter) => {
        w.write("z.object(");
        w.block(() => {
          // grab all the screens
          w.write(
            "teamOne: subjectiveTeamSchema.default(subjectiveTeamSchema.parse({})),"
          );

          w.write(
            "teamTwo: subjectiveTeamSchema.default(subjectiveTeamSchema.parse({})),"
          );

          w.write(
            "teamThree: subjectiveTeamSchema.default(subjectiveTeamSchema.parse({})),"
          );

          w.write(
            "info: subjectiveInfoSchema.default(subjectiveInfoSchema.parse({})),"
          );

          w.write(
            "other: subjectiveOtherSchema.default(subjectiveOtherSchema.parse({}))"
          );
        });

        w.write(")");
      },
    },
  ],
});

defaultFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "objectiveRecordDefault",
      initializer: "objectiveRecordSchema.parse({})",
    },
  ],
});

defaultFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "subjectiveRecordDefault",
      initializer: "subjectiveRecordSchema.parse({})",
    },
  ],
});

defaultFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "pitRecordDefault",
      initializer: "pitRecordSchema.parse({})",
    },
  ],
});

defaultFile.save();

console.log("🥳 Generated screens.ts at ", file.getFilePath());
console.log("🥳 Generated defaults.ts at ", defaultFile.getFilePath());
