import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { User } from 'src/users/user.schema';

/**
 * provider for generating tokens
 */
@Injectable()
export class GenerateTokensProvider {
  /**
   * constructor
   * @param jwtService
   * @param jwtConfiguration
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
  ) {}

  /**
   * function for using jwt to sign the user info
   * @param userId
   * @param expiresIn
   * @param payload
   * @returns the object containing payload when a user signs in
   */
  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  /**
   * function for generating tokens
   * @param user
   * @returns access and refresh tokens
   */
  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // Generate the access token
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          role: user.role,
        },
      ),
      // Generate the refresh token
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
