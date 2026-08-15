import type { UserCaseError } from '@/core/errors/use-case-error';

export class NotAllowedError extends Error implements UserCaseError {
  constructor() {
    super('Not allowed.');
  }
}
