import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { QueryAgentsDto } from "./dto/query-agents.dto";
import { AgentModel } from "./schemas/agent.schema";

@Injectable()
export class AgentsService {
  async create(createAgentDto: CreateAgentDto) {
    const exists = await AgentModel.findOne({ email: createAgentDto.email });
    if (exists) throw new BadRequestException("Agent with this email already exists");

    const agent = await AgentModel.create(createAgentDto);
    return agent;
  }

  async findAll(query: QueryAgentsDto) {
    const { page, limit, search, agencyId } = query;

    const skip = (page - 1) * limit;

    const filter: any = {
      ...(agencyId ? { agencyId } : {}),
      ...(search
        ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
        : {}),
    };

    const items = await AgentModel.find(filter)
      .populate("agencyId")
      .skip(skip)
      .limit(limit);

    const total = await AgentModel.countDocuments(filter);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const agent = await AgentModel
      .findById(id)
      .populate("agencyId");

    if (!agent) throw new NotFoundException("Agent not found");
    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto) {
    const agent = await AgentModel.findById(id);
    if (!agent) throw new NotFoundException("Agent not found");

    if (updateAgentDto.email && updateAgentDto.email !== agent.email) {
      const emailExists = await AgentModel.findOne({ email: updateAgentDto.email });
      if (emailExists) throw new BadRequestException("Email already in use by another agent");
    }

    Object.assign(agent, updateAgentDto);
    return await agent.save();
  }

  async remove(id: string) {
    const agent = await AgentModel.findById(id);
    if (!agent) throw new NotFoundException("Agent not found");
    await AgentModel.deleteOne({ _id: id });
    return true;
  }
}
