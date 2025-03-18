import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MinLength(10)
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
