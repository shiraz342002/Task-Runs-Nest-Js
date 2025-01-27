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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const userRoles_1 = require("../../casl/userRoles");
const decorators_1 = require("../../decorators");
const constants_1 = require("../../constants");
const user_schema_1 = require("../user/schema/user.schema");
const create_order_dto_1 = require("./Dto/create.order.dto");
const order_service_1 = require("./order.service");
const update_order_dto_1 = require("./Dto/update.order.dto");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async assignTask(user, TaskAssignedToId, CreateOrderDto) {
        const order = await this.orderService.assignTask(user.id, TaskAssignedToId, CreateOrderDto);
        return order;
    }
    async completeOrder(user, orderId) {
        const completedOrder = await this.orderService.completeOrder(user.id, orderId);
        return completedOrder;
    }
    async getOrderInfo(orderId, user) {
        const order = await this.orderService.getOrderInfo(user.id, orderId);
        return order;
    }
    async changeTask(orderId, user, CreateOrderDto) {
        const updated_task = await this.orderService.changeTask(user.id, orderId, CreateOrderDto);
        return updated_task;
    }
    async cancelOrder(orderId, user) {
        console.log("Order Id: " + orderId);
        console.log("User Id: " + user.id);
        const deletedTask = await this.orderService.cancelTask(user.id, orderId);
        return deletedTask;
    }
};
__decorate([
    (0, common_1.Post)(constants_1.constTexts.orderMgmt.assignOrder),
    (0, swagger_1.ApiOperation)({ summary: "Assign Task to a User" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Task Assigned Successfully" }),
    (0, decorators_1.Auth)(userRoles_1.Action.Create, "Order"),
    __param(0, (0, decorators_1.AuthUser)()),
    __param(1, (0, common_1.Param)('TaskAssignedToId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, create_order_dto_1.AssignOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "assignTask", null);
__decorate([
    (0, common_1.Post)(constants_1.constTexts.orderMgmt.completeTask),
    (0, swagger_1.ApiOperation)({ summary: "Complete Assigned Task" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Task Completed Succeffully" }),
    (0, decorators_1.Auth)(userRoles_1.Action.Create, "Order"),
    __param(0, (0, decorators_1.AuthUser)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "completeOrder", null);
__decorate([
    (0, common_1.Get)(constants_1.constTexts.orderMgmt.getOrderInfo),
    (0, swagger_1.ApiOperation)({ summary: "Get Order Information " }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Task Information Retrived Successfully" }),
    (0, decorators_1.Auth)(userRoles_1.Action.Read, "Order"),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, decorators_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderInfo", null);
__decorate([
    (0, common_1.Patch)(constants_1.constTexts.orderMgmt.changeOrder),
    (0, swagger_1.ApiOperation)({ summary: "Change Task Details " }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Task Updated Successfully" }),
    (0, decorators_1.Auth)(userRoles_1.Action.Read, "Order"),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, decorators_1.AuthUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User,
        update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "changeTask", null);
__decorate([
    (0, common_1.Delete)(constants_1.constTexts.orderMgmt.cancelTask),
    (0, swagger_1.ApiOperation)({ summary: "Cancel Assigned Task" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Task Cancelled Successfully" }),
    (0, decorators_1.Auth)(userRoles_1.Action.Delete, "Order"),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, decorators_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
OrderController = __decorate([
    (0, common_1.Controller)(constants_1.constTexts.orderMgmt.name),
    (0, swagger_1.ApiTags)(constants_1.constTexts.orderMgmt.name),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map