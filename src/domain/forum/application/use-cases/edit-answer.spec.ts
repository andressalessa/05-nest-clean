import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository.js';
import { makeAnswer } from '@/test/factories/make-answer.js';
import { EditAnswerUseCase } from './edit-answer.js';
import { UniqueEntityID } from '@/core/entities/unique-entity-id.js';
import { NotAllowedError } from '@/core/errors/errors/not-allowerd-error.js';
import { InMemoryAnswerAttachmentRepository } from '@/test/repositories/in-memory-answer-attachments-repository.js';
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment.js';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let editAnswer: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    editAnswer = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    );
  });

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    await editAnswer.execute({
      authorId: newAnswer.authorId.toValue(),
      answerId: newAnswer.id.toValue(),
      content: 'Edited Content',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Edited Content',
    });
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await editAnswer.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
      content: 'Edited Content',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
