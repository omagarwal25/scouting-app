import { model, Schema, SchemaDefinitionProperty } from "mongoose";
import { Game, gameDefault } from "@griffins-scout/game";

// we need to take the game schema and turn it into a schema
// that mongoose can understand

export const createRecordSchema = () => {
  const schema = new Schema<Game>({});
  // convert gameDefault to a map
  const recordDefaultMap = new Map(Object.entries(gameDefault));

  // iterate over the map.
  recordDefaultMap.forEach((value, key) => {
    // for each key, we need to create a schema field
    // and add it to the schema
    // make a map
    const schemaField: Map<string, SchemaDefinitionProperty<any>> = new Map();

    // make another default map for the nested object
    const nestedDefaultMap = new Map(Object.entries(value));

    // add them to the map
    nestedDefaultMap.forEach((nvalue, nkey) => {
      // convert the value to a schema

      schemaField.set(nkey, typeof nvalue);
    });

    // convert the map to an object
    const schemaFieldObject = Object.fromEntries(schemaField);
    schema.add({ [key]: schemaFieldObject });
  });

  console.log(schema);
  return schema;
};

export const RecordModel = model<Game>("record", createRecordSchema());
