import { User } from "generated/prisma/client";
import { ResponseBase } from "src/shared/response-base";

export interface ReadSingleUserResponse extends ResponseBase {
    user?: User;
}
