import { IsNotEmpty, IsNumber } from "class-validator";

export class PayInstallmentDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id!: number;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    readonly amount!: number;
}
