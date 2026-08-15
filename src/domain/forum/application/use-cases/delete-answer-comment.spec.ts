import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { InMemoryAnswerCommentRepository } from '@/test/repositories/in-memory-answer-comment-repository';
import { makeAnswerComment } from '@/test/factories/make-answer-comment';
import { NotAllowedError } from '@/core/errors/errors/not-allowerd-error';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let deleteAnswerComment: DeleteAnswerCommentUseCase;

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository();
    deleteAnswerComment = new DeleteAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
    );
  });

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answerComment);

    await deleteAnswerComment.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a comment answer from another user', async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await deleteAnswerComment.execute({
      authorId: 'author-2',
      answerCommentId: answerComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
