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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = exports.PostEntity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const mongoose_2 = require("mongoose");
let PostEntity = class PostEntity {
};
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_jsonschema_1.JSONSchema)({
        description: "title of the Post",
        title: "title",
    }),
    (0, mongoose_1.Prop)({ type: String, required: false, trim: true, default: "" }),
    __metadata("design:type", String)
], PostEntity.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_jsonschema_1.JSONSchema)({
        description: "Description of Post",
        title: "Description",
    }),
    (0, mongoose_1.Prop)({ type: String, required: false, trim: true, default: "" }),
    __metadata("design:type", String)
], PostEntity.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)({
        description: 'Images of the Post',
        type: [],
        example: ['image1.jpg', 'image2.jpg'],
    }),
    (0, mongoose_1.Prop)({ type: [String], default: [], required: false }),
    __metadata("design:type", Array)
], PostEntity.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "City of the Post",
        example: "New York",
    }),
    (0, mongoose_1.Prop)({ type: String, required: false, trim: true, default: "" }),
    __metadata("design:type", String)
], PostEntity.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "Street Address of the Post",
        example: "123 Main St",
    }),
    (0, mongoose_1.Prop)({ type: String, required: false, trim: true, default: "" }),
    __metadata("design:type", String)
], PostEntity.prototype, "streetAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "State of the Post",
        example: "NY",
    }),
    (0, mongoose_1.Prop)({ type: String, required: false, trim: true, default: "" }),
    __metadata("design:type", String)
], PostEntity.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "Zip code of the Poster",
        example: "10001",
    }),
    (0, mongoose_1.Prop)({ type: String, required: false, trim: true, default: "" }),
    __metadata("design:type", String)
], PostEntity.prototype, "zipCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", String)
], PostEntity.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "true"),
    (0, swagger_1.ApiProperty)({ default: true }),
    (0, mongoose_1.Prop)({ type: Boolean, required: false, default: false }),
    __metadata("design:type", Boolean)
], PostEntity.prototype, "isUrgent", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "true"),
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: Boolean, required: false, trim: true, default: false }),
    __metadata("design:type", Boolean)
], PostEntity.prototype, "isHelpFree", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, trim: true, default: false }),
    __metadata("design:type", Boolean)
], PostEntity.prototype, "isCompleted", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "true"),
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: Boolean, required: false, trim: true, default: true }),
    __metadata("design:type", Boolean)
], PostEntity.prototype, "obo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: String, required: false, trim: true, default: "" }),
    __metadata("design:type", String)
], PostEntity.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        properties: {
            coordinates: {
                type: 'array',
                items: { type: 'number' },
                example: [40.7128, -74.0060],
                description: 'Array of coordinates: [longitude, latitude]',
            },
        },
    }),
    (0, mongoose_1.Prop)({
        type: {
            type: String,
            enum: ['Point'],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true,
            default: [0, 0],
            validate: {
                validator: function (value) {
                    return value.length === 2;
                },
                message: 'Coordinates must be an array of two numbers [longitude, latitude]',
            },
        },
    }),
    __metadata("design:type", Object)
], PostEntity.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Comment' }], default: [] }),
    __metadata("design:type", Array)
], PostEntity.prototype, "comments", void 0);
PostEntity = __decorate([
    (0, mongoose_1.Schema)({
        toJSON: {
            getters: true,
            virtuals: true,
        },
        timestamps: true,
    })
], PostEntity);
exports.PostEntity = PostEntity;
const PostSchema = mongoose_1.SchemaFactory.createForClass(PostEntity);
exports.PostSchema = PostSchema;
PostSchema.virtual("id").get(function () {
    return this._id.toString();
});
//# sourceMappingURL=post.schema.js.map