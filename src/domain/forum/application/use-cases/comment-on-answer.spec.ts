import { CommentOnAnswerUseCase } from './comment-on-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let commentOnAnswer: CommentOnAnswerUseCase;

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentsRepository,
    );
    commentOnAnswer = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    await commentOnAnswer.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: 'New comment',
    });

    if (inMemoryAnswerCommentsRepository.items[0]) {
      expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
        'New comment',
      );
    }
  });
});
