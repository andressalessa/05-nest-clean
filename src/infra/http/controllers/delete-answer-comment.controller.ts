import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentontroller {
  constructor(private deleteAnswer: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  //@UsePipes(new ZodValidationPipe(deleteAnswerBodySchema)) // podemos usar assim para validar os dados
  async handle(
    // ou então podemos usar assim passando dentro do Body
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswer.execute({
      answerCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
