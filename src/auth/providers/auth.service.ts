import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { SignInProvider } from './sign-in.provider';
import { ForgotPassswordDto } from 'src/auth/dtos/forgot-password.dto';
import { ForgotPasswordProvider } from './forgot-password.provider';
import { ResetPasswordProvider } from './reset-password.provider';
import { ResetPasswordDto } from 'src/auth/dtos/reset-password.dto';
import { RefreshTokenDto } from 'src/auth/dtos/refresh-token.dto';
import { RefreshTokenProvider } from './refresh-token.provider';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { Role } from '../enums/role.enum';

/**
 * auth service for the auth module
 */
@Injectable()
export class AuthService {
  /**
   * constructor
   * @param signInProvider
   * @param forgotPasswordProvider
   * @param resetPasswordProvider
   * @param refreshTokenProvider
   */
  constructor(
    /**
     * injecting the sign in provider
     */
    private readonly signInProvider: SignInProvider,

    /**
     * injecting the forgotPasswordProvider
     */
    private readonly forgotPasswordProvider: ForgotPasswordProvider,

    /**
     * injecting the resetPasswordProvider
     */
    private readonly resetPasswordProvider: ResetPasswordProvider,

    /**
     * injecting the refresh token provider
     */
    private readonly refreshTokenProvider: RefreshTokenProvider,

    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  /**
   * function for signing in a user
   * @param signInDto
   * @returns access and refresh tokens
   */
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async adminSignIn(payload: SignInDto) {
    // find  the user using the email ID
    // throw an exception if the user does not exist
    const user: any = await this.usersService.findOneByEmail(payload.email);

    // compare the password to the hash
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        payload.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Network error!',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    if (!user.active) {
      throw new UnauthorizedException('Only activated users can login');
    }

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only admins can login');
    }

    // generate an access token
    const { accessToken, refreshToken } =
      await this.generateTokenProvider.generateTokens(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullname: user.fullname,
        role: user.role,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        image: user.image,
      },
    };
  }

  /**
   * function for getting the otp email
   * @param forgotPasswordDto
   * @returns null
   */
  public async forgotPassword(forgotPasswordDto: ForgotPassswordDto) {
    return await this.forgotPasswordProvider.forgotPassword(forgotPasswordDto);
  }

  /**
   * function for resetting password
   * @param resetPasswordDto
   * @returns user
   */
  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return await this.resetPasswordProvider.resetPassword(resetPasswordDto);
  }

  /**
   * function for refreshing access token after it expires
   * @param refreshTokenDto
   * @returns access and refresh tokens
   */
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }
}
