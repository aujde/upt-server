const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

class SecretManager {
    constructor() {
        this.client = new SecretManagerServiceClient();
        this.cache = new Map();
        this.cacheTTL = 3600000; // 1 hour in milliseconds
    }

    async getSecret(secretName) {
        const now = Date.now();

        if (this.cache.has(secretName)) {
            const { value, expiry } = this.cache.get(secretName);
            if (now < expiry) {
                return value;
            }
        }

        try {
            const [version] = await this.client.accessSecretVersion({
                name: `projects/${process.env.GOOGLE_SECRETID}/secrets/${secretName}/versions/latest`,
            });

            const payload = version.payload.data.toString('utf8');
            this.cache.set(secretName, { value: payload, expiry: now + this.cacheTTL });
            console.log(`Secret ${secretName} loaded into cache`);
            return payload;
        } catch (err) {
            throw new Error(`Failed to load secret ${secretName}`);
        }
    }
}

module.exports = SecretManager;