import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';


export class CreateGroupPermissionDto {
  @IsBoolean()
  create = false;

  @IsBoolean()
  read = false;

  @IsBoolean()
  delete = false;

  @IsBoolean()
  update = false;
}
