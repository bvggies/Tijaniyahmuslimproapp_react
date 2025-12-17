import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export interface AuthUser {
  userId: string;
  email: string;
}

export function verifyAuthHeader(authorization?: string | null): AuthUser {
  if (!authorization?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authorization.slice('Bearer '.length);
  const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };

  return { userId: payload.sub, email: payload.email };
}


