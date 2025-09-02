import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private jwt: JwtService) {}

  encrypt(payload: any) {
    return this.jwt.sign(payload, {
      algorithm: "HS256",
    });
  }

  createAuthToken(email: string, id?: number | string) {
    const now = Date.now();
    const token = this.encrypt({
      typ: "auth_token",
      iat: now,
      exp: now + 30 * 24 * 60 * 60 * 1000, // 30 days
      email,
      ...(id && { id: id }),
    });
    return token;
  }

  validateToken(token: string): { result?: any; error?: any } {
    try {
      const payload = this.jwt.verify(token);
      if (payload.exp < Date.now()) {
        return { error: "token failed" };
      }
      return { result: payload };
    } catch (error) {
      return { error: "token failed" };
    }
  }
}
