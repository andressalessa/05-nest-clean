import { makeAnswer } from '@/test/factories/make-answer.js';
import { OnAnswerCreated } from './on-answer-created.js';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository.js';
import { InMemoryAnswerAttachmentRepository } from '@/test/repositories/in-memory-answer-attachments-repository.js';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository.js';
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments-repository.js';
import { SendNotificationUseCase } from '../use-cases/send-notification.js';
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notification-repository.js';
import { makeQuestion } from '@/test/factories/make-question.js';
import type { MockInstance } from 'vitest';
import { waitFor } from '@/test/utils/wait-for.js';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });

  it('should send a notification when a answer is created', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
