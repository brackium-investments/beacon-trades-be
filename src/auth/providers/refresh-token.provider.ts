import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * provider for resfresh token
 */
@Injectable()
export class RefreshTokenProvider {
  /**
   * constructor
   * @param jwtService
   * @param jwtConfiguration
   * @param generateTokenProvider
   * @param usersService
   */
  constructor(
    /**
     * Injecting the jwt service
     */
    private readonly jwtService: JwtService,

    /**
     * Injecting the jwt config
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /**
     * injecting the generate token provider
     */
    private readonly generateTokenProvider: GenerateTokensProvider,

    /**
     * Injecting the usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  /**
   * function for using the refresh token to generate a new access and refresh token
   * @param refreshTokenDto
   * @returns access and refresh tokend
   */
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token using the jwtService
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      // based on the id gotten, fetch the user from the db
      const user = await this.usersService.findUserById(sub);

      // generate the tokens
      return await this.generateTokenProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
