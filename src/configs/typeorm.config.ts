import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Board } from 'src/boards/board.entitiy';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'board-app',
  // entities: [Board, __dirname + '/../**/*.entity.{js,ts}'],
  autoLoadEntities: true,
  synchronize: true,
};
