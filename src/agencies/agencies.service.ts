import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import type { CreateAgencyDto } from './dto/create-agency.dto';
import type { UpdateAgencyDto } from './dto/update-agency.dto';
import type { QueryAgenciesDto } from './dto/query-agencies.dto';

import { AgencyModel } from "./schemas/agency.schema";
import { AgentModel } from "../agents/schemas/agent.schema";

@Injectable()
export class AgenciesService {
  async create(dto: CreateAgencyDto) {
    const exists = await AgencyModel.findOne({ name: dto.name });
    if (exists) {
      throw new BadRequestException("Agency name already exists");
    }

    return await AgencyModel.create(dto);
  }

  async findAll(query: QueryAgenciesDto) {
    const { page, limit, name, email } = query;

    const skip = (page - 1) * limit;

    const filter: any = {
      ...(name ? { name: { $regex: name, $options: "i" } } : {}),
      ...(email ? { officeEmail: email } : {}),
    };

    const items = await AgencyModel.find(filter)
      .skip(skip)
      .limit(limit)

    const total = await AgencyModel.countDocuments(filter);

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
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new NotFoundException("Agency not found");
    return agency;
  }

  async update(id: string, dto: UpdateAgencyDto) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new NotFoundException("Agency not found");

    // name unique kontrolü
    if (dto.name) {
      const exists = await AgencyModel.findOne({ name: dto.name, _id: { $ne: id } });
      if (exists) throw new BadRequestException("Another agency with this name already exists");
    }

    Object.assign(agency, dto);
    await agency.save();

    return agency;
  }

  // DELETE (AGENCY CAN'T BE DELETED IF AGENTS EXIST)
  async remove(id: string) {
    const agency = await AgencyModel.findById(id);
    if (!agency) throw new NotFoundException("Agency not found");

    // Business rule: bağlı agent varsa silinemez
    const agentCount = await AgentModel.countDocuments({ agencyId: id });

    if (agentCount > 0) {
      throw new BadRequestException(
        `Agency cannot be deleted because ${agentCount} agent(s) are assigned`
      );
    }

    await AgencyModel.deleteOne({ _id: id });
    return true;
  }
}
