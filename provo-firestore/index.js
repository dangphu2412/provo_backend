const { DataRegistry } = require('./data-registry');
const { DataSyncExecutor } = require('./data-sync-executor');
const { testConnection, closeConnection, databaseHost } = require('./database');

async function runApp() {
  await testConnection();
  const registry = new DataRegistry();

  const syncExecutor = new DataSyncExecutor(registry);

  await syncExecutor.execute(databaseHost);

  await closeConnection();
}

runApp();
