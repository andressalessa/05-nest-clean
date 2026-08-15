import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository.js';
import { makeQuestion } from '@/test/factories/make-question.js';
import { DeleteQuestionUseCase } from './delete-question.js';
import { UniqueEntityID } from '@/core/entities/unique-entity-id.js';
import { NotAllowedError } from '@/core/errors/errors/not-allowerd-error.js';
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments-repository.js';
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let deleteQuestion: DeleteQuestionUseCase;

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    deleteQuestion = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to delete a question', async () => {
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
    );

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    await deleteQuestion.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await deleteQuestion.execute({
      authorId: 'author-2',
      questionId: 'question-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
