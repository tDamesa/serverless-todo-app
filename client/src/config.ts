// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '986exgmzhf'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`;
// export const apiEndpoint = 'http://localhost:7412/dev';

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-wh685a43.us.auth0.com',            // Auth0 domain
  clientId: 'G83oRC4TeqUN6MjyWWo9K2kIrJjHWbfE',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
