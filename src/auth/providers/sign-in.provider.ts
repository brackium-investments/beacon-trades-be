import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

/**
 * provider for sigining in users
 */
@Injectable()
export class SignInProvider {
  /**
   * constructor
   * @param usersService
   * @param hashingProvider
   * @param generateTokenProvider
   */
  constructor(
    /**
     * injecting the user service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Injecting the hashing provider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * injecting the generate token provider
     */
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  /**
   * function for signing in users
   * @param signInDto
   * @returns access and refresh tokens
   */
  public async signIn(signInDto: SignInDto) {
    // find  the user using the email ID
    // throw an exception if the user does not exist
    const user: any = await this.usersService.findOneByEmail(signInDto.email);

    // compare the password to the hash
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
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
}
