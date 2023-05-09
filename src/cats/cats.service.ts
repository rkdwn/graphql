import { BaseFilter } from "@/common/base.filter";
import { BaseService } from "@/common/base.service";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cats, CatsDocument } from "./cats.entity";
import { CAT_FILTER } from "./cats.filter";
import { DeleteCatInput } from "./dto/delete-cat.dto";
import { SearchCatInput } from "./dto/search-cat.dto";
import { UpdateCatInput } from "./dto/update-cat.dto";

@Injectable()
export class CatsService extends BaseService<
  Cats,
  UpdateCatInput,
  DeleteCatInput,
  SearchCatInput
> {
  constructor(
    @InjectModel(Cats.name)
    private readonly catModel: Model<CatsDocument>,
    @Inject(CAT_FILTER)
    filter: BaseFilter<SearchCatInput>
  ) {
    super(Cats, catModel, ["id"], filter);
  }
}
