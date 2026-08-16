import { UserCaseError } from '@/core/errors/use-case-error';

export class WrongCredentialsError extends Error implements UserCaseError {
  constructor() {
    super('Credentials are not valid.');
  }
}
