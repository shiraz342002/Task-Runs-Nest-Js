import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { constTexts } from "src/constants";
import { Action } from "../../casl/userRoles";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { ApiPageOkResponse, Auth, AuthUser } from "../../decorators";
import { LoggerMessages } from "../../exceptions/index";
import { LoggerService } from "../../logger/logger.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./user.schema";
import { UserService } from "./user.service";
import { multerOptions } from "src/configuration/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller(constTexts.userRoute.name)
@ApiTags(constTexts.userRoute.name)
export class UserController {
  constructor(
    private userService: UserService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext("users controller");
  }

  /**
   * Get Users
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, "User")
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: "Get users list",
    type: User,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @AuthUser() user: User
  ): Promise<User[]> {
    this.loggerService.log(
      `GET User/ ${LoggerMessages.API_CALLED} ${user.email}`
    );
    return this.userService.getUsers(pageOptionsDto);
  }
  /**
   *
   * @get user Schema
   * @return
   *
   */
  @Get(constTexts.userRoute.schema)
  @Auth(Action.Read, "User")
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: "Get User Schema",
    type: User,
  })
  getuserSchema() {
    this.loggerService.log(`GET User Schema/ ${LoggerMessages.API_CALLED}`);
    return this.userService.getSchema();
  }
  @Patch()
  @ApiPageOkResponse({
    description: "Update User Profile",
    type: User,
  })
  @Auth(Action.Read, "User")
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async update(@AuthUser() user: User, @Body() userUpdateDto: UpdateUserDto,@UploadedFile() file: Express.Multer.File) {
    if (file) {
      userUpdateDto.avatar = `/${file.filename}`;
    }
    return this.userService.update(user.id, userUpdateDto);
  }

  @Delete(constTexts.userRoute.deleteAccount)
  @ApiPageOkResponse({
    description: "Delete User ",
    type: User,
  })
  @Auth(Action.Delete, "User")
  async deleteAccount(@AuthUser() user: User) {
    return this.userService.delete(user.id);
  }
}