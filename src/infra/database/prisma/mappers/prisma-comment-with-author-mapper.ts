import {
  CommentModel as PrismaComment,
  UserModel as PrismaUser,
} from 'prisma/generated/prisma/models';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser;
};

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
