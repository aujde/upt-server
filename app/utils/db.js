const { MongoClient, ServerApiVersion } = require('mongodb');

let client;

async function connectToMongo() {
    if (!client) {
        const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}`;
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
    }
    return client;
}

module.exports = { connectToMongo };