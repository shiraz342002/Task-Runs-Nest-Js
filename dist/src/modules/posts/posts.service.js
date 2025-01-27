"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const post_schema_1 = require("./schema/post.schema");
const mongoose_2 = require("mongoose");
const exceptions_1 = require("../../exceptions");
const user_service_1 = require("../user/user.service");
let PostsService = class PostsService {
    constructor(postService, userService) {
        this.postService = postService;
        this.userService = userService;
    }
    async create(createDto) {
        try {
            const isObo = createDto.obo === true || (typeof createDto.obo === 'string' && createDto.obo === 'true');
            const isHelpFree = createDto.isHelpFree === true || (typeof createDto.isHelpFree === 'string' && createDto.isHelpFree === 'true');
            if (isHelpFree) {
                if (createDto.price !== undefined && createDto.price > 0) {
                    throw new common_1.HttpException('When isHelpFree is true, price should be 0 and obo should be false', exceptions_1.ResponseCode.BAD_REQUEST);
                }
                if (isObo) {
                    throw new common_1.HttpException('When isHelpFree is true, obo should be false', exceptions_1.ResponseCode.BAD_REQUEST);
                }
                createDto.price = 0;
                createDto.obo = false;
            }
            else if (isObo) {
                if (createDto.price !== undefined) {
                    throw new common_1.HttpException('When obo is true, price should not be provided', exceptions_1.ResponseCode.BAD_REQUEST);
                }
                if (isHelpFree) {
                    throw new common_1.HttpException('When obo is true, isHelpFree cannot be true', exceptions_1.ResponseCode.BAD_REQUEST);
                }
            }
            else {
                if (createDto.price === undefined || createDto.price <= 0) {
                    throw new common_1.HttpException('Price is required and must be greater than 0 when neither obo nor isHelpFree is selected', exceptions_1.ResponseCode.BAD_REQUEST);
                }
            }
            const create = new this.postService(createDto);
            return await create.save();
        }
        catch (err) {
            throw new common_1.HttpException(err.message, exceptions_1.ResponseCode.BAD_REQUEST);
        }
    }
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
            throw new common_1.HttpException(err.message, exceptions_1.ResponseCode.BAD_REQUEST);
        });
        return {
            totalCount: totalCount.length,
            totalPages: totalPages,
            data: data,
        };
    }
    async update(id, updateDataDto) {
        try {
            const updateData = await this.postService.findByIdAndUpdate(id, { $set: updateDataDto }, { new: true }).exec();
            return { data: updateData };
        }
        catch (err) {
            console.error('Error updating data:', err.message);
            throw new common_1.HttpException(err.message, exceptions_1.ResponseCode.BAD_REQUEST);
        }
    }
    async deletePost(id) {
        return await this.postService
            .findByIdAndDelete(id)
            .exec()
            .catch((err) => {
            throw new common_1.HttpException(err.message, exceptions_1.ResponseCode.BAD_REQUEST);
        });
    }
    async viewMyAds(userId) {
        try {
            const p_selecedfields = 'title price createdAt';
            const u_selecedfields = 'name ratings';
            const p_data = await this.postService.find({ userId }).select(p_selecedfields).exec();
            const u_data = await this.userService.findCustomData(userId, u_selecedfields);
            if (!p_data || p_data.length === 0 || !u_data) {
                throw new common_1.HttpException('No posts found for this user', exceptions_1.ResponseCode.NOT_FOUND);
            }
            const combinedData = p_data.map(post => (Object.assign(Object.assign({}, post.toObject()), { user: {
                    name: u_data === null || u_data === void 0 ? void 0 : u_data.name,
                    rating: u_data.ratings,
                } })));
            return combinedData;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, exceptions_1.ResponseCode.NOT_FOUND);
        }
    }
    async findById(postId) {
        return this.postService.findById(postId);
    }
    async findPostComments(postId) {
        return this.postService.findById(postId).populate('comments').exec();
    }
    async getPostWithPopulatedComments(postId) {
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
    async changeIsCompleteFlag(postId) {
        await this.postService.findByIdAndUpdate(postId, { $set: { isCompleted: true } }, { new: true });
    }
    async getPostsWithinRadius(longitude, latitude, radius) {
        return this.postModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radius / 3963.2],
                },
            },
        }).exec();
    }
    async getShuffledPosts() {
        try {
            const posts = await this.postService.find().exec();
            const shuffledPosts = shuffleArray(posts);
            return shuffledPosts;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve  posts');
        }
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }
    async getWithinRadius(locationDto) {
        try {
            const { radius, location } = locationDto;
            if (!location || typeof location !== 'object' || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
                throw new common_1.HttpException('Invalid location coordinates', common_1.HttpStatus.BAD_REQUEST);
            }
            const [longitude, latitude] = location.coordinates;
            if (radius <= 0) {
                throw new common_1.HttpException('Radius must be greater than 0', common_1.HttpStatus.BAD_REQUEST);
            }
            const pipeline = [
                {
                    $match: {
                        location: {
                            $geoWithin: {
                                $centerSphere: [
                                    [longitude, latitude],
                                    radius / 6371.1,
                                ],
                            },
                        },
                    },
                },
            ];
            console.log('Aggregation pipeline:', pipeline);
            const events = await this.postService.aggregate(pipeline).exec();
            if (!events || events.length === 0) {
                throw new common_1.HttpException('No posts found within the specified radius', common_1.HttpStatus.NOT_FOUND);
            }
            return events;
        }
        catch (error) {
            console.error('Error fetching posts within radius:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch posts within radius');
        }
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.PostEntity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map