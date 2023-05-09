import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GqlModuleAsyncOptions, GqlOptionsFactory } from "@nestjs/graphql";

export const graphqlConfig: GqlModuleAsyncOptions<
  ApolloDriverConfig,
  GqlOptionsFactory<ApolloDriverConfig>
> = {
  imports: [ConfigModule],
  inject: [ConfigService],
  driver: ApolloDriver,
  useFactory: (nestConfigService: ConfigService) => {
    return {
      installSubscriptionHandlers: true,
      debug: true,
      playground: false, // @nestjs/apollo default playground
      introspection: true,
      autoSchemaFile: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()]
    };
  }
};
