import {DeleteObjectCommand, PutObjectCommand, S3} from "@aws-sdk/client-s3";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {v4} from "uuid";
import {PublicFile} from "../entities/public-file.entity";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(PublicFile)
        private publicFilesRepository: Repository<PublicFile>,
        private readonly configService: ConfigService
    ) {}

    async uploadPublicFile(dataBuffer: Buffer, filename: string) {
        const s3Client = new S3({ region: 'eu-central-1' });
        console.log(this.configService.get('AWS_PROFILE'));
        const data = {
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Body: dataBuffer,
            Key: `${v4()}-${filename}`
        }

        await s3Client.send(new PutObjectCommand(data));

        const newFile = this.publicFilesRepository.create({
            key: data.Key,
            url: `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.eu-central-1.amazonaws.com/${data.Key}`
        });

        await this.publicFilesRepository.save(newFile);

        return newFile;
    }

    async deletePublicFile(fileId: number) {
        const file = await this.publicFilesRepository.findOne({ id: fileId });
        const s3Client = new S3({ region: 'eu-central-1' });

        await s3Client.send(new DeleteObjectCommand({
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Key: file.key
        }));

        await this.publicFilesRepository.delete(fileId);
    }
}
