import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}

export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}
