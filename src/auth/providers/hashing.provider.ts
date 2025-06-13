import { Injectable } from '@nestjs/common';

/**
 * abstract class for the hashing provider
 */
@Injectable()
export abstract class HashingProvider {
  /**
   * abstract for hashing passwords
   * @param data
   */
  abstract hashPassword(data: string | Buffer): Promise<string>;

  /**
   * abstract for comparing passwords
   * @param data
   * @param encrypted
   */
  abstract comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
