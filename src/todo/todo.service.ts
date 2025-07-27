import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Todo } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

interface CreateTodoInput {
  title: string;
  completed?: boolean;
  userId: number;
}

interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<Todo[]> {
    return await this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Todo | null> {
    return await this.prisma.todo.findFirst({
      where: { 
        id,
        userId,
      },
    });
  }

  async create(todo: CreateTodoInput): Promise<Todo> {
    if (!todo.title || todo.title.trim() === '') {
      throw new BadRequestException('Title is required');
    }

    return await this.prisma.todo.create({
      data: {
        title: todo.title.trim(),
        completed: todo.completed ?? false,
        userId: todo.userId,
      },
    });
  }

  async update(id: number, updates: UpdateTodoInput, userId: number): Promise<Todo | null> {
    // Check if todo belongs to user
    const existingTodo = await this.findOne(id, userId);
    if (!existingTodo) {
      throw new ForbiddenException('Todo not found or access denied');
    }

    const updateData: any = {};
    
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim() === '') {
        throw new BadRequestException('Title cannot be empty');
      }
      updateData.title = updates.title.trim();
    }
    
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed;
    }

    return await this.prisma.todo.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number, userId: number): Promise<Todo | null> {
    // Check if todo belongs to user
    const existingTodo = await this.findOne(id, userId);
    if (!existingTodo) {
      throw new ForbiddenException('Todo not found or access denied');
    }

    return await this.prisma.todo.delete({
      where: { id },
    });
  }
}
