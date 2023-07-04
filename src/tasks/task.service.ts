import { Meal, MealDocument } from "@/meal/meal.entity";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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
    private readonly mealModel: Model<MealDocument>,
    private readonly configService: ConfigService
  ) {}
  private readonly logger = new Logger(TaskService.name);

  private async run(props: ReserveDataType) {
    const { loginId, loginPassword, mealType, wantToReserve } = props;
    if (!wantToReserve) return;

    const browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        this.configService.get("NODE_ENV") === "development"
          ? null
          : "/usr/bin/chromium-browser",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage"
      ],
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    await page.goto("http://mrs.vatechsnc.com/mrs/ext/meal/reserv");

    const username = await page.waitForSelector("div > #username");
    const password = await page.waitForSelector("div > #password");

    await username.type(loginId);
    await password.type(loginPassword);

    this.logger.debug(`로그인 시도, ${loginId}, ${loginPassword}`);

    const loginBtn = await page.waitForSelector("button[type='submit']");
    await loginBtn.evaluate(el => el.click());
    try {
      await page.waitForSelector("div > .panel-footer", {
        timeout: 1000
      });
    } catch (err) {
      const panelBody = await page.waitForSelector("div > .panel-body");
      const _panelText = await panelBody.evaluate(el => el.textContent);

      if (_panelText.includes("없습니다")) {
        this.logger.error(`예약 불가능 상황, ${loginId}, ${loginPassword}`);
        browser.close();
        return;
      }
      // 로그인 실패한 경우도 여기 포함
      this.logger.error(`로그인 실패, ${loginId}, ${loginPassword}`);
      browser.close();
      return;
    }

    if (mealType === "A") {
      this.logger.debug("A코스 예약 시도");
      const _mealA = await page.waitForSelector("button[data-course-code='A']");

      await _mealA.evaluate(el => el.click());
    }
    if (mealType === "B") {
      this.logger.debug("B코스 예약 시도");
      const _mealB = await page.waitForSelector("button[data-course-code='B']");

      // const _text = await page.evaluate(() => {
      //   const element = document.querySelector(
      //     "button[data-course-code='B'] span.badge"
      //   );
      //   return element.textContent;
      // });

      // this.logger.debug(`span 확인 ${_text}`);

      await _mealB.evaluate(el => el.click());
    }

    if (mealType === "C") {
      this.logger.debug("C코스 예약 시도");
      const _mealC = await page.waitForSelector("button[data-course-code='C']");

      await _mealC.evaluate(el => el.click());
    }

    this.logger.debug("확인버튼 클릭");
    // 확인 모달 창 처리
    await page.waitForSelector(".bootstrap-dialog-footer-buttons");
    const confirmButtonList = await page.$$(
      ".bootstrap-dialog-footer-buttons > button"
    );

    for (let i = 0; i < confirmButtonList.length; i++) {
      const buttonText = await page.evaluate(
        el => el.innerText,
        confirmButtonList[i]
      );
      this.logger.debug(`버튼 텍스트 ${buttonText}`);
      if (buttonText === "확인") {
        await confirmButtonList[i].evaluate(el => el.click());
        break;
      }
    }
    // 에러인지 성공인지 Dialog 창으로 확인해야하는데 실패함

    await browser.close();
  }

  // 주중 아침 7시 30분에 실행
  @Cron("0 30 7 * * 1-5", {
    name: "autoMeal",
    timeZone: "Asia/Seoul"
  })
  // @Cron("*/30 * * * * 1-5", {
  //   name: "autoMeal",
  //   timeZone: "Asia/Seoul"
  // })
  async handleCron() {
    const meals = await this.mealModel.find({}).exec();

    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i];
      const { loginId, loginPassword, mealType, wantToReserve } = meal;
      this.run({ loginId, loginPassword, mealType, wantToReserve });
    }
  }
}
