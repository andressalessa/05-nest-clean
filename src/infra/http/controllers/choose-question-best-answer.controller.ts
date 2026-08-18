import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  //@UsePipes(new ZodValidationPipe(chooseQuestionBestAnswerBodySchema)) // podemos usar assim para validar os dados
  async handle(
    // ou então podemos usar assim passando dentro do Body
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const userId = user.sub;

    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
