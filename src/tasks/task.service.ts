import { StorageService } from "@/common/storage/storage.service";
import { FilesService } from "@/files/files.service";
import { Meal, MealDocument } from "@/meal/meal.entity";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { Model } from "mongoose";
import path from "path";
import puppeteer from "puppeteer";

type ReserveDataType = {
  name: string;
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
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
    private readonly filesService: FilesService
  ) {}
  private readonly logger = new Logger(TaskService.name);

  private async reserve(props: ReserveDataType) {
    const PDF_PATH = path.join(__dirname, "..", "..", "./pdf");

    const { name, loginId, loginPassword, mealType, wantToReserve } = props;
    if (!wantToReserve) return;

    const browser = await puppeteer.launch({
      headless: true,
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

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    try {
      await page.waitForSelector("div > .panel-footer", {
        timeout: 1000
      });
    } catch (err) {
      const panelBody = await page.waitForSelector("div > .panel-body");
      const _panelText = await panelBody.evaluate(el => el.textContent);

      if (_panelText.includes("없습니다")) {
        this.logger.error(`${name}님 예약 불가능 상황, 재시도 합니다.`);
        browser.close();
        throw new Error("예약 불가능 상황");
      }
      // 로그인 실패한 경우도 여기 포함
      this.logger.error(`${name}님 로그인 실패, 계정정보 ${loginId}`);
      browser.close();
      throw new Error("로그인 실패");
    }

    if (mealType === "A") {
      this.logger.debug(`${name}님, A코스 예약 시도`);
      const _mealA = await page.waitForSelector("button[data-course-code='A']");

      await _mealA.evaluate(el => el.click());
    }
    if (mealType === "B") {
      this.logger.debug(`${name}님, B코스 예약 시도`);
      const _mealB = await page.waitForSelector("button[data-course-code='B']");

      const _text = await page.evaluate(el => el.innerText, _mealB);
      if (_text.split(":")[1] === "0") {
        this.logger.error("B 코너 잔여 수량이 없습니다. 예약을 종료합니다.");
        return;
      }

      await _mealB.evaluate(el => el.click());
    }

    if (mealType === "C") {
      this.logger.debug(`${name}님, C코스 예약 시도`);
      const _mealC = await page.waitForSelector("button[data-course-code='C']");

      const _text = await page.evaluate(el => el.innerText, _mealC);
      if (_text.split(":")[1] === "0") {
        this.logger.error("C 코너 잔여 수량이 없습니다. 예약을 종료합니다.");
        return;
      }
      await _mealC.evaluate(el => el.click());
    }

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
      if (buttonText === "확인") {
        await confirmButtonList[i].evaluate(el => el.click());
        this.logger.debug(`${name}님, 예약 ${buttonText} 버튼 누름!`);
        break;
      }
    }

    // 에러인지 성공인지 확인
    await page.evaluate(() => {
      location.reload();
    });

    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 90000 });

    await page.waitForSelector("div > .panel-footer");
    const resultButtonList = await page.$$(".panel-footer > button");

    for (let i = 0; i < resultButtonList.length; i++) {
      // 페이지에 총 [A, B, C, 식사안함] 버튼이 존재하고, 예약 상황에따라 display 속성값이 다름.
      const buttonStyle = await page.evaluate(el => {
        const style = getComputedStyle(el);
        return {
          text: el.innerText,
          visible:
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0"
        };
      }, resultButtonList[i]);

      if (buttonStyle.text === "식사 안함" && buttonStyle.visible) {
        this.logger.debug(`${name}님 예약 완료 되었습니다.`);
      }
      if (buttonStyle.text === "식사 안함" && !buttonStyle.visible) {
        this.logger.debug(`${name}님 예약 실패 되었습니다.`);
      }
    }

    // 결과 PDF 캡쳐 파일 생성
    // await page.pdf({ format: "A4", path: `${PDF_PATH}/${loginId}.pdf` });
    // console.log("make pdf done!");
    // this.storageService.putObject(
    //   "meal",
    //   `${loginId}.pdf`,
    //   `${PDF_PATH}/${loginId}.pdf`
    // );

    await browser.close();
  }

  // @Cron("*/10 * * * * *", {
  //   name: "captureTest",
  //   timeZone: "Asia/Seoul"
  // })
  async minioTest() {
    this.captureTest();
  }

  async captureTest() {
    console.log("captureTest!");
    const loginId = "v13205";
    const loginPassword = "v13205";

    const PDF_PATH = path.join(__dirname, "..", "..", "./pdf");

    const browser = await puppeteer.launch({
      headless: true,
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

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    await page.pdf({ format: "A4", path: `${PDF_PATH}/${loginId}.pdf` });
    console.log("make pdf done!");
    await this.storageService.putObject(
      "meal",
      `${loginId}.pdf`,
      `${PDF_PATH}/${loginId}.pdf`
    );
    browser.close();
  }

  // 주중 아침 7시 30분에 실행
  @Cron("59 29 7 * * 1-5", {
    name: "autoMeal",
    timeZone: "Asia/Seoul"
  })
  // @Cron("*/30 * * * * 1-5", {
  //   name: "autoMeal",
  //   timeZone: "Asia/Seoul"
  // })
  async cronReserve() {
    const meals = await this.mealModel.find({}).exec();

    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i];
      const { name, loginId, loginPassword, mealType, wantToReserve } = meal;
      try {
        await this.reserve({
          name,
          loginId,
          loginPassword,
          mealType,
          wantToReserve
        });
      } catch (e) {
        // one more time~
        await this.reserve({
          name,
          loginId,
          loginPassword,
          mealType,
          wantToReserve
        });
      }
    }
  }
}
