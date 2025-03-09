import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const { name, email, password } = dto;

    // Cek apakah email sudah digunakan
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar!');
    }

    const hashPassword = await bcrypt.hash(password, 10);

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
    return userWithoutPassword;
  }

  hai(): string {
    return 'Hello From DorixelKeport!';
  }
}
