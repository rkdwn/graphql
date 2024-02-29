import { All, Controller, Get, Post, Request, Response } from "@nestjs/common";
import { Response as Res, Request as Req } from "express";
import { BotService } from "./bot.service";
import { ConfigService } from "@nestjs/config";
import { MealDocument } from "@/meal/meal.entity";

@Controller("/bot")
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly configService: ConfigService
  ) {}

  @Post("/")
  async getReserveResult(@Request() req: Req, @Response() res: Res) {
    const response = req.body;

    // 해당 정보는 사용자 별 고유한 값임
    const botUserId = response.userRequest.user.id;

    let responseBody = {};
    const meal: MealDocument = await this.botService.checkBotUserId(botUserId);
    // 새로운 카톡계정 일 경우
    if (!meal) {
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              textCard: {
                title: "등록된 계정 정보가 없군요!",
                buttons: [
                  {
                    label: "등록 해 주세요",
                    action: "message",
                    messageText: "등록 해 주세요"
                  }
                ]
              }
            }
          ]
        }
      };
      res.header("Content-Type", "application/json");
      return res.status(200).send(responseBody);
    }

    if (meal.loginId) {
      const bucketUrl = `https://minio.${this.configService.get(
        "HOST_URL"
      )}/meals/${meal.loginId}.pdf`;
      // TODO: 파일을 전송하는 방법을 찾아야 함
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              basicCard: {
                title: `반가워요, ${meal.name} 님!`,
                description: `예약 현황은 아래 버튼을 눌러 확인해 주세요`,
                thumbnail: {
                  imagUrl: `https://minio.${this.configService.get(
                    "HOST_URL"
                  )}/meals/vatech.png`
                },
                buttons: [
                  {
                    action: "webLink",
                    label: "두구두구",
                    webLinkUrl: bucketUrl
                  }
                ]
              }
            }
          ]
        }
      };
    }
    res.header("Content-Type", "application/json");
    return res.status(200).send(responseBody);
  }

  @Post("/regist")
  async regitUserId(@Request() req: Req, @Response() res: Res) {
    const request = req.body;
    const botUserId = request.userRequest.user.id;
    const loginId: string = request.action.params.userId;

    let responseBody = {};
    const result = await this.botService.registUserId(
      loginId.toLowerCase(),
      botUserId
    );

    if (result) {
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              textCard: {
                title: "등록 되었어요!",
                description: "바로 예약 현황을 알아 봐요",
                buttons: [
                  {
                    label: "예약 현황 보기",
                    action: "message",
                    messageText: "예약 확인"
                  }
                ]
              }
            }
          ]
        }
      };
    } else {
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              textCard: {
                title: "등록에 실패했어요!",
                description:
                  "입력한 사번으로 가입된 정보가 없는 것 같아요. 서비스 가입을 하지 않았다면 회원가입을 먼저 해주세요!",
                buttons: [
                  {
                    label: "다시 등록하기",
                    action: "message",
                    messageText: "계정 등록하기"
                  },
                  {
                    label: "회원가입 하기",
                    action: "webLink",
                    webLinkUrl: "https://dev.23alice.duckdns.org"
                  }
                ]
              }
            }
          ]
        }
      };
    }
    res.header("Content-Type", "application/json");
    return res.status(200).send(responseBody);
  }

  @Post("/reset")
  async resetAccount(@Request() req: Req, @Response() res: Res) {
    const request = req.body;
    const botUserId = request.userRequest.user.id;

    let responseBody = {};
    const result = await this.botService.checkBotUserId(botUserId);

    console.log(`초기화 진행합니다. ${result.loginId}`);
    if (result) {
      const resetResult = await this.botService.resetUser(botUserId);
      if (resetResult) {
        responseBody = {
          version: "2.0",
          template: {
            outputs: [
              {
                textCard: {
                  title: "초기화 되었어요!",
                  description: "계정을 다시 등록해 주세요",
                  buttons: [
                    {
                      label: "계정 등록하기",
                      action: "message",
                      messageText: "계정 등록하기"
                    }
                  ]
                }
              }
            ]
          }
        };
      } else {
        responseBody = {
          version: "2.0",
          template: {
            outputs: [
              {
                textCard: {
                  title: "초기화에 실패했어요!",
                  description: "뭔가 문제가 생겼어요ㅠㅠ 다시 시도 해 주세요",
                  buttons: [
                    {
                      label: "다시 시도하기",
                      action: "message",
                      messageText: "초기화"
                    }
                  ]
                }
              }
            ]
          }
        };
      }
    } else {
      responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              textCard: {
                title: "초기화에 실패했어요!",
                description:
                  "등록 된 계정 정보가 없는 것 같아요! 계정 등록을 진행 해 주세요!",
                buttons: [
                  {
                    label: "계정 등록하기",
                    action: "message",
                    messageText: "계정 등록하기"
                  }
                ]
              }
            }
          ]
        }
      };
    }
    res.header("Content-Type", "application/json");
    return res.status(200).send(responseBody);
  }
}
