import { AttachmentUncheckedCreateInput } from '@/../prisma/generated/prisma/models/Attachment';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class PrismaAttachmentMapper {
  static toPrisma(attachment: Attachment): AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}

// undefined -> inexistente | indefinido
// null -> vazio | não preenchido
