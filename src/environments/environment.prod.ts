import { version } from '../../package.json';

export const environment = {
    // TODO: replace this with deployed vector API
    vectorApi: 'http://127.0.0.1:5000/api',
    production: true,
    version: version
};
