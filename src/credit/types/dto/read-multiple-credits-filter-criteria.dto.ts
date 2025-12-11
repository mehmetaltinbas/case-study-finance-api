import { Type } from "class-transformer";
import { IsDateString, IsIn, IsInt, IsOptional } from "class-validator";
import { CreditStatus } from "src/credit/types/enums/credit-status.enum";

export class ReadMultipleCreditsFilterCriteriaDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsIn([0, 1])
    readonly status?: CreditStatus;

    @IsOptional()
    @IsDateString()
    readonly createdAt?: string;
}
