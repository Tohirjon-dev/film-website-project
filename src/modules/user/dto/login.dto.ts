import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(4, 100)
  @IsNotEmpty()
  email: string;
  @IsString()
  @Length(4, 16)
  @IsNotEmpty()
  password: string;
}
