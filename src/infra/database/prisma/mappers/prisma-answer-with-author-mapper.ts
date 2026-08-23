import {
  AnswerModel as PrismaAnswer,
  UserModel as PrismaUser,
} from 'prisma/generated/prisma/models';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type PrismaAnswerWithAuthor = PrismaAnswer & {
  author: PrismaUser;
};

export class PrismaAnswerWithAuthorMapper {
  static toDomain(raw: PrismaAnswerWithAuthor): AnswerWithAuthor {
    return AnswerWithAuthor.create({
      answerId: new UniqueEntityID(raw.id),
      questionId: new UniqueEntityID(raw.questionId?.toString()),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
