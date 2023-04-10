import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { Board } from 'src/boards/board.entitiy';

const dbConfig: {
  [Key: string]: string;
} = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type as any,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: parseInt(process.env.RDS_PORT) || parseInt(dbConfig.port),
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  // entities: [Board, __dirname + '/../**/*.entity.{js,ts}'],
  autoLoadEntities: true,
  synchronize: !!dbConfig.synchronize,
};
