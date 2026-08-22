import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import z from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  // @UsePipes(new ZodValidationPipe(answerQuestionBodySchema)) // podemos usar assim para validar os dados
  async handle(
    // ou então podemos usar assim passando dentro do Body
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: userId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
