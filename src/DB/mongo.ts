import { MongoClient } from "mongodb";
const url = 'mongodb://localhost:27017';
const dbName = 'iot_test'
const collectionName = 'messages';

const client = new MongoClient(url);

export async function run() {
  try {
    const database = client.db('iot_test');
    const messages = database.collection('messages');
    const message = {
      title: "A testing message.",
      content: "haha"
    }
    const result = await messages.insertOne(message);
    console.log("Insert A row: " + result.insertedId);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
