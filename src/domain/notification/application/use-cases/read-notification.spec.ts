import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notification-repository.js';
import { ReadNotificationUseCase } from './read-notification.js';
import { makeNotification } from '@/test/factories/make-notification.js';
import { UniqueEntityID } from '@/core/entities/unique-entity-id.js';
import { NotAllowedError } from '@/core/errors/errors/not-allowerd-error.js';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let readNotification: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    readNotification = new ReadNotificationUseCase(
      inMemoryNotificationsRepository,
    );
  });

  it('should be able to read an notification', async () => {
    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await readNotification.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]?.readAt).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-1'),
      },
      new UniqueEntityID('notification-1'),
    );

    await inMemoryNotificationsRepository.create(notification);

    const result = await readNotification.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
