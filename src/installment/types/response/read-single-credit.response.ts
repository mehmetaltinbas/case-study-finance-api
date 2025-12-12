import { Credit } from "generated/prisma/client";
import { ResponseBase } from "src/shared/response-base";

export interface ReadSingleCreditResponse extends ResponseBase {
    credit?: Credit;
}
