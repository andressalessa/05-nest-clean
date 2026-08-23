import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { NotAllowedError } from '@/core/errors/errors/not-allowerd-error';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let deleteQuestionComment: DeleteQuestionCommentUseCase;

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository,
    );
    deleteQuestionComment = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    await deleteQuestionComment.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a comment question from another user', async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await deleteQuestionComment.execute({
      authorId: 'author-2',
      questionCommentId: questionComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
