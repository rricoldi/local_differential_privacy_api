import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/entity/location';
import { Repository } from 'typeorm';
import { LocationDto } from './dto/add-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  p = 0.95;
  q = 0.05;

  async addLocation(addLocationDto: LocationDto, userId: number) {
    return this.locationRepository.save({
      ...addLocationDto,
      perturbedResponse: addLocationDto.perturbedResponse.join(','),
      user: {
        id: userId,
      },
    });
  }

  async aggregateCount() {
    const locations = await this.locationRepository.find();

    // peega todos os vetores perturbados do usuário
    const responses = locations.map((location) =>
      location.perturbedResponse.split(',').map((value) => Number(value)),
    );

    // Soma as posições dos vetores com o reduce, de forma que obtem o count de cada posição do vetor.
    const sums = responses.reduce(
      (r, a) => a.map((b, i) => (r[i] || 0) + b),
      [],
    );

    // Usa a função de agregação, levando em conta o número de respostas, o q e o p para diminuir o erro dos counts.
    return sums.map((sum) => {
      const aggregatedCount = Math.round(
        (sum - locations.length * this.q) / (this.p - this.q),
      );

      return aggregatedCount > 0 ? aggregatedCount : 0;
    });
  }
}
