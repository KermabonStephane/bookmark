import type { AuthCredentials, AuthSession } from "../outbound/AuthPort.js";

export interface AuthenticateUseCase {
  execute(credentials: AuthCredentials): Promise<AuthSession>;
}
