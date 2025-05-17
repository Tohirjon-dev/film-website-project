import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(4, 100)
  username: string;
  @IsString()
  @Length(4, 100)
  @IsNotEmpty()
  email: string;
  @IsString()
  @Length(4, 16)
  @IsNotEmpty()
  password: string;
}
