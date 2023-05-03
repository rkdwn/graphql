import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatModule } from "./cats/cats.module";
import { MongooseModule } from "@nestjs/mongoose";
import { mongooseConfig } from "./configs/mongoose.config";

@Module({
  imports: [
    CatModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync(mongooseConfig)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
