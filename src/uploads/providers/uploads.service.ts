import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadToAwsProvider } from './upload-to-aws.provider';

@Injectable()
export class UploadsService {
  /**
   * constructor
   * @param uploadToAwsProvider
   * @param configService
   */
  constructor(
    /**
     * injecting the upload to aws provider
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    /**
     * injecting config service
     */
    private readonly configService: ConfigService,
  ) {}

  /**
   * function for uploading image file
   * @param file
   * @returns url for image file
   */
  public async uploadFile(file: Express.Multer.File, fileDir: string) {
    // throw error for unsupported mimetype
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      throw new BadRequestException('mime type not supported');
    }

    try {
      // upload the file to the aws s3 bucket and a url has been generated
      const name = await this.uploadToAwsProvider.fileUpload(file, fileDir);

      return `${this.configService.get('appConfig.awsCloudFrontUrl')}/${name}`;
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
