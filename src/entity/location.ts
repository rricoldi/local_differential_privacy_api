import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  latitude: number;

  @Column({ type: 'real' })
  longitude: number;

  @Column()
  country: string;

  @Column()
  perturbedResponse: string;

  @ManyToOne(() => User, (user) => user.locations)
  user: User;

  constructor(data: Partial<Location>) {
    Object.assign(this, data);
  }
}
