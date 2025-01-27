import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./Schema/order.schema";
import { AssignOrderDto } from "./Dto/create.order.dto";
import { UserService } from "../user/user.service";
import { PostsService } from "../posts/posts.service";
import { UpdateOrderDto } from "./Dto/update.order.dto";
import { NotificationService } from "../notifications/notification.service";
import { NotificationType } from "src/casl/notification";

@Injectable()
export class OrderService {
constructor(
   @InjectModel(Order.name) private orderModel: Model<Order>,
   private readonly userService:UserService,
   private readonly postService:PostsService,
   private readonly notificationService:NotificationService,
) {}
 async assignTask(userId: string, TaskAssignedToId: string, CreateOrderDto:AssignOrderDto): Promise<Order> {    
   if(userId===TaskAssignedToId){
      throw new InternalServerErrorException("Cannot Assign an order to yourself")
   }
  const order = new this.orderModel({
    TaskAssignedBy: userId,
    TaskAssignedTo: TaskAssignedToId,
   ...CreateOrderDto
  });
  const Assignedorder= await order.save();
  await this.notificationService.createNotification(userId,TaskAssignedToId,NotificationType.ORDER_ASSIGNED,{postId:CreateOrderDto.PostId.toString(),orderId:Assignedorder.id})
  return Assignedorder
 }

 async getOrderInfo(userId:string,orderId:string):Promise<any>{
   const validateorder = await this.orderModel.findById(orderId)
   if(validateorder.TaskAssignedBy.toString()!==userId){
      throw new ForbiddenException("You are not authoraized to view this Task")
   }
   const order = await this.orderModel.findById(orderId).populate([{
      path: 'TaskAssignedBy',
      select: 'name avatar ratings'
   },
   {
     path: 'TaskAssignedTo',
     select: 'name avatar ratings'
   },
   {
      path:'PostId',
      select:'title description city isCompleted'
   },  

])
   if(!order){
      throw new NotFoundException("No Order Exsist");
   }
     return order
 }
 async cancelTask(userId:string,orderId:string):Promise<any>{
   const order=await this.orderModel.findById(orderId);
   if(!order){
      throw new NotFoundException("No Order Exsist");
   }
   if (order.TaskAssignedBy.toString() === userId) {
   return await this.orderModel.findByIdAndDelete(orderId)
   }
   else{
      throw new UnauthorizedException("You are now authorized to perform this operation")
    }
 }
 //We are meant to display Review page after this function is hit and is successfull
 async completeOrder(userId:string,orderId:string):Promise<Order>{
   // console.log("Idhar taq chal raha ?");
   // console.log("OrderId:"+orderId);
   
   const order = await this.orderModel.findById(orderId)
   // console.log(order);
   
   const customer_id = order.TaskAssignedBy.toString();
   const service_provider_id = order.TaskAssignedTo.toString();
   const post_id=order.PostId.toString();
   if(!order){
      throw new NotFoundException("Cannot find this order")
   }
   if (order.TaskAssignedTo.toString()!== userId) {
      throw new UnauthorizedException("You are not authorized to complete this order.");
   }
   const updatedOrder= await this.orderModel.findByIdAndUpdate(orderId,
      {
      $set:{isCompleted:true,
         deadline: null
      }},{new:true},
   )
   await updatedOrder.save();
   await this.userService.incrementMyOrder(customer_id);
   await this.postService.changeIsCompleteFlag(post_id)
   await this.userService.incrementTaskCompleted(service_provider_id)
   await this.notificationService.createNotification(service_provider_id,customer_id,NotificationType.ORDER_COMPLETED,{postId:post_id,orderId:orderId},)
   return updatedOrder
 }

 async changeTask(userId:string,orderId:string,updateOrderDto:UpdateOrderDto):Promise<Order>{
   const order = await this.orderModel.findById(orderId)
   if(!order){
      throw new NotFoundException("Order Does not exsist or deleted ")
   }
   console.log(order);
   
   if(order.TaskAssignedBy.toString()!==userId){
      throw new UnauthorizedException("You are not authorized to complete this order.");
   }
   const updated_order=await this.orderModel.findByIdAndUpdate(orderId,{
   $set:updateOrderDto
   },{new:true})
   return updated_order
 }
}