/* eslint-disable @typescript-eslint/require-await */
import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository.js';
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.js';

export class InMemoryQuestionAttachmentRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() == questionId,
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() != questionId,
    );

    this.items = questionAttachments;
  }
}
