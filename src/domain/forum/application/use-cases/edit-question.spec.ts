import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository.js';
import { makeQuestion } from '@/test/factories/make-question.js';
import { EditQuestionUseCase } from './edit-question.js';
import { UniqueEntityID } from '@/core/entities/unique-entity-id.js';
import { NotAllowedError } from '@/core/errors/errors/not-allowerd-error.js';
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments-repository.js';
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let editQuestion: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    editQuestion = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    );
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    await editQuestion.execute({
      authorId: newQuestion.authorId.toValue(),
      questionId: newQuestion.id.toValue(),
      title: 'Edited Title',
      content: 'Edited Content',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Edited Title',
      content: 'Edited Content',
    });

    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await editQuestion.execute({
      authorId: 'author-2',
      questionId: 'question-1',
      title: 'Edited Title',
      content: 'Edited Content',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
