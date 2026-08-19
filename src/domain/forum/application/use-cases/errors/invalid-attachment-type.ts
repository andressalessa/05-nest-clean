import { UserCaseError } from '@/core/errors/use-case-error';

export class InvalidAttachmentTypeError extends Error implements UserCaseError {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`);
  }
}
