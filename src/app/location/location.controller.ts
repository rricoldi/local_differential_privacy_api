import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LocationDto } from './dto/add-location.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('/:userId')
  async addLocation(
    @Body() addLocationDto: LocationDto,
    @Param('userId') userId: number,
  ) {
    return this.locationService.addLocation(addLocationDto, userId);
  }

  @Get('/statistics/count')
  async aggregateCount() {
    return this.locationService.aggregateCount();
  }
}
