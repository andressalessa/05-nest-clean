import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository.js';
import { GetQuestionBySlugUseCase } from './get-question-by-slug.js';
import { makeQuestion } from '@/test/factories/make-question.js';
import { Slug } from '../../enterprise/entities/value-objects/slug.js';
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments-repository.js';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let getQuestion: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    getQuestion = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await getQuestion.execute({
      slug: 'example-question',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.question.id).toBeTruthy();
      expect(result.value?.question.title).toEqual(newQuestion.title);
    }
  });
});
