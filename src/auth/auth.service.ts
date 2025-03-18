import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException('Your email or password Invalid!');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Your email or password Invalid!');
    }

    const payload = { id: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  hai(): string {
    return 'Hello From DorixelKeport!';
  }
}
