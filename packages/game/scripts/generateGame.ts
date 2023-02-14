import TOML from "@ltd/j-toml";
import fs from "fs";
import { CodeBlockWriter, Project, VariableDeclarationKind } from "ts-morph";
import { parse } from "yaml";
import { YearGame } from "../src/types";
import { getSchema } from "./helpers";

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

const info = getYearGame(getType());

const elements = info.elements.map((element) => {
  const zSchema = getSchema(element.field);

  if (element.field.fieldType === "Grouping") {
    element.field.fields.forEach((f) => {
      if (f.field.fieldType === "Grouping") {
        throw new Error(
          `❌ Grouping elements cannot be nested. Please remove ${f.name} from ${element.name}`
        );
      }
    });

    return {
      name: element.name,
      label: element.label,
      screens: element.screens,
      schema: zSchema,
      field: `{
        fieldType: "Grouping",
        fields: [${element.field.fields.map(
          (f) =>
            `{
              name: "${f.name}",
              label: "${f.label}",
              screens: ${JSON.stringify(f.screens)},
              field: ${JSON.stringify(f.field)},
              schema: ${getSchema(f.field)},
            }`
        )}]
      }`,
    };
  }

  return {
    name: element.name,
    label: element.label,
    screens: element.screens,
    schema: zSchema,
    field: JSON.stringify(element.field),
  };
});

const objectiveNames = elements
  .filter((e) => e.screens.some((s: string) => s.startsWith("Objective")))
  .map((e) => e.name);
const objectiveRequired = [
  "scoutName",
  "scoutId",
  "matchType",
  "matchNumber",
  "teamNumber",
];

objectiveRequired.forEach((name) => {
  if (!objectiveNames.includes(name)) {
    throw new Error(
      `❌ Scoring element ${name} is required in objectiveElements`
    );
  }
});

const subjectiveNames = elements
  .filter((e) => e.screens.some((s: string) => s.startsWith("Subjective")))
  .map((e) => e.name);
const subjectiveRequired = [
  "scoutName",
  "scoutId",
  "matchType",
  "matchNumber",
  "teamOneNumber",
  "teamTwoNumber",
];

if (info.allianceSize === 3) subjectiveRequired.push("teamThreeNumber");

subjectiveRequired.forEach((name) => {
  if (!subjectiveNames.includes(name)) {
    throw new Error(
      `❌ Scoring element ${name} is required in subjectiveElements`
    );
  }
});

const pitNames = elements
  .filter((e) => e.screens.some((s: string) => s.startsWith("Objective")))
  .map((e) => e.name);
const pitRequired = ["teamNumber", "scoutName"];

pitRequired.forEach((name) => {
  if (!pitNames.includes(name)) {
    throw new Error(`❌ Scoring element ${name} is required in pitElements`);
  }
});

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
          writer.writeLine(`allianceSize: ${info.allianceSize},`);

          writer.writeLine(`elements: [`);
          elements.forEach((element) => {
            writer.block(() => {
              writer.writeLine(`name: "${element.name}",`);
              writer.writeLine(`label: "${element.label}",`);
              writer.writeLine(`screens: ${JSON.stringify(element.screens)},`);
              writer.writeLine(`field:`);
              writer.writeLine(element.field + ",");
              writer.writeLine(`schema: ${element.schema}`);
            });

            writer.writeLine(",");
          });
          writer.writeLine("],");
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

console.log("🥳🎉 Generated game.ts at ", main.getFilePath());
