import {
  Logger,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Board } from './board.entitiy';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { createBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entitiy';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('boards') // 기본 라우팅
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('Board Controller');
  constructor(private boardsService: BoardsService) {}

  @Get()
  getAllBoards(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`);
    return this.boardsService.getAllBoards(user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: createBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `User ${user.username} is creating board with Payload:${JSON.stringify(
        createBoardDto,
      )}`,
    );
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete('/:id')
  deleteBoard(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardsService.deleteBoardById(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status);
  }
}
