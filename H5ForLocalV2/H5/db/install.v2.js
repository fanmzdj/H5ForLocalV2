import db from "./mydatabase.js";

export const initDb = () => {
  db.open().catch((err) => {
    console.error(err.stack || err);
  });
};
