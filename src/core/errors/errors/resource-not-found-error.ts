import type { UserCaseError } from '@/core/errors/use-case-error.js';

export class ResourceNotFoundError extends Error implements UserCaseError {
  constructor() {
    super('Resource not found.');
  }
}
