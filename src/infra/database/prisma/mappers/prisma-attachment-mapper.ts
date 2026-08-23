import { AttachmentUncheckedCreateInput } from '@/../prisma/generated/prisma/models/Attachment';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { AttachmentModel as PrismaAttachment } from '@/../prisma/generated/prisma/models/Attachment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    );
  }

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
