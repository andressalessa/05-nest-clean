import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository';
import { makeQuestion } from '@/test/factories/make-question';
import { makeAnswer } from '@/test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowerd-error';
import { InMemoryAnswerAttachmentRepository } from '@/test/repositories/in-memory-answer-attachments-repository';
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments-repository';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase;

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    chooseQuestionBestAnswer = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to choose the best answer for a question', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await chooseQuestionBestAnswer.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    });

    if (inMemoryQuestionsRepository.items[0]) {
      expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
        answer.id,
      );
    }
  });

  it("should not be able to choose another user question's best answer for a question", async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    const result = await chooseQuestionBestAnswer.execute({
      authorId: new UniqueEntityID('another-author-id').toString(),
      answerId: answer.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
