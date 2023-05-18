import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import * as env from 'dotenv';

env.config();

const Translation = new Translate({
    credentials: {
        "type": "service_account",
        "project_id": process.env.GT_PROJECT_ID,
        "private_key_id": process.env.GT_PRIVATE_KEY_ID,
        "private_key": process.env.GT_PRIVATE_KEY,
        "client_email": process.env.GT_CLIENT_EMAIL,
        "client_id": process.env.GT_CLIENT_ID,
        "auth_uri": process.env.GT_AUTH_URI,
        "token_uri": process.env.GT_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.GT_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.GT_CLIENT_X509_CERT_URL
    },
    projectId: process.env.GT_PROJECT_ID
});

export { Translation };