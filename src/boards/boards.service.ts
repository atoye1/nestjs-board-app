import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entitiy';
import { createBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async createBoard(createBoardDto: createBoardDto): Promise<Board> {
    const result = this.boardRepository.create({
      ...createBoardDto,
      status: BoardStatus.PRIVATE,
    });
    return await this.boardRepository.save(result);
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`id ${id} is not exists`);
    return found;
  }
}
