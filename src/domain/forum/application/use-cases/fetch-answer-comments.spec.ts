import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let fetchAnswerComments: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository();
    fetchAnswerComments = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentsRepository,
    );
  });

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    );

    const result = await fetchAnswerComments.execute({
      answerId: 'answer-1',
      page: 1,
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
      );
    }

    const result = await fetchAnswerComments.execute({
      answerId: 'answer-1',
      page: 2,
    });

    expect(result.value?.answerComments).toHaveLength(2);
  });
});
