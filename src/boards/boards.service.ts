import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entitiy';
import { createBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entitiy';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async getAllBoards(loginUser: User): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { user: { id: loginUser.id } },
    });
  }

  async createBoard(
    createBoardDto: createBoardDto,
    user: User,
  ): Promise<Board> {
    const result = this.boardRepository.create({
      ...createBoardDto,
      user,
      status: BoardStatus.PRIVATE,
    });
    return await this.boardRepository.save(result);
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`id ${id} is not exists`);
    return found;
  }

  async deleteBoardById(id: number): Promise<void> {
    const result = await this.boardRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    return await this.boardRepository.save(board);
  }
}
