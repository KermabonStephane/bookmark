import type { AuthenticateUseCase } from "../ports/inbound/AuthenticateUseCase.js";
import type { AuthCredentials, AuthPort, AuthSession } from "../ports/outbound/AuthPort.js";

export class AuthenticateService implements AuthenticateUseCase {
  constructor(private readonly auth: AuthPort) {}

  async execute(credentials: AuthCredentials): Promise<AuthSession> {
    return this.auth.signIn(credentials);
  }
}
