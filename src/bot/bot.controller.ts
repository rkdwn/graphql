import { All, Controller, Get, Post, Request, Response } from "@nestjs/common";
import { Response as Res, Request as Req } from "express";
import { BotService } from "./bot.service";

@Controller("/bot")
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post("/")
  async getReserveResult(@Request() req: Req, @Response() res: Res) {
    // console.log("...?", req);
    const response = req.body;
    const botUserId = response.userRequest.user.id;

    console.log("what?", botUserId);
    const meal = await this.botService.checkBotUserId(botUserId);

    if (!meal) {
      const responseBody = {
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

    const resultStream = await this.botService.getReserveResult(meal.loginId);
    // TODO: 파일을 전송하는 방법을 찾아야 함
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "hello I'm Ryan"
            }
          }
        ]
      }
    };

    res.header("Content-Type", "application/json");
    return res.status(200).send(responseBody);
  }

  @Post("/regist")
  async regitUserId(@Request() req: Req, @Response() res: Res) {
    const request = req.body;
    const botUserId = request.userRequest.user.id;
    const loginId = request.action.params.userId;
    console.log("loginId", loginId, botUserId);
    const result = await this.botService.registUserId(loginId, botUserId);
    console.log("result >>>", result);
    if (result) {
      const responseBody = {
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
                    action: "block",
                    blockId: ""
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
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            textCard: {
              title: "등록에 실패했어요!",
              description: "다시 시도해 주세요",
              buttons: [
                {
                  label: "계정 등록하기",
                  action: "block",
                  blockId: ""
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
}
