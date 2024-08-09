import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PostDocument, PostEntity } from "./schema/post.schema";
import { Model } from "mongoose";
import { ResponseCode } from "../../exceptions";
import { UpdatePostDto } from "./dto/posts-update.dto";

import { CreatePostDto } from "./dto/create.post.dto";
import { UserService } from "../user/user.service";
// import { TestDocument } from "./schema/Update.schema";


@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostEntity.name) private postService: Model<PostDocument>,
    private readonly userService: UserService
  ) { }

  //Create A post/Ad
  async create(createDto: CreatePostDto): Promise<PostDocument> {
    try {
      const isObo = createDto.obo === true || (typeof createDto.obo === 'string' && createDto.obo === 'true');
      const isHelpFree = createDto.isHelpFree === true || (typeof createDto.isHelpFree === 'string' && createDto.isHelpFree === 'true');
      if (isHelpFree) {
        if (createDto.price !== undefined && createDto.price > 0) {
          throw new HttpException('When isHelpFree is true, price should be 0 and obo should be false', ResponseCode.BAD_REQUEST);
        }
        if (isObo) {
          throw new HttpException('When isHelpFree is true, obo should be false', ResponseCode.BAD_REQUEST);
        }
        createDto.price = 0; 
        createDto.obo = false;
      } else if (isObo) {
        if (createDto.price !== undefined) {
          throw new HttpException('When obo is true, price should not be provided', ResponseCode.BAD_REQUEST);
        }
        if (isHelpFree) {
          throw new HttpException('When obo is true, isHelpFree cannot be true', ResponseCode.BAD_REQUEST);
        }
      } else {
        if (createDto.price === undefined || createDto.price <= 0) {
          throw new HttpException('Price is required and must be greater than 0 when neither obo nor isHelpFree is selected', ResponseCode.BAD_REQUEST);
        }
      }
      const create: PostDocument = new this.postService(createDto);
      return await create.save();
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
  
  
  
  
  
  
  
  //Find All
  async findall(page = 1, limit = 20) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalCount = await this.postService.find().exec();
    const totalPages = Math.ceil(totalCount.length / limit);
    const data = await this.postService
      .aggregate([
        {
          $skip: startIndex,
        },
        {
          $limit: endIndex,
        },
      ])
      .exec()
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });

    return {
      totalCount: totalCount.length,
      totalPages: totalPages,
      data: data,
    };
  }

  //Update Post
  async update(id: string, updateDataDto: UpdatePostDto) {
    try {
      const updateData = await this.postService.findByIdAndUpdate(id, { $set: updateDataDto }, { new: true }).exec();
      return { data: updateData };
    } catch (err) {
      console.error('Error updating data:', err.message);
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
  //Delete Post
  async deletePost(id: string) {
    return await this.postService
      .findByIdAndDelete(id)
      .exec()
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  //View LoggedIn User Ads
  async viewMyAds(userId: string): Promise<any> {
    try {
      const p_selecedfields = 'title price createdAt'
      const u_selecedfields = 'name ratings'

      const p_data = await this.postService.find({ userId }).select(p_selecedfields).exec();
      const u_data = await this.userService.findCustomData(userId, u_selecedfields)
      if (!p_data || p_data.length === 0 || !u_data) {
        throw new HttpException('No posts found for this user', ResponseCode.NOT_FOUND);
      }
      const combinedData = p_data.map(post => ({
        ...post.toObject(),
        user: {
          name: u_data?.name,
          rating: u_data.ratings,
        },
      }));
      return combinedData;
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.NOT_FOUND);
    }
  }
  //View Other User Post/Ads (Code broken will fix later)

  // async viewOtherUserPost(id: string): Promise<any> {
  //   const p_fieldsToSelect = 'title images createdAt description price userId';
  //   const u_selecedfields = 'name ratings'
  //   const p_data = await this.postService.findById({ id }).select(p_fieldsToSelect).exec();
  //   const u_data = await this.userService.findCustomData(p_data.userId, u_selecedfields);
  //   if (!p_data) {
  //     throw new HttpException('no Post not found', ResponseCode.NOT_FOUND);
  //   }
  //   if (!u_data) {
  //     throw new HttpException('User not found', ResponseCode.NOT_FOUND);
  //   }
  //   const combinedData = {
  //     ...p_data.toObject(),
  //     user: {
  //       name: u_data.name,
  //       ratings: u_data.ratings,
  //     },
  //   };
  //   delete (combinedData as any).userId;
  //   return combinedData
  // }


  //Find post by id (This is the function to be used by other APis)
  async findById(postId: string): Promise<PostDocument> {
    return this.postService.findById(postId)
  }
  //Find comments of a Specefic Post (This is the function to be used by other APis)
  async findPostComments(postId: string): Promise<PostDocument> {
    return this.postService.findById(postId).populate('comments').exec();
  }
  // Find post with populated fields
  async getPostWithPopulatedComments(postId: string): Promise<PostDocument | null> {
    return this.postService
      .findById(postId)
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'name avatar rating',
        }
      })
      .exec();
  }
  async changeisCompleteFlag(postId: string) {
    await this.postService.findByIdAndUpdate(postId,
      { $set: { isCompleted: true } },
      { new: true }
    )
  }

}


