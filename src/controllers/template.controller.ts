import { Controller, Get, UseGuards} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(
        private prisma: PrismaService
    ) { }

    @Get()
    async handle() {

    }

}
