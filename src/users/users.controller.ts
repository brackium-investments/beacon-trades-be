import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ContactUsDto } from './dtos/contactUsDto';
import { ActivateUserDto } from './dtos/activateUserDto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(
    /**
     * injecting the usersService
     */
    private readonly usersService: UsersService,
  ) {}

  @Auth(AuthType.None)
  @UseInterceptors(FilesInterceptor('files'))
  @Post('')
  public createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.usersService.createUser(createUserDto, files);
  }

  @Roles(Role.ADMIN)
  @Get('')
  public getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch('')
  public updateUserProfile(
    @Body() payload: UpdateUserProfileDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.usersService.updateUserProfile(payload, user.sub);
  }

  @Roles(Role.ADMIN)
  @Patch('activate-user')
  public activateUser(@Body() payload: ActivateUserDto) {
    return this.usersService.activateUser(payload.userId);
  }

  @Patch('update-image')
  @UseInterceptors(FileInterceptor('file'))
  public updateUserImage(
    @UploadedFile() file: Express.Multer.File,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.usersService.updateUserImage(file, user.sub);
  }

  @Patch('update-password')
  public updateMyPassword(
    @Body() payload: UpdatePasswordDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.usersService.updatePassword(payload, user.sub);
  }

  @Auth(AuthType.None)
  @Post('contact-us')
  public contactUs(@Body() payload: ContactUsDto) {
    return this.usersService.contactUs(payload);
  }
}
