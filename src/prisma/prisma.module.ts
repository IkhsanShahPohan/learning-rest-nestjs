import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Membuat module ini tersedia di semua module tanpa perlu import ulang
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Menjadikan PrismaService bisa digunakan di luar module ini
})
export class PrismaModule {}
