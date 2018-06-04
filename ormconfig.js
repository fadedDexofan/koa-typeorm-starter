let config;

try {
  const path = process.cwd() + `/config/ormconfig.${process.env.NODE_ENV}.json`;
  console.log(path);
  config = require(path);
} catch (err) {
  const path = process.cwd() + "/config/ormconfig.json";
  console.log(path);
  config = require(path);
}

config.entities = [process.cwd() + "/dist/db/entities/**/*.js"];
config.migrations = [process.cwd() + "/dist/db/migrations/**/*.js"];
config.subscribers = [process.cwd() + "/dist/db/subscribers/**/*.js"];
config.cli = {
  entitiesDir: "/src/db/entities",
  migrationsDir: "/src/db/migrations",
  subscribersDir: "/src/db/subscribers",
};

module.exports = config;
