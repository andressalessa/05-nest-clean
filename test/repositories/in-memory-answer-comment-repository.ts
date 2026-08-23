import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

// sempre que estiver num repositório InMemory, toda injeção de dependencia pra um repository pode e deve ser feita
// diretamente com a tipagem de um InMemoryRepository... não é necessário tipar com a abstrata
export class InMemoryAnswerCommentRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, params: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() == answerId)
      .slice((params.page - 1) * 20, params.page * 20);

    return answerComments;
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() == answerId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId);
        });

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exist.`,
          );
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          author: author.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        });
      });

    return answerComments;
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id == answerComment.id,
    );

    this.items.splice(itemIndex, 1);
  }
}
