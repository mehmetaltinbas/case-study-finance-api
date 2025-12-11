import { IsNotEmpty } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    readonly userName!: string;

    @IsNotEmpty()
    readonly password!: string;

    @IsNotEmpty()
    readonly firstName!: string;

    @IsNotEmpty()
    readonly lastName!: string;
}
