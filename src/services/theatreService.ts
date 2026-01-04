import { Theatre } from "../generated/prisma/client";
import TheatreRepository from "../repositories/theatreRepository";

interface CreateTheatreData {
  name: string;
  location: string;
  city: string;
  totalSeats: number;
}

interface UpdateTheatreData {
  name?: string | undefined;
  location?: string | undefined;
  city: string | undefined;
  totalSeats: number | undefined;
}

export default class TheatreService {
  private theatreRepository: TheatreRepository;
  constructor() {
    this.theatreRepository = new TheatreRepository();
  }

  async createTheatre(data: CreateTheatreData): Promise<Theatre> {
    return await this.theatreRepository.create(data);
  }

  async getAllTheatres(city?: string): Promise<Theatre[]> {
    if (city) {
      return await this.theatreRepository.findByCity(city);
    }
    return await this.theatreRepository.findAll();
  }

  async getTheatreById(id: string): Promise<Theatre | null> {
    return await this.theatreRepository.findById(id);
  }

  async getTheatreWithShows(id: string): Promise<Theatre | null> {
    return await this.theatreRepository.findWithShows(id);
  }

  async updateTheatre(id: string, data: UpdateTheatreData): Promise<Theatre> {
    return await this.theatreRepository.update(id, data);
  }

  async deleteTheatre(id: string): Promise<boolean> {
    return await this.theatreRepository.delete(id);
  }
}
