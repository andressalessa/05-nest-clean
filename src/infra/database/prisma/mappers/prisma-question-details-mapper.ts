import {
  QuestionModel as PrismaQuestion,
  UserModel as PrismaUser,
  AttachmentModel as PrismaAttachment,
} from 'prisma/generated/prisma/models';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { PrismaAttachmentMapper } from './prisma-attachment-mapper';

export type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      title: raw.title,
      slug: Slug.create(raw.slug),
      attachments: raw.attachments.map((attachment) =>
        PrismaAttachmentMapper.toDomain(attachment),
      ),
      content: raw.content,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
