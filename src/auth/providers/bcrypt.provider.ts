import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

/**
 * provider for bcrypt
 */
@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * function for hashing the password
   * @param data
   * @returns hashed password
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    // generate salt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  /**
   * function for comparing input password against password in db
   * @param data
   * @param encrypted
   * @returns true or false based whether the entered password is same with the password in the database
   */
  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
