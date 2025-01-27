import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
import { CreateReviewDto } from './Dto/create.review.dto';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from 'src/casl/notification';


@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    private readonly userService: UserService,
    private readonly notificationService:NotificationService,
  ) {}

  async create(reviewerId: string,revieweeId:string,createReviewDto: CreateReviewDto): Promise<Review> {
    if(reviewerId==revieweeId){
      throw new InternalServerErrorException("Cannot Post Reviews On Your Own Profile")
    }
    const review = new this.reviewModel({
        reviewerId,
        revieweeId,
      ...createReviewDto,
    });
    const savedReview = await review.save();
    await this.userService.updateReviews(revieweeId,savedReview.id)
    await this.userService.CalcRatings(revieweeId,createReviewDto.rating)
    await this.notificationService.createNotification(
      reviewerId,
      revieweeId,
      NotificationType.USER_REVIEWED,
      { postId: createReviewDto.postId.toString(),reviewId:savedReview.id }
    );
    return savedReview
  }

  async findByRevieweeId(revieweeId: string): Promise<Review[]> {
    return this.reviewModel.find({ revieweeId }).exec();
  }

  async findById(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async deleteReview(userId: string, reviewId: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    const reviewUserId = new Types.ObjectId(review.reviewerId);
    const userObjectId = new Types.ObjectId(userId);
    if (!reviewUserId.equals(userObjectId)) {
      throw new ForbiddenException('You do not have permission to delete this review');
    }
    await this.reviewModel.findByIdAndDelete(reviewId);
    await this.userService.removeReviewFromUser(userId, reviewId);
    return review
  }
  async getProfileReviews(userId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID format');
      }
      return await this.userService.getProfileReviews(userId);
    } catch (error) {
      console.error('Error in ReviewsService.getProfileReviews:', error);
      throw new InternalServerErrorException('An error occurred while fetching user reviews');
    }
  }
  
  
}

