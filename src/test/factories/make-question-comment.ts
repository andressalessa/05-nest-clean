import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id.js';
import {
  QuestionComment,
  type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment.js';

export function makeQuestionComment(
  // Partial transforma todos atributos de QuestionProps em opcionais
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return questionComment;
}
