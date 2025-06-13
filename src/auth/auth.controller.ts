import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './providers/auth.service';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { ForgotPassswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * controller for the auth route
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /**
   * constructor
   * @param authService
   */
  constructor(
    /**
     * injecting the auth service
     */
    private readonly authService: AuthService,
  ) {}

  /**
   * route for sign in
   * @param signInDto
   * @returns access token and refresh token
   */
  @ApiOperation({
    summary: 'It signs in a user with valid email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'User is signed in successfully',
    example: {
      summary: 'Access and refresh token',
      value: {
        accessToken: 'jsbfiwhvfquobdfj',
        refreshToken: 'jsbfiwhvfquobdfj',
      },
    },
  })
  @ApiBody({
    description: 'Signs in a user',
    required: true,
    type: SignInDto,
    examples: {
      example1: {
        summary: 'Valid request example',
        value: {
          email: 'iloghaluagneskc@gmail.com',
          password: '@Password1',
        },
      },
      example2: {
        summary: 'Invalid request example (missing password)',
        value: {
          email: 'iloghaluagneskc@gmail.com',
        },
      },
    },
  })
  @Post('/sign-in')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  /**
   * route for forgot password
   *
   */
  @ApiOperation({
    summary: 'It sends a reset otp to the users mail',
  })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully',
    example: {
      value: {
        message: 'Email sent successfully',
      },
    },
  })
  @ApiBody({
    description: 'Sends reset otp to the users mail',
    required: true,
    type: ForgotPassswordDto,
    examples: {
      example1: {
        summary: 'Valid request example',
        value: {
          email: 'iloghaluagneskc@gmail.com',
        },
      },
      example2: {
        summary: 'Invalid request example (missing email)',
        value: {},
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  @Post('/forgot-password')
  public forgotPassword(@Body() forgotPasswordDto: ForgotPassswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * route for reset password
   */
  @ApiOperation({
    summary: 'It resets users password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    example: {
      value: {
        message: 'Password reset successfully',
      },
    },
  })
  @ApiBody({
    description: 'Contains the new password and otp',
    required: true,
    type: ResetPasswordDto,
    examples: {
      example1: {
        summary: 'Valid request example',
        value: {
          otp: 2354,
          password: '@Psswrbnnind123',
        },
      },
      example2: {
        summary: 'Invalid request example (missing password)',
        value: {
          otp: 2342,
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  @Patch('/reset-password')
  public resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * route for refresh tokens
   */
  @ApiOperation({
    summary: 'It creates  new access and refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Access and refresh tokens are created successfully',
    example: {
      value: {
        accessToken: 'jsbfiwhvfquobdfj',
        refreshToken: 'jsbfiwhvfquobdfj',
      },
    },
  })
  @ApiBody({
    description: 'Contains the refresh token',
    required: true,
    type: RefreshTokenDto,
    examples: {
      example1: {
        summary: 'Valid request example',
        value: {
          refreshToken: 'jbfwihfubfjkebiejhfbw',
        },
      },
      example2: {
        summary: 'Invalid request example (missing refresh token)',
        value: {},
      },
    },
  })
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    // console.log('re', refreshTokenDto);
    return await this.authService.refreshTokens(refreshTokenDto);
  }
}
