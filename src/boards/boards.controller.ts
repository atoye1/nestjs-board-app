import { Controller, Get, Post, Body } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.model';
import { createBoardDto } from './dto/create-board.dto';

@Controller('boards') // 기본 라우팅
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get('/') // 추가 라우팅
  getAllBoards(): Board[] {
    return this.boardsService.getAllBoards();
  }

  @Post('/')
  createBoard(@Body() createBoardDto: createBoardDto): Board {
    return this.boardsService.createBoard(createBoardDto);
  }
}
