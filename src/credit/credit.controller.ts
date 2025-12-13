// eslint-disable-next-line no-redeclare
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import User from 'src/auth/decorators/user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { CreditService } from 'src/credit/credit.service';
import { FilterCriteriaDomain } from 'src/credit/types/domain/filter-criteria.domain';
import { CreateCreditDto } from 'src/credit/types/dto/create-credit.dto';
import { ReadMultipleCreditsFilterCriteriaDto } from 'src/credit/types/dto/read-multiple-credits-filter-criteria.dto';
import { ReadMultipleCreditsResponse } from 'src/credit/types/response/read-multiple-credits.response';
import { ResponseBase } from 'src/shared/response-base';

@Controller('credit')
@UseGuards(RolesGuard)
export class CreditController {
    constructor(private creditService: CreditService) {}


    @Post('create')
    @Roles([Role.admin])
    @ApiOperation({
        description: 'Allowed role(s): admin',
    })
    async create(@Body() createCreditDto: CreateCreditDto): Promise<ResponseBase> {
        return await this.creditService.create(createCreditDto);
    }

    @Get('read-all-by-user-id')
    @Roles([Role.customer])
    @ApiOperation({
        description: 'Allowed role(s): customer',
    })
    async readAllByUserIdForCustomer(@User() user: JwtPayload, @Query() readMultipleCreditsFilterCriteriaDto: ReadMultipleCreditsFilterCriteriaDto): Promise<ReadMultipleCreditsResponse> {
        console.log(readMultipleCreditsFilterCriteriaDto);
        const filterCriteriaDomain: FilterCriteriaDomain = {
            status: readMultipleCreditsFilterCriteriaDto.status,
            createdAt: readMultipleCreditsFilterCriteriaDto.createdAt ? new Date(readMultipleCreditsFilterCriteriaDto.createdAt) : undefined
        };
        return await this.creditService.readAllByUserId(user.sub, filterCriteriaDomain);
    }

    @Get('read-all-by-user-id/:userId')
    @Roles([Role.admin])
    @ApiOperation({
        description: 'Allowed role(s): admin',
    })
    async readAllByUserIdForAdmin(@Param('userId') userId: number, @Query() readMultipleCreditsFilterCriteriaDto: ReadMultipleCreditsFilterCriteriaDto): Promise<ReadMultipleCreditsResponse> {
        const filterCriteriaDomain: FilterCriteriaDomain = {
            status: readMultipleCreditsFilterCriteriaDto.status,
            createdAt: readMultipleCreditsFilterCriteriaDto.createdAt ? new Date(readMultipleCreditsFilterCriteriaDto.createdAt) : undefined
        };
        return await this.creditService.readAllByUserId(userId, filterCriteriaDomain);
    }
}
