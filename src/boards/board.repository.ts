import { Repository } from 'typeorm'; // install typeorm@0.2
import { Injectable } from '@nestjs/common';
import { Board } from './board.entitiy';

@Injectable()
export class BoardRepository extends Repository<Board> {}
