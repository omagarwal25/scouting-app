import { JSONSchema7 } from "json-schema";
import jsonSchemaToZod from "json-schema-to-zod";
import { CodeBlockWriter, Project, VariableDeclarationKind } from "ts-morph";
import { game } from "../src/game";
// get all screens remove dupes
const screens = game.objectiveElements
  .map((i) => i.screens)
  .flat()
  .filter((i, index, self) => self.indexOf(i) === index);

const project = new Project();
const file = project.createSourceFile("src/screens.ts");
const defaultFile = project.createSourceFile("src/defaults.ts");

file.addImportDeclaration({
  moduleSpecifier: "zod",
  namedImports: ["z"],
});

defaultFile.addImportDeclaration({
  moduleSpecifier: "zod",
  namedImports: ["z"],
});

// for every screen, get all the elements with that screen and then generate types and more zod schemas
screens.forEach((screen) => {
  const elements = game.objectiveElements.filter((i) =>
    i.screens.includes(screen)
  );

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
        name: screen.toLowerCase() + "Schema",
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
        name: screen.toLowerCase() + "Keys",
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
        name: screen.toLowerCase() + "Schema",
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
    type: `z.infer<typeof ${screen.toLowerCase() + "Schema"}>`,
  });
});

file.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "gameSchema",
      initializer: `z.object({
        info: infoSchema,
        pregame: pregameSchema,
        auto: autoSchema,
        teleop: teleopSchema,
        endgame: endgameSchema,
        postgame: postgameSchema,
      })`,
    },
  ],
});

file.addTypeAlias({
  name: "Game",
  isExported: true,
  type: `z.infer<typeof gameSchema>`,
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

defaultFile.save();

console.log("🥳 Generated screens.ts at ", file.getFilePath());
console.log("🥳 Generated defaults.ts at ", defaultFile.getFilePath());
