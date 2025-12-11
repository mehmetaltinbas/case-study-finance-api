import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class PayInstallmentDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id!: number;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    readonly amountToPay!: number;
}
