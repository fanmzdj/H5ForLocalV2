import Dexie from "Dexie";
import { strokeHistoryStr } from "./modal/strokeHistory.js";

export const dbName = "icebearStickFigure.db";
export const dbVersion = 1.0;
const db = new Dexie(dbName);
db.version(dbVersion).stores({
  strokeHistoryTable: strokeHistoryStr,
});

export default db;
