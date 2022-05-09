const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./firebase-sdk.json');

function _createDatabaseHost() {
  initializeApp({
    credential: cert(serviceAccount),
  });
  return getFirestore();
}

const databaseHost = _createDatabaseHost();

module.exports = {
  databaseHost,
  async testConnection() {
    try {
      await databaseHost.listCollections();
      console.log('Connection successful!');
    } catch (error) {
      console.log(error);
      process.exit();
    }
  },
  async closeConnection() {
    try {
      await databaseHost.terminate();
    } catch (error) {
      console.log(error);
    }
  },
};
