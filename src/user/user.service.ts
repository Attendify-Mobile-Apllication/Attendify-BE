import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existing) {
      throw new ConflictException('Username already exists');
    }
    const password = await this.hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password,
    });
    const saved = await this.userRepository.save(user);
    return this.sanitize(saved);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => this.sanitize(user));
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitize(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existing = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existing) {
        throw new ConflictException('Username already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const updated = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
    return this.sanitize(updated);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
    return { deleted: true };
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async resetPassword(username: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!newPassword) {
      throw new BadRequestException('New password is required');
    }
    user.password = await this.hashPassword(newPassword);
    const saved = await this.userRepository.save(user);
    return this.sanitize(saved);
  }

  private async hashPassword(password: string) {
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private sanitize(user: User) {
    // Ensure password never leaves the service layer.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }
}
