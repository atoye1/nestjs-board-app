import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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

  @Get('/:id')
  getBoardById(@Param('id') id: string): Board {
    return this.boardsService.getBoardById(id);
  }

  @Get('/:id/:alias')
  getIdAndAlias(@Param() params: string[]) {
    return params;
  }

  @Post('/')
  createBoard(@Body() createBoardDto: createBoardDto): Board {
    return this.boardsService.createBoard(createBoardDto);
  }
}
