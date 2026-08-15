import type { AnswersRepository } from '../repositories/answers-repository.js';
import type { Question } from '../../enterprise/entities/question.js';
import type { QuestionsRepository } from '../repositories/questions-repository.js';
import { left, right, type Either } from '@/core/either.js';
import { NotAllowedError } from '@/core/errors/errors/not-allowerd-error.js';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error.js';

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { question: Question }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new NotAllowedError());
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId != question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
