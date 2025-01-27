import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { constTexts } from './constants';
import { PostsService } from './modules/posts/posts.service';
import { PostEntity } from './modules/posts/schema/post.schema';
import { Public } from './decorators';
@Controller()

@ApiTags(constTexts.postRoute.Home)
export class AppController {
  constructor(private readonly postService: PostsService) {}

  @Get('HomePage')
  @Public()
  async getShuffledPosts(): Promise<PostEntity[]> {
    return this.postService.getShuffledPosts();
  }
}
