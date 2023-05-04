import { Inject, Injectable } from "@nestjs/common";
import { Cats, CatsDocument } from "./cats.entity";
import { BaseService } from "@/common/base.service";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateCatInput } from "./dto/update-cat.dto";
import { DeleteCatInput } from "./dto/delete-cat.dto";
import { BaseFilter } from "@/common/base.filter";
import { SearchCatInput } from "./dto/search-cat.dto";
import { CAT_FILTER } from "./cats.filter";

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
    super(Cats, catModel, filter);
  }
}
