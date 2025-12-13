import { Credit } from "generated/prisma/client";
import { ResponseBase } from "src/shared/types/response-base";

export interface ReadMultipleCreditsResponse extends ResponseBase {
    credits?: Credit[];
}
