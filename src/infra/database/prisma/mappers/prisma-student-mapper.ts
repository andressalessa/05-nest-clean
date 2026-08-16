import {
  UserModel as PrismaUser,
  UserUncheckedCreateInput,
} from '@/../prisma/generated/prisma/models/User';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student';

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(student: Student): UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    };
  }
}

// undefined -> inexistente | indefinido
// null -> vazio | não preenchido
