import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const { name, email, password } = dto;

    // Cek apakah email sudah digunakan
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar!');
    }

    const hashPassword = await this.hashPassword(password);

    // Save
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    // Hapus password sebelum dikembalikan
    const { password: _, ...userWithoutPassword } = user;

    return { message: 'User created!', user: userWithoutPassword };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  hai(): string {
    return 'Hello From DorixelKeport!';
  }
}
