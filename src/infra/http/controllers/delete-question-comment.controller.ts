import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentontroller {
  constructor(private deleteAnswer: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  //@UsePipes(new ZodValidationPipe(deleteAnswerBodySchema)) // podemos usar assim para validar os dados
  async handle(
    // ou então podemos usar assim passando dentro do Body
    @CurrentUser() user: UserPayload,
    @Param('id') questionCommentId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswer.execute({
      questionCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
