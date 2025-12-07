import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query } from '@nestjs/common';
import { AgentsService } from './agents.service';
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
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateAgentSchema))
  async create(@Body() createAgentDto: CreateAgentDto) {
    const agent = await this.agentsService.create(createAgentDto);
    return { message: "Agent created successfully", data: AgentResponseDto.from(agent) };
  }

  @Get()
  @UsePipes(new ZodValidationPipe(QueryAgentsSchema))
  async findAll(@Query() query: QueryAgentsDto) {
    const agents = await this.agentsService.findAll(query);
    return { data: agents.items.map(AgentResponseDto.from) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const agent = await this.agentsService.findOne(id);
    return { data: AgentResponseDto.from(agent) };
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateAgentSchema))
  async update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    const agent = await this.agentsService.update(id, updateAgentDto);
    return { message: "Agent updated successfully", data: AgentResponseDto.from(agent) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const agent = await this.agentsService.remove(id);
    return { message: "Agent deleted successfully" };
  }
}
