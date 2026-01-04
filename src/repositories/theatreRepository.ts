import { Theatre } from "../generated/prisma/client";
import BaseRepository from "./baseRepository";

export default class TheatreRepository extends BaseRepository<Theatre> {
  constructor() {
    super("theatre");
  }

  async findByName(name: string): Promise<Theatre | null> {
    return await this.findOne({ name });
  }

  async findByCity(city: string): Promise<Theatre[]> {
    return await this.findAll({ where: { city } });
  }

  async findWithShows(id: String): Promise<Theatre | null> {
    return await this.findOne(
      { id },
      {
        include: {
          shows: {
            include: {
              movie: true,
            },
            orderBy: {
              showTime: "asc",
            },
          },
        },
      }
    );
  }
}
