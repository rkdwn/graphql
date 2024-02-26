import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";

@Injectable()
export class StorageService {
  private minioClient: Minio.Client;
  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get("MINIO_ENDPOINT"),
      port: parseInt(this.configService.get("MINIO_PORT"), 10),
      useSSL: true,
      accessKey: this.configService.get("MINIO_ACCESSKEY"),
      secretKey: this.configService.get("MINIO_SECRETKEY")
    });

    console.log("hhhhhhh >>> ", this.minioClient);
  }

  public async getObject(bucketName: string, objectName: string) {
    return this.minioClient.getObject(bucketName, objectName);
  }

  public async listBucket() {
    try {
      const result = await this.minioClient.listBuckets();
      return result;
    } catch (e) {
      console.error("why..?", e);
    }
  }
}
