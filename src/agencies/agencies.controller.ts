import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { ApiBody } from "@nestjs/swagger";
import { CreateAgencySwaggerDto } from './dto/swagger/create-agency.swagger.dto';
import { UpdateAgencySwaggerDto } from "./dto/swagger/update-agency.swagger.dto";
import type { CreateAgencyDto } from './dto/create-agency.dto';
import type { UpdateAgencyDto } from './dto/update-agency.dto';
import type { QueryAgenciesDto } from './dto/query-agencies.dto';

import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { CreateAgencySchema } from "./dto/create-agency.dto";
import { UpdateAgencySchema } from "./dto/update-agency.dto";
import { QueryAgenciesSchema } from "./dto/query-agencies.dto";

import { AgencyResponseDto } from "./dto/response/agency-response.dto"; 

@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) { }

  @Post()
  @ApiBody({ type: CreateAgencySwaggerDto })
  @UsePipes(new ZodValidationPipe(CreateAgencySchema))
  async create(@Body() dto: CreateAgencyDto) {
    const agency = await this.agenciesService.create(dto);
    return { message: "Agency created", data: AgencyResponseDto.from(agency) };
  }

  @Get()
  @UsePipes(new ZodValidationPipe(QueryAgenciesSchema))
  async findAll(@Query() query: QueryAgenciesDto) {
    const agencies = await this.agenciesService.findAll(query);
    return { data: agencies.items.map(AgencyResponseDto.from), meta: agencies.meta };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const agency = await this.agenciesService.findOne(id);
    return { data: AgencyResponseDto.from(agency) };
  }

  @Patch(':id')
  @ApiBody({ type: UpdateAgencySwaggerDto })
  @UsePipes(new ZodValidationPipe(UpdateAgencySchema))
  async update(@Param('id') id: string, @Body() dto: UpdateAgencyDto) {
    const updated = await this.agenciesService.update(id, dto);
    return { message: "Agency updated", data: AgencyResponseDto.from(updated) };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.agenciesService.remove(id);
    return { message: "Agency deleted" };
  }
}
