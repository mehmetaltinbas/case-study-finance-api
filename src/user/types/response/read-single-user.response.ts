import { User } from "generated/prisma/client";
import { ResponseBase } from "src/shared/types/response-base";

export interface ReadSingleUserResponse extends ResponseBase {
    user?: User;
}
