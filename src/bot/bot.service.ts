import { StorageService } from "@/common/storage/storage.service";
import { Meal, MealDocument } from "@/meal/meal.entity";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Meal.name)
    private readonly mealModel: Model<MealDocument>,
    private readonly storageService: StorageService
  ) {}
  public async getHello() {
    return "hello~";
  }

  public async checkBotUserId(botUserId: string) {
    const result: MealDocument = await this.mealModel.findOne({
      botUserId: botUserId
    });
    return result;
  }

  public async registUserId(id: string, botUserId: string) {
    const result = await this.mealModel.findOneAndUpdate(
      { loginId: id },
      { botUserId: botUserId },
      { new: true }
    );
    return result;
  }

  public async resetUser(botUserId: string) {
    const result = await this.mealModel.updateMany(
      { botUserId: botUserId },
      { botUserId: null },
      { new: true }
    );
    return result;
  }

  public async getReserveResult(userId: string) {
    const resultStream = await this.storageService.getObject(
      "meals",
      `${userId}.pdf`
    );
    return resultStream;
  }
}
