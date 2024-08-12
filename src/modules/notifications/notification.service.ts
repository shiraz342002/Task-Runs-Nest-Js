import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schema/notification.schema';
import { NotificationType } from '../../casl/notification';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private readonly userService:UserService
  ) {}

  async createNotification(
    senderId: string,
    recipientId: string,
    type: NotificationType,
    relatedIds: { postId?: string; commentId?: string; orderId?: string; messageId?: string; reviewId?: string } = {},
  ): Promise<Notification> {
    const user_name = await this.userService.findName(senderId);
    const content = this.generateNotificationContent(type, user_name);
    const notification = new this.notificationModel({
      senderId,
      recipientId,
      type,
      content,
      ...relatedIds,
    });
    return await notification.save();
  }

  private generateNotificationContent(type: NotificationType, user_name: any): string {
    switch (type) {
      case NotificationType.COMMENT_ON_POST:
        return `${user_name} commented on your post.`;
      case NotificationType.REPLY_TO_COMMENT:
        return `${user_name} replied to your comment.`;
      case NotificationType.ORDER_ASSIGNED:
        return `You have been assigned a new order by ${user_name}.`;
      case NotificationType.ORDER_COMPLETED:
        return `Your order has been completed by ${user_name}.`;
      case NotificationType.USER_REVIEWED:
        return `${user_name} reviewed you.`;
      case NotificationType.USER_MESSAGE:
        return `${user_name} sent you a message.`;
      default:
        return 'You have a new notification.';
    }
  }
}