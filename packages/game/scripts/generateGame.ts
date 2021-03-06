import { parse } from "yaml";
import { YearGame, hashCode } from "../src/types";
import fs from "fs";
import jsonSchemaToZod from "json-schema-to-zod";
import { JSONSchema7 } from "json-schema";
import { CodeBlockWriter, Project, VariableDeclarationKind } from "ts-morph";

const file = fs.readFileSync("game.yaml", "utf8");

const info = parse(file) as YearGame;

const scoringElements = info.scoringElements.map((scoringElement) => {
  const hash = hashCode(scoringElement.name);
  const schema: JSONSchema7 = {};

  if (scoringElement.field.fieldType === "Boolean") {
    schema.type = "boolean";
  } else if (scoringElement.field.fieldType === "Text") {
    schema.type = "string";
  } else if (scoringElement.field.fieldType === "Numeric") {
    schema.type = "number";
    if (scoringElement.field.min !== undefined) {
      schema.minimum = scoringElement.field.min;
    } else {
      schema.default = 0;
    }
    if (scoringElement.field.max !== undefined) {
      schema.maximum = scoringElement.field.max;
    }
    if (scoringElement.field.isInteger) {
      schema.multipleOf = 1;
    }
  } else if (scoringElement.field.fieldType === "Dropdown") {
    schema.type = "string";
    schema.enum = scoringElement.field.options;
  }
  const zSchema = jsonSchemaToZod(schema, undefined, false)
    .split("=")[1]
    .replace(";", "");

  return {
    name: scoringElement.name,
    label: scoringElement.label,
    screens: scoringElement.screens,
    schema: zSchema,
    hash,
    field: scoringElement.field,
  };
});

function lowerCaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const project = new Project();

const main = project.createSourceFile("src/game.ts");

main.addVariableStatement({
  declarationKind: VariableDeclarationKind.Const,
  isExported: true,
  declarations: [
    {
      name: "game",
      initializer: (writer: CodeBlockWriter) => {
        writer.block(() => {
          writer.writeLine(`name: "${info.name}",`);
          writer.writeLine(`description: "${info.description}",`);
          writer.writeLine(`year: ${info.year},`);
          writer.writeLine(`scoringElements: [`);
          scoringElements.forEach((scoringElement) => {
            writer.block(() => {
              writer.writeLine(`hash: ${scoringElement.hash},`);
              writer.writeLine(`name: "${scoringElement.name}",`);
              writer.writeLine(`label: "${scoringElement.label}",`);
              writer.writeLine(
                `screens: ${JSON.stringify(scoringElement.screens)},`
              );
              writer.writeLine(`field:`);
              writer.writeLine(JSON.stringify(scoringElement.field) + ",");
              writer.writeLine(`schema: ${scoringElement.schema}`);
            });

            writer.writeLine(",");
          });

          writer.writeLine("]");
        });
      },
      type: "YearGame",
    },
  ],
});

main.addImportDeclarations([
  { moduleSpecifier: "zod", namedImports: ["z"] },
  { moduleSpecifier: ".", namedImports: ["YearGame"] },
]);
main.saveSync();

console.log("???? Generated game.ts at ", main.getFilePath());
