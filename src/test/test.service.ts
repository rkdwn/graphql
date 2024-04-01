import { StorageService } from "@/common/storage/storage.service";
import { Meal, MealDocument } from "@/meal/meal.entity";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import path from "path";
import puppeteer from "puppeteer";

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Meal.name)
    private readonly mealModel: Model<MealDocument>,
    private readonly configService: ConfigService,
    private readonly storageService: StorageService
  ) {}
  private readonly logger = new Logger(TestService.name);

  // @Cron("*/10 * * * * *", {
  //   name: "captureTest",
  //   timeZone: "Asia/Seoul"
  // })
  async minioTest() {
    this.captureTest();
  }

  async captureTest() {
    const loginId = "v13205";
    const loginPassword = "v13205";

    const test = await this.mealModel.find({});
    console.log(" check all meal data >> ", test);

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
    this.logger.debug("결과 PDF 저장 완료");
    await this.storageService.putObject(
      "meals",
      `${loginId}.pdf`,
      `${PDF_PATH}/${loginId}.pdf`
    );
    await browser.close();
  }

  getHello(): string {
    return "Hello World!";
  }
}
