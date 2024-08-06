"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAccountOnlyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_schema_1 = require("../../user/schema/user.schema");
class VerifyAccountOnlyDto extends (0, swagger_1.PickType)(user_schema_1.User, [
    "email",
]) {
}
exports.VerifyAccountOnlyDto = VerifyAccountOnlyDto;
//# sourceMappingURL=verify-account-only.dto.js.map