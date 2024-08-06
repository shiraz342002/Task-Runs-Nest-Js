import { Model } from "mongoose";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { ResponseCode, ResponseMessage } from "../../exceptions";
import type { Optional } from "../../types";
import { ResetPasswordDto } from "../auth/dto/reset-password.dto";
import { VerifyOtpDto } from "../auth/dto/verify-otp.dto";
import { MailService } from "../mail/mail.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schema/user.schema";
import { ForgotPasswordDto } from "../auth/dto/forgot-password.dto";
import { VerifyAccountDto } from "../auth/dto/verify-account.dto";
import { UserSignupDto } from "../auth/dto/user.signup.dto";
import { VerifyAccountOnlyDto } from "../auth/dto/verify-account-only.dto";
export declare class UserService {
    private userModel;
    private sendMail;
    constructor(userModel: Model<UserDocument>, sendMail: MailService);
    sendForgetPassword(ForgetPasswordDto: ForgotPasswordDto): Promise<{
        message: ResponseMessage;
        successCode: ResponseCode;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        email: string;
    }>;
    logout(userId: string): Promise<any>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        data: User & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getSchema(): Promise<import("openapi3-ts").SchemaObject>;
    verifyAccount(dto: VerifyAccountDto): Promise<any>;
    getOne(id: string): Promise<User>;
    findOne(findData: any): Promise<User | null>;
    findByEmail(options: Partial<{
        email: string;
    }>): Promise<Optional<User>>;
    generateString(length: any): Promise<string>;
    createUser(userRegisterDto: UserSignupDto): Promise<UserSignupDto>;
    resendOTP(dto: VerifyAccountOnlyDto): Promise<any>;
    getUsers(pageOptionsDto: PageOptionsDto): Promise<User[]>;
    update(userId: string, userUpdateDto: UpdateUserDto): Promise<{
        data: User & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getProfileData(userId: string): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(userId: string): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    viewProfile(userId: string): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    viewOtherProfile(userId: string): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findCustomData(userId: string, custom_fields: any): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateReviews(userId: string, reviewId: string): Promise<void>;
    CalcRatings(revieweeId: string, newRating: number): Promise<void>;
}