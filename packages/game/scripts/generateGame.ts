import TOML from "@ltd/j-toml";
import fs from "fs";
import { CodeBlockWriter, Project, VariableDeclarationKind } from "ts-morph";
import { parse } from "yaml";
import { Field, YearGame } from "../src/types";

// check if game.yaml exists
function getType() {
  if (fs.existsSync("./game.yaml")) {
    return "yaml";
  } else if (fs.existsSync("./game.toml")) {
    return "toml";
  } else {
    return "json";
  }
}

function getYearGame(type: ReturnType<typeof getType>) {
  const file = fs.readFileSync(`./game.${type}`, "utf8");

  if (type === "yaml") {
    return parse(file) as YearGame;
  } else if (type === "toml") {
    return TOML.parse(file, { bigint: false }) as unknown as YearGame;
  } else {
    return JSON.parse(file) as YearGame;
  }
}

function getSchema(field: Field) {
  if (field.fieldType === "Boolean") {
    return "z.boolean()";
  } else if (field.fieldType === "Text") {
    return "z.string()";
  } else if (field.fieldType === "Numeric") {
    let schema = "z.number()";
    if (field.isInteger) {
      schema += ".int()";
    }
    if (field.min !== undefined) {
      schema += `.gte(${field.min})`;
    }
    if (field.max !== undefined) {
      schema += `.lte(${field.max})`;
    }
    return schema;
  } else if (field.fieldType === "Dropdown") {
    return `z.enum([${field.options.join(", ")}])`;
  } else {
    throw new Error(`❌ Unknown field type ${field.fieldType}`);
  }
}

const info = getYearGame(getType());

const objectiveElements = info.objectiveElements.map((element) => {
  const zSchema = getSchema(element.field);

  return {
    name: element.name,
    label: element.label,
    screens: element.screens,
    schema: zSchema,
    field: element.field,
  };
});

const subjectiveElements = info.subjectiveElements.map((element) => {
  const zSchema = getSchema(element.field);

  return {
    name: element.name,
    label: element.label,
    schema: zSchema,
    field: element.field,
  };
});

const infoElements = info.infoElements.map((element) => {
  const zSchema = getSchema(element.field);

  return {
    name: element.name,
    label: element.label,
    schema: zSchema,
    field: element.field,
  };
});

// the following scoring elements must exist. "scoutId" | "scoutName" | "matchType" | "matchNumber" | "teamNumber"
const infoNames = infoElements.map((objectiveElement) => objectiveElement.name);
const infoRequired = ["scoutId", "matchType", "matchNumber", "teamNumber"];

infoRequired.forEach((name) => {
  if (!infoNames.includes(name)) {
    throw new Error(`❌ Scoring element ${name} is required in infoElements`);
  }
});

const objectiveNames = objectiveElements.map(
  (objectiveElement) => objectiveElement.name
);
const objectiveRequired = ["scoutName"];

objectiveRequired.forEach((name) => {
  if (!objectiveNames.includes(name)) {
    throw new Error(
      `❌ Scoring element ${name} is required in objectiveElements`
    );
  }
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

          writer.writeLine(`objectiveElements: [`);
          objectiveElements.forEach((objectiveElement) => {
            writer.block(() => {
              writer.writeLine(`name: "${objectiveElement.name}",`);
              writer.writeLine(`label: "${objectiveElement.label}",`);
              writer.writeLine(
                `screens: ${JSON.stringify(objectiveElement.screens)},`
              );
              writer.writeLine(`field:`);
              writer.writeLine(JSON.stringify(objectiveElement.field) + ",");
              writer.writeLine(`schema: ${objectiveElement.schema}`);
            });

            writer.writeLine(",");
          });
          writer.writeLine("]");

          writer.writeLine(`subjectiveElements: [`);
          subjectiveElements.forEach((subjectiveElement) => {
            writer.block(() => {
              writer.writeLine(`name: "${subjectiveElement.name}",`);
              writer.writeLine(`label: "${subjectiveElement.label}",`);
              writer.writeLine(`field:`);
              writer.writeLine(JSON.stringify(subjectiveElement.field) + ",");
              writer.writeLine(`schema: ${subjectiveElement.schema}`);
            });

            writer.writeLine(",");
          });
          writer.writeLine("]");

          writer.writeLine(`infoElements: [`);
          infoElements.forEach((infoElement) => {
            writer.block(() => {
              writer.writeLine(`name: "${infoElement.name}",`);
              writer.writeLine(`label: "${infoElement.label}",`);
              writer.writeLine(`field:`);
              writer.writeLine(JSON.stringify(infoElement.field) + ",");
              writer.writeLine(`schema: ${infoElement.schema}`);
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

console.log("🥳 Generated game.ts at ", main.getFilePath());
