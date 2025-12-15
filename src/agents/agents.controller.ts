import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { ApiBody } from "@nestjs/swagger";
import { CreateAgentSwaggerDto } from "./dto/swagger/create-agent.swagger.dto";
import { UpdateAgentSwaggerDto } from "./dto/swagger/update-agent.swagger.dto";
import { CreateAgentSchema } from './dto/create-agent.dto';
import { UpdateAgentSchema } from './dto/update-agent.dto';
import { QueryAgentsSchema } from "./dto/query-agents.dto";

import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import type { CreateAgentDto } from './dto/create-agent.dto';
import type { UpdateAgentDto } from './dto/update-agent.dto';
import type { QueryAgentsDto } from "./dto/query-agents.dto";

import { AgentResponseDto } from './dto/response/agent-response.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) { }

  @Post()
  @ApiBody({ type: CreateAgentSwaggerDto })
  async create(
    @Body(new ZodValidationPipe(CreateAgentSchema)) createAgentDto: CreateAgentDto,
  ) {
    const agent = await this.agentsService.create(createAgentDto);
    return { message: "Agent created successfully", data: AgentResponseDto.from(agent) };
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(QueryAgentsSchema)) query: QueryAgentsDto,
  ) {
    const agents = await this.agentsService.findAll(query);
    return { data: agents.items.map(AgentResponseDto.from) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const agent = await this.agentsService.findOne(id);
    return { data: AgentResponseDto.from(agent) };
  }

  @Patch(':id')
  @ApiBody({ type: UpdateAgentSwaggerDto })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAgentSchema)) updateAgentDto: UpdateAgentDto,
  ) {
    const agent = await this.agentsService.update(id, updateAgentDto);
    return { message: "Agent updated successfully", data: AgentResponseDto.from(agent) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const agent = await this.agentsService.remove(id);
    return { message: "Agent deleted successfully" };
  }
}
