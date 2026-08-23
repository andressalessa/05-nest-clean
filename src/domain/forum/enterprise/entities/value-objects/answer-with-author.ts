import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

interface AnswerWithAuthorProps {
  answerId: UniqueEntityID;
  questionId: UniqueEntityID;
  content: string;
  authorId: UniqueEntityID;
  author: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class AnswerWithAuthor extends ValueObject<AnswerWithAuthorProps> {
  get answerId() {
    return this.props.answerId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get author() {
    return this.props.author;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: AnswerWithAuthorProps) {
    return new AnswerWithAuthor(props);
  }
}
