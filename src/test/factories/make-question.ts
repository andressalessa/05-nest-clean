import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id.js';
import {
  Question,
  type QuestionProps,
} from '@/domain/forum/enterprise/entities/question.js';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug.js';

export function makeQuestion(
  // Partial transforma todos atributos de QuestionProps em opcionais
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      slug: Slug.create('example-question'),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}
