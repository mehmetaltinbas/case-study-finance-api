// eslint-disable-next-line no-redeclare
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreditService } from 'src/credit/credit.service';
import { FilterCriteriaDomain } from 'src/credit/types/domain/filter-criteria.domain';
import { CreateCreditDto } from 'src/credit/types/dto/create-credit.dto';
import { ReadMultipleCreditsFilterCriteriaDto } from 'src/credit/types/dto/read-multiple-credits-filter-criteria.dto';
import { CreditStatus } from 'src/credit/types/enums/credit-status.enum';
import { ReadMultipleCreditsResponse } from 'src/credit/types/response/read-multiple-credits.response';
import { ResponseBase } from 'src/shared/response-base';

@Controller('credit')
export class CreditController {
    constructor(private creditService: CreditService) {

    }

    @Post('create')
    async create(@Body() createCreditDto: CreateCreditDto): Promise<ResponseBase> {
        return await this.creditService.create(createCreditDto);
    }

    @Get('read-all-by-user-id/:userId')
    async readAllByUserId(@Param('userId') userId: number, @Query() readMultipleCreditsFilterCriteriaDto: ReadMultipleCreditsFilterCriteriaDto): Promise<ReadMultipleCreditsResponse> {
        const filterCriteriaDomain: FilterCriteriaDomain = {
            status: readMultipleCreditsFilterCriteriaDto.status,
            createdAt: readMultipleCreditsFilterCriteriaDto.createdAt ? new Date(readMultipleCreditsFilterCriteriaDto.createdAt) : undefined
        };
        return await this.creditService.readAllByUserId(userId, filterCriteriaDomain);
    }
}
