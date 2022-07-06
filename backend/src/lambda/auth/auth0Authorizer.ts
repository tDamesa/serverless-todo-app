import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-wh685a43.us.auth0.com/.well-known/jwks.json';

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJLWRPZgK0j7cqMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi13aDY4NWE0My51cy5hdXRoMC5jb20wHhcNMjIwNjI1MjE0NzU4WhcN
MzYwMzAzMjE0NzU4WjAkMSIwIAYDVQQDExlkZXYtd2g2ODVhNDMudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtMDLk5mDz5Qtjp++
B/7p92Smqs4iFIBl935pAFjkVHGdhcq/DZ45rAjpqdjrsv6L74eBC1F1cYd25kwU
E+NRQfNBy71jlzBJ+EykVYEvRfYmzvRo/veBTxFb43NBRW0kTK1alyqkI321WEnj
vzeF8bIT3cxCBiqZJFqHJ3q9oj7ErfAuL4VrZIusLGFwNN9PnfBVvqcRC/iLYMfy
f6DX0hwE7uZTrjakngtnh+RE/pIq6POb+zOxOgr8d0+KAaGu7OT1HO1PvDsn5a5s
3Q7YRmLk9c0inckTX0KrpBl0Ny38Ex8yUdPs3z2Q6zRWvQehSNCcFtYhqSKs23eh
s4HHYwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSEAclk7YX6
Es+1J/UhdAtCVP0hazAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AJGyzobEVEzOh7icPIbC0y39be8J8H9ypdpow6zsEKWWVkhRZphKbMwyOlKoDSnX
r3Q/m8DQeFttDniYMmiQ0Exn+qQISos2RCJy6C4n338nykxKu4gSHeNx9mXuQlAi
pixb8S2hWNeyPJS6rcr016VZaNg8JDkHBLD+50O8NIKw6fFPfi0k2xIwWs7IuRxe
FFrjn0dkiusIrClvuB7jDvw2V53z5L7gW5trl8aAiR9kOpjC7nOtZCAqirnvo6OL
tUemJMyZi3D8hUQxHT5SW9MAy2/lGxDGVB2UL1PZhAMJtMRaxtK6vWEvzfFAM5SR
cBoPfVKL0V25hC+9QtCz/PM=
-----END CERTIFICATE-----`;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken!);
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', e)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  console.log(token);
  console.log(jwksUrl);
  console.log(jwt);
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
