import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cats, CatsSchema } from "./cats.entity";
import { CatsService } from "./cats.service";
import { CatsResolver } from "./cats.resolver";
import { CAT_FILTER, CatFilter } from "./cats.filter";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cats.name, schema: CatsSchema, collection: Cats.name }
    ])
  ],
  providers: [
    CatsResolver,
    CatsService,
    { provide: CAT_FILTER, useClass: CatFilter }
  ],
  exports: [CatsService]
})
export class CatModule {}
