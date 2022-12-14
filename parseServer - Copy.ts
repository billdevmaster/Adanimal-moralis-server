// @ts-ignore
import ParseServer from 'parse-server';
import config from './config';
import MoralisEthAdapter from './auth/MoralisEthAdapter';
import Parse from 'parse';
import Web3 from 'web3';
const web3 =  new Web3()

export const parseServer = new ParseServer({
  databaseURI: config.DATABASE_URI,
  cloud: config.CLOUD_PATH,
  serverURL: config.SERVER_URL,
  publicServerURL: config.SERVER_URL,
  appId: config.APPLICATION_ID,
  masterKey: config.MASTER_KEY,
  auth: {
    moralisEth: {
      module: MoralisEthAdapter,
    },
  },
});

export async function parseUpdate(tableName: string, object: any) {
  // Check if object exists in db

  const query = new Parse.Query(tableName);
  query.equalTo('transaction_hash', object.transaction_hash);
  const result = await query.first({ useMasterKey: true });
  if (result) {
    // Loop through object's keys
    for (const key in object) {
      if (key) {
        result.set(key, object[key]);
      }
    }
    return result?.save(null, { useMasterKey: true });
  }
  // Create new object
  const newObject = new Parse.Object(tableName);
  for (const key in object) {
    if (key) {
      newObject.set(key, object[key]);
    }
  }
  return newObject.save(null, { useMasterKey: true });
}

export async function verifySignature (req: any, secret: any) {
  const ProvidedSignature = req.headers["x-signature"]
  if(!ProvidedSignature) {
    throw new Error("Signature not provided")
  }
  const GeneratedSignature= web3.utils.sha3(JSON.stringify(req.body)+secret)
  if(GeneratedSignature !== ProvidedSignature) {
    throw new Error("Invalid Signature")
  }

}

