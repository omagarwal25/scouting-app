import { JSONSchema7 } from "json-schema";
import jsonSchemaToZod from "json-schema-to-zod";
import { CodeBlockWriter, Project, VariableDeclarationKind } from "ts-morph";
import { game } from "../src/game";
import { ScoutingElement } from "../src/types";

// get all screens remove dupes
const objectiveScreens = game.objectiveElements
  .map((i) => i.screens)
  .flat()
  .filter((i, index, self) => self.indexOf(i) === index);

const subjectiveScreens = game.subjectiveElements
  .map((i) => i.screens)
  .flat()
  .filter((i, index, self) => self.indexOf(i) === index);

const pitScreens = game.pitElements
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
    const schema: JSONSchema7 = {};
    let defaultStr = "";

    if (element.field.fieldType === "Boolean") {
      schema.type = "boolean";
      defaultStr = "false";
    } else if (element.field.fieldType === "Text") {
      schema.type = "string";
      defaultStr = `""`;
    } else if (element.field.fieldType === "Numeric") {
      schema.type = "number";
      if (element.field.min !== undefined) {
        schema.minimum = element.field.min;
        defaultStr = `${element.field.min}`;
      } else {
        schema.default = 0;
        defaultStr = "0";
      }
      if (element.field.max !== undefined) {
        schema.maximum = element.field.max;
      }
      if (element.field.isInteger) {
        schema.multipleOf = 1;
      }
    } else if (element.field.fieldType === "Dropdown") {
      schema.type = "string";
      schema.enum = element.field.options;
      defaultStr = `"${element.field.options[0]}"`;
    }

    objectMap[element.name] = {
      zod: jsonSchemaToZod(schema, undefined, false)
        .split("=")[1]
        .replace(";", ""),
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
objectiveScreens.forEach((screen) => {
  const elements = game.objectiveElements.filter((i) =>
    i.screens.includes(screen)
  );

  writeSchema(screen, elements);
});

subjectiveScreens.forEach((screen) => {
  const elements = game.subjectiveElements.filter((i) =>
    i.screens.includes(screen)
  );

  writeSchema(screen, elements);
});

pitScreens.forEach((screen) => {
  const elements = game.pitElements.filter((i) => i.screens.includes(screen));

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
          objectiveScreens.forEach((screen) => {
            w.write(
              `${lowerCaseFirstLetter(screen.slice("objective".length))}: ${
                lowerCaseFirstLetter(screen) + "Schema"
              }.default(${lowerCaseFirstLetter(screen) + "Schema"}.parse({})),`
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
          pitScreens.forEach((screen) => {
            w.write(
              // remove the pit from the screen name
              `${lowerCaseFirstLetter(screen.slice("pit".length))}: ${
                lowerCaseFirstLetter(screen) + "Schema"
              }.default(${lowerCaseFirstLetter(screen) + "Schema"}.parse({})),`
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
