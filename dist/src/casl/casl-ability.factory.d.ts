import { Ability } from "@casl/ability";
import { User } from "../modules/user/schema/user.schema";
import { Action } from "./userRoles";
export type Subjects = any;
export type AppAbility = Ability<[Action, Subjects]>;
export declare class CaslAbilityFactory {
    createForUser(user: User): Promise<Ability<[Action, any], import("@casl/ability").MongoQuery<import("@casl/ability/dist/types/types").AnyObject>>>;
}
