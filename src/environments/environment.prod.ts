import { version } from '../../package.json';

export const environment = {
    // TODO: replace this with deployed vector API
    vectorApi: 'http://vector-api.us-east-1.elasticbeanstalk.com/api',
    production: true,
    version: version
};
