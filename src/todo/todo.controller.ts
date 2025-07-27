import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from 'generated/prisma/client';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../auth/guards/casl.guard';
import { Casl } from '../auth/decorators/casl.decorator';
import { Action } from '../auth/casl/ability.factory';

@Controller('todos')
@UseGuards(JwtAuthGuard, CaslGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @Casl({ action: Action.Read, subject: 'Todo' })
  async findAll(@Request() req): Promise<Todo[]> {
    return await this.todoService.findAll(req.user.userId);
  }

  @Get(':id')
  @Casl({ action: Action.Read, subject: 'Todo' })
  async findOne(@Param('id') id: string, @Request() req): Promise<Todo> {
    const todo = await this.todoService.findOne(+id, req.user.userId);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Post()
  @Casl({ action: Action.Create, subject: 'Todo' })
  async create(@Body() body: CreateTodoDto, @Request() req): Promise<Todo> {
    return await this.todoService.create({
      ...body,
      userId: req.user.userId,
    });
  }

  @Put(':id')
  @Casl({ action: Action.Update, subject: 'Todo' })
  async update(
    @Param('id') id: string,
    @Body() updates: UpdateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    const todo = await this.todoService.update(+id, updates, req.user.userId);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Delete(':id')
  @Casl({ action: Action.Delete, subject: 'Todo' })
  async delete(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
    const todo = await this.todoService.delete(+id, req.user.userId);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return { message: `Todo with ID ${id} has been deleted` };
  }
}
