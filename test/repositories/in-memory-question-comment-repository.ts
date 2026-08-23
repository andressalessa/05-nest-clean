import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export class InMemoryQuestionCommentRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = [];

  // aqui precisamos buscar o nome do autor que está no repositório Student
  // como estamos dentro de um InMemoryRepository, ao invés de tipar a injeção de dependencia com StudentRepository
  // pois isso iria limitar os métodos que temos acesso
  // é melhor tipar diretamente com o InMemoryStudentsRepository
  // pois assim teremos acesso diretamente a tudo dentro dele
  // não faz sentido criar novos métodos no contrato StudentRepository apenas para atender a uma necessidade de
  // um teste ou inMemoryRepository
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() == questionId)
      .slice((params.page - 1) * 20, params.page * 20);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() == questionId)
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

    return questionComments;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id == questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }
}
