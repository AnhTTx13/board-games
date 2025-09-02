import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({
    type: 'text',
    nullable: false,
  })
  email: string;

  @Index({ unique: true })
  @Column({
    type: 'text',
    nullable: false,
  })
  username: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  nickname: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  age?: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  auth_token?: string | null;
}
