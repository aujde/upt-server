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

class MongoDB {
    constructor() {
        if (!MongoDB.instance) {
            MongoDB.instance = this;
        }
        return MongoDB.instance;
    }

    async getCollection(collectionName) {
        const client = await connectToMongo();
        return client.db().collection(collectionName);
    }

    async find(collectionName, query) {
        const collection = await this.getCollection(collectionName);
        return collection.find(query).toArray();
    }

    async insertOne(collectionName, document) {
        const collection = await this.getCollection(collectionName);
        return collection.insertOne(document);
    }

    async updateOne(collectionName, filter, update) {
        const collection = await this.getCollection(collectionName);
        return collection.updateOne(filter, update);
    }

    async deleteOne(collectionName, filter) {
        const collection = await this.getCollection(collectionName);
        return collection.deleteOne(filter);
    }
}

const instance = new MongoDB();
Object.freeze(instance);

module.exports = instance;