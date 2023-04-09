import { Controller, Get, Post, Body } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.model';

@Controller('boards') // 기본 라우팅
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get('/') // 추가 라우팅
  getAllBoards(): Board[] {
    return this.boardsService.getAllBoards();
  }

  @Post('/')
  createBoard(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Board {
    console.log(title, description);
    return this.boardsService.createBoard(title, description);
  }
}
