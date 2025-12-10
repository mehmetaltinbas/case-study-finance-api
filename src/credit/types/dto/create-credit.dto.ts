import { IsNotEmpty } from "class-validator";

export class CreateCreditDto {
    @IsNotEmpty()
    readonly userId!: number;

    @IsNotEmpty()
    readonly amount!: number;

    @IsNotEmpty()
    readonly installmentCount!: number;
}