/**
 * Get an environment variable from .env
 * Throw an error in case of undefined
 * @param envPath Path of the variable (ex: BASE_URL)
 * @returns
 */
export function getEnvironmentVariable(envPath: string) {
  const envVariable = process.env[envPath];

  if (!envVariable) {
    throw new Error(envPath + ' is not defined in the environment variables.');
  }

  return envVariable;
}
