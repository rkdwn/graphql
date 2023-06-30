import { Meal, MealDocument } from "@/meal/meal.entity";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { Model } from "mongoose";
import puppeteer from "puppeteer";

type ReserveDataType = {
  mealType: string;
  loginId: string;
  loginPassword: string;
  wantToReserve: boolean;
};

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Meal.name)
    private readonly mealModel: Model<MealDocument>
  ) {}
  private readonly logger = new Logger(TaskService.name);

  private async run(props: ReserveDataType) {
    const { loginId, loginPassword, mealType, wantToReserve } = props;
    if (!wantToReserve) return;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("http://mrs.vatechsnc.com/mrs/ext/meal/reserv");

    const username = await page.waitForSelector("div > #username");
    const password = await page.waitForSelector("div > #password");

    await username.type(loginId);
    await password.type(loginPassword);

    await page.click("div > button[type='submit']");

    try {
      await page.waitForSelector("div > .panel-footer", {
        timeout: 1000
      });
    } catch (err) {
      const panelBody = await page.waitForSelector("div > .panel-body");
      const _panelText = await panelBody.evaluate(el => el.textContent);
      if (_panelText.includes("없습니다")) {
        this.logger.error("예약 불가능 상황");
        browser.close();
        return;
      }
      // 로그인 실패한 경우도 여기 포함
      this.logger.error("로그인 실패");
      browser.close();
      return;
    }
    const buttonList = await page.$$("div > .panel-footer > button");

    for (let i = 0; i < buttonList.length; i++) {
      const buttonText = await buttonList[i].evaluate(el => el.textContent);
      if (mealType === "A") {
        if (buttonText.includes("A")) {
          buttonList[i].click();
          break;
        }
      }
      if (mealType === "B") {
        if (buttonText.includes("B")) {
          if (buttonText.split(":")[1] === "0") {
            // 재고 없음
            this.logger.error("재고없음!!");
            return;
          }
          buttonList[i].click();
          break;
        }
      }
      if (mealType === "C") {
        if (buttonText.includes("C")) {
          if (buttonText.split(":")[1] === "0") {
            // 재고 없음
            this.logger.error("재고없음!!");
            return;
          }
          buttonList[i].click();
          break;
        }
      }
    }
    // 확인 모달 창 처리
    await page.waitForSelector(".bootstrap-dialog-footer-buttons");
    const confirmButtonList = await page.$$(
      ".bootstrap-dialog-footer-buttons > button"
    );

    confirmButtonList.map(button => {
      button.evaluate(el => {
        if (el.textContent === "확인") {
          button.click();
        }
      });
    });

    await browser.close();
  }

  // 주중 아침 7시 30분에 실행
  // @Cron("0 30 7 * * 1-5", {
  //   name: "autoMeal",
  //   timeZone: "Asia/Seoul"
  // })
  @Cron("0/10 * * * * *", {
    name: "autoMeal",
    timeZone: "Asia/Seoul"
  })
  async handleCron() {
    const meals = await this.mealModel.find({}).exec();

    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i];

      const { loginId, loginPassword, mealType, wantToReserve } = meal;
      this.run({ loginId, loginPassword, mealType, wantToReserve });
    }
  }
}
