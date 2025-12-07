import { Injectable } from '@nestjs/common';
import mongoose from "mongoose";

@Injectable()
export class AppService {
  getHealth() {
    const dbStates: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: dbStates[mongoose.connection.readyState] ?? "unknown",
    };
  }
}
