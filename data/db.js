const low = require("lowdb");
const path = require('path');
const FileSync = require("lowdb/adapters/FileSync");
const contacts = require("./contactsGoldenspear");

console.log("setting up lowdb database...");
const adapter = new FileSync(path.resolve(`${__dirname}/database.json`));
const db = low(adapter);
// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [], contacts }).write();

module.exports = db;