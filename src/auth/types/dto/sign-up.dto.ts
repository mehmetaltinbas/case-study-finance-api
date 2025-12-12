import { IsNotEmpty, IsOptional } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    readonly userName!: string;

    @IsNotEmpty()
    readonly password!: string;

    @IsOptional()
    readonly firstName!: string;

    @IsOptional()
    readonly lastName!: string;
}
