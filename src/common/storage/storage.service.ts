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
  }

  public async getObject(bucketName: string, objectName: string) {
    return this.minioClient.getObject(bucketName, objectName);
  }

  public async putObject(
    bucketName: string,
    objectName: string,
    filePath: string
  ) {
    const exist = await this.bucketExist(bucketName);
    if (!exist) {
      const result = await this.makeBucket(bucketName);
      if (!result) {
        return new Error("CREATE_BUCKET_FAILED");
      }
    }

    return this.minioClient.fPutObject(bucketName, objectName, filePath);
  }

  public async listBucket() {
    try {
      const result = await this.minioClient.listBuckets();
      return result;
    } catch (e) {
      console.error("why..?", e);
    }
  }
  public async bucketExist(bucket: string): Promise<Boolean> {
    console.info(`[BUCKET_SERVICE] (bucketExist) called`);
    return new Promise((resolve, reject) => {
      this.minioClient.bucketExists(bucket, (err, exist) => {
        if (err) {
          console.error(
            `[BUCKET_SERVICE] (getBucket) : ${JSON.stringify(err)}}`
          );
          reject(null);
        }
        if (exist) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  }
  public async makeBucket(bucket: string): Promise<boolean> {
    console.info(`[BUCKET_SERVICE] (createBucket) called`);
    return new Promise((resolve, reject) => {
      this.minioClient.makeBucket(bucket, err => {
        if (err) {
          console.error(
            `[BUCKET_SERVICE] (getBucket) : ${JSON.stringify(err)}}`
          );
          resolve(false);
        }
        resolve(true);
      });
    });
  }
}
