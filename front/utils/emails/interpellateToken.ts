import crypto from 'crypto';

export interface InterpellateTokenPayload {
  siren: string;
  firstname: string;
  lastname: string;
  email: string;
  emails: string;
  isCC: boolean;
  communityType: string;
  communityName: string;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.INTERPELLATE_SECRET;
  if (!secret) {
    throw new Error('INTERPELLATE_SECRET environment variable is not set');
  }
  return secret;
}

export function createInterpellateToken(
  data: Omit<InterpellateTokenPayload, 'exp'>,
  expiresInMinutes: number = 1440
): string {
  const payload: InterpellateTokenPayload = {
    ...data,
    exp: Date.now() + expiresInMinutes * 60 * 1000,
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecret()).update(encoded).digest('base64url');

  return `${encoded}.${signature}`;
}

export function verifyInterpellateToken(token: string): InterpellateTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [encoded, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', getSecret())
    .update(encoded)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload as InterpellateTokenPayload;
  } catch {
    return null;
  }
}
