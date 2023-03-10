const run = async function(){

const uri = 'CONN_STRING';
const keyVaultDatabase = 'encryption';
const keyVaultCollection = '__keyVault';
const keyVaultNamespace = `${keyVaultDatabase}.${keyVaultCollection}`;
MongoClient = require('mongodb').MongoClient;
ClientEncryption = require('mongodb-client-encryption').ClientEncryption;
const keyVaultClient = new MongoClient(uri);
keyVaultClient.connect();
const keyVaultDB = keyVaultClient.db(keyVaultDatabase);
const fs = require('fs');

// Drop the Key Vault Collection in case you created this collection
// in a previous run of this application.
keyVaultDB.dropDatabase();
// Drop the database storing your encrypted fields as all
// the DEKs encrypting those fields were deleted in the preceding line.

await keyVaultClient.connect();
// Drop the Key Vault Collection in case you created this collection
// in a previous run of this application.


await keyVaultDB.dropDatabase();
// Drop the database storing your encrypted fields as all
// the DEKs encrypting those fields were deleted in the preceding line.
await keyVaultClient.db("medicalRecords").dropDatabase();
const keyVaultColl = keyVaultDB.collection(keyVaultCollection);
await keyVaultColl.createIndex(
  { keyAltNames: 1 },
  {
    unique: true,
    partialFilterExpression: { keyAltNames: { $exists: true } },
  }
);


const provider = "local";
const path = "./master-key.txt";
const localMasterKey = fs.readFileSync(path);
const kmsProviders = {
  local: {
    key: localMasterKey,
  },
};


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
await client.connect();

const encryption = new ClientEncryption(client, {
  keyVaultNamespace,
  kmsProviders,
});
const key = await encryption.createDataKey(provider);
console.log("DataKeyId [base64]: ", key.toString("base64"));
await keyVaultClient.close();
await client.close();

}

run();