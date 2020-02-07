import { version } from '../../package.json';

export const environment = {
    // TODO: replace this with deployed vector API
    vectorApi: 'https://tqsgs1yg76.execute-api.us-east-1.amazonaws.com/prod/api',
    production: true,
    version: version
};
