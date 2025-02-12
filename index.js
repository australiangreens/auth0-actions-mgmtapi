const auth0 = require("auth0");

/**
 * Creates and returns an Auth0 Management Client, handling token retrieval and caching.
 *
 * @param {object} secrets - The Auth0 secrets object (containing M2M credentials).
 * @param {object} cache - The Auth0 cache object.
 * @returns {Promise<auth0.ManagementClient>} A promise that resolves to the Management Client.
 * @throws {Error} If required secrets are missing or there's an error getting the token.
 */
async function createManagementClient(secrets, cache) {
  const { M2M_DOMAIN, M2M_CLIENT_ID, M2M_CLIENT_SECRET, audience } = secrets;

  if (!M2M_DOMAIN || !M2M_CLIENT_ID || !M2M_CLIENT_SECRET || !audience) {
    throw new Error("Missing required secrets for Management API.");
  }

  let managementToken = await getManagementToken(cache, secrets);

  return new auth0.ManagementClient({
    token: managementToken,
    domain: M2M_DOMAIN,
  });
}

/**
 * Retrieves or fetches a Management API token, using the cache.
 *
 * @param {object} cache - The Auth0 cache object.
 * @param {object} secrets - The Auth0 secrets object.
 * @returns {Promise<string>} A promise that resolves to the Management API token.
 * @throws {Error} If there's an error getting the token.
 */
async function getManagementToken(cache, secrets) {
  const { M2M_DOMAIN, M2M_CLIENT_ID, M2M_CLIENT_SECRET, audience } = secrets;

  const firstPart = cache.get('first')?.value || '';
  const secondPart = cache.get('second')?.value || '';
  const thirdPart = cache.get('third')?.value || '';

  if (firstPart && secondPart && thirdPart) {
    return firstPart + secondPart + thirdPart;
  }

  const authenticationClient = new auth0.AuthenticationClient({
    domain: M2M_DOMAIN,
    clientId: M2M_CLIENT_ID,
    clientSecret: M2M_CLIENT_SECRET,
  });

  const newToken = await authenticationClient.oauth.clientCredentialGrant({
    audience: audience 
  });

  cache.set('first', newToken.slice(0, 2048));
  cache.set('second', newToken.slice(2048, 4096));
  cache.set('third', newToken.slice(4096));

  return newToken;
}

module.exports = { createManagementClient }; // Export the function
