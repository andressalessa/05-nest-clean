import { expect, test } from 'vitest';
import { Slug } from './slug';

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('This is a title');
  expect(slug.value).toBe('this-is-a-title');
});
