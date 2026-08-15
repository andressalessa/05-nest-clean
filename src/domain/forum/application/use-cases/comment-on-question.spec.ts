import { CommentOnQuestionUseCase } from './comment-on-question';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository';
import { makeQuestion } from '@/test/factories/make-question';
import { InMemoryQuestionCommentRepository } from '@/test/repositories/in-memory-question-comment-repository';
import { InMemoryQuestionAttachmentRepository } from '@/test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository;
let commentOnQuestion: CommentOnQuestionUseCase;

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentRepository();
    commentOnQuestion = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should be able to comment on question', async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    await commentOnQuestion.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'New comment',
    });

    if (inMemoryQuestionCommentsRepository.items[0]) {
      expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
        'New comment',
      );
    }
  });
});
