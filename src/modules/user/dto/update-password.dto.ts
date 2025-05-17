import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @Length(4, 16)
  @IsNotEmpty()
  new_password: string;
}
