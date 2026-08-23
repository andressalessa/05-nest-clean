/* eslint-disable @typescript-eslint/require-await */
import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() == id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() == questionId)
      .slice((params.page - 1) * 20, params.page * 20);

    return answers;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ) {
    const answers = this.items
      .filter((item) => item.questionId.toString() == questionId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((answer) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(answer.authorId);
        });

        if (!author) {
          throw new Error(
            `Author with ID "${answer.authorId.toString()}" does not exist.`,
          );
        }

        return AnswerWithAuthor.create({
          answerId: answer.id,
          questionId: answer.questionId,
          content: answer.content,
          authorId: answer.authorId,
          author: author.name,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        });
      });

    return answers;
  }

  async create(answer: Answer) {
    this.items.push(answer);
    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id == answer.id);
    this.items[itemIndex] = answer;

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    );
    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id == answer.id);

    this.items.splice(itemIndex, 1);
    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString(),
    );
  }
}
