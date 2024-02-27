import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatModule } from "./cats/cats.module";
import { MongooseModule } from "@nestjs/mongoose";
import { mongooseConfig } from "./configs/mongoose.config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { graphqlConfig } from "./configs/graphql.config";
import { APP_PIPE } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { MealModule } from "./meal/meal.module";
import { TaskModule } from "./tasks/task.module";
import { StorageModule } from "./common/storage/storage.module";
import { TestModule } from "./test/test.module";
import { FilesModule } from "./files/files.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync(mongooseConfig),
    StorageModule,
    TaskModule,
    CatModule,
    UserModule,
    MealModule,
    FilesModule,
    TestModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>(graphqlConfig)
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({ transform: true });
      }
    }
  ]
})
export class AppModule {}
