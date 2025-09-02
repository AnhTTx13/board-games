import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserMiddleware } from './shared/middlewares/user.middleware';
import { TokenModule } from './shared/modules/token/token.module';
import { CaroGateway } from './caro/caro.gateway';
import { UserEntity } from './shared/entities/user.entity';
import { ViewModule } from './view/view.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'super_secret', // Developement only
    }),

    /* enalble if use local postgres database, disable if use docker compose */
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5433, // Postgres's port on your local machine
    //   username: 'xbro', // Your Postgres's username
    //   password: '123', // Your Postgres's password
    //   database: 'retro_legends_database', // Create a Postgres database and place its name here
    //   entities: [UserEntity],
    //   synchronize: true, // Developement only
    // }),

    /* enable if use docker compose, disable if use local postgres database */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database', // Postgres's service name (check the 'docker-compose.yaml' file)
      port: 5432, // Postgres's internal port
      username: 'xbro', // Developement only
      password: '123', // Developement only
      database: 'retro_legends_database',
      entities: [UserEntity],
      synchronize: true, // Developement only
    }),

    RouterModule.register([
      {
        path: '/',
        module: ViewModule,
      },
      {
        path: 'api',
        children: [
          {
            path: 'user',
            module: UserModule,
          },
        ],
      },
    ]),
    TokenModule,
    UserModule,
    ViewModule,
  ],
  controllers: [],
  providers: [CaroGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('/');
  }
}
