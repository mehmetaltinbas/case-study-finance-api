import { IsNotEmpty } from "class-validator";

export class CreateInstallmentDto {
    @IsNotEmpty()
    readonly creditId!: number;

    @IsNotEmpty()
    readonly status!: number;

    @IsNotEmpty()
    readonly amount!: number;

    @IsNotEmpty()
    readonly dueDate!: Date;
}