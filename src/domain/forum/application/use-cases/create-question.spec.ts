import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository.js';
import { CreateQuestionUseCase } from './create-question.js';
import { UniqueEntityID } from '@/core/entities/unique-entity-id.js';
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments-repository.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let createQuestion: CreateQuestionUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    createQuestion = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to create an question', async () => {
    const result = await createQuestion.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      result.value?.question,
    );
    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });
});
