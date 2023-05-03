import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";

export const mongooseConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (nestConfigService: ConfigService) => {
    const connectionString =
      "mongodb://" +
      nestConfigService.get("MONGODB_USERNAME") +
      ":" +
      nestConfigService.get("MONGODB_PASSWORD") +
      "@" +
      nestConfigService.get("MONGODB_HOSTNAME") +
      ":" +
      nestConfigService.get("MONGODB_PORT") +
      "/" +
      nestConfigService.get("MONGODB_DATABASE");
    return {
      uri: connectionString,
      useNewUrlParser: true,
      useUnifiedTopology: nestConfigService.get("MONGODB_USE_UNIFIED_TOPOLOGY")
    };
  }
};
