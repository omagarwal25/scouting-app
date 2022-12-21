import { JSONSchema7 } from "json-schema";
import jsonSchemaToZod from "json-schema-to-zod";
import { CodeBlockWriter, Project, VariableDeclarationKind } from "ts-morph";
import { SubjectiveElement } from "../src";
import { game } from "../src/game";
// get all screens remove dupes
const screens = game.objectiveElements
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

function writeSchema(screen: string, elements: SubjectiveElement[]) {
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
screens.forEach((screen) => {
  const elements = game.objectiveElements.filter((i) =>
    i.screens.includes(screen)
  );

  writeSchema(screen, elements);
});

writeSchema("subjective", game.subjectiveElements);
writeSchema("info", game.infoElements);
const teamNumber = game.infoElements.find((i) => i.name === "teamNumber")!!;
// subjective info will always have 3 team numbers, but we need to change the team number and the label
writeSchema("subjInfo", [
  ...game.infoElements.filter((i) => i.name !== "teamNumber"),
  {
    ...teamNumber,
    name: "teamOneNumber",
    label: "Team One Number",
  },
  {
    ...teamNumber,
    name: "teamTwoNumber",
    label: "Team Two Number",
  },
  {
    ...teamNumber,
    name: "teamThreeNumber",
    label: "Team Three Number",
  },
]);

file.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "gameSchema",
      initializer: `z.object({
        pregame: pregameSchema,
        auto: autoSchema,
        teleop: teleopSchema,
        endgame: endgameSchema,
        postgame: postgameSchema,
        info: infoSchema
      })`,
    },
  ],
});

file.addTypeAlias({
  name: "Game",
  isExported: true,
  type: `z.infer<typeof gameSchema>`,
});

file.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "allianceSubjectiveSchema",
      initializer: `z.object({
        teamOne: subjectiveSchema,
        teamTwo: subjectiveSchema,
        teamThree: subjectiveSchema,
        info: subjInfoSchema
      })`,
    },
  ],
});

file.addTypeAlias({
  name: "AllianceSubjective",
  isExported: true,
  type: `z.infer<typeof allianceSubjectiveSchema>`,
});

file.saveSync();

// Capitalize First Letter
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

defaultFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  declarations: [
    {
      name: "gameZod",
      initializer: (w: CodeBlockWriter) => {
        w.write("z.object(");
        w.block(() => {
          // grab all the screens
          screens.forEach((screen) => {
            w.write(
              `${screen.toLowerCase()}: ${
                screen.toLowerCase() + "Schema"
              }.default(${screen.toLocaleLowerCase() + "Schema"}.parse({})),`
            );
          });

          w.write("info: infoSchema.default(infoSchema.parse({}))");
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
      name: "allianceSubjectiveZod",
      initializer: (w: CodeBlockWriter) => {
        w.write("z.object(");
        w.block(() => {
          // grab all the screens
          w.write(
            "teamOne: subjectiveSchema.default(subjectiveSchema.parse({})),"
          );

          w.write(
            "teamTwo: subjectiveSchema.default(subjectiveSchema.parse({})),"
          );

          w.write(
            "teamThree: subjectiveSchema.default(subjectiveSchema.parse({})),"
          );

          w.write("info: subjInfoSchema.default(subjInfoSchema.parse({}))");
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
      name: "gameDefault",
      initializer: "gameZod.parse({})",
    },
  ],
});

defaultFile.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "allianceSubjectiveDefault",
      initializer: "allianceSubjectiveZod.parse({})",
    },
  ],
});

defaultFile.save();

console.log("🥳 Generated screens.ts at ", file.getFilePath());
console.log("🥳 Generated defaults.ts at ", defaultFile.getFilePath());
