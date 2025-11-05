import { writeFile } from "fs/promises"
import { GlobalConfig } from "./types/config"
import { join } from "path"
import { tmpdir } from "os"
import { PostgreSqlContainer } from "@testcontainers/postgresql"
import { RedisContainer } from "@testcontainers/redis"
import { MinioContainer } from "@testcontainers/minio"
import { AbstractStartedContainer } from "testcontainers"

declare global {
  var __CONTAINERS__: AbstractStartedContainer[]
}

export const GLOBAL_CONFIG_PATH = join(tmpdir(), "globalConfig.json")

export default async function () {
  console.log("\n🚀 Starting test containers...")

  try {
    console.log(`📦 Starting PostgreSQL container...`)
    const postgresqlContainer = await new PostgreSqlContainer("postgres:16").start()
    console.log("✅ PostgreSQL is ready")

    console.log(`📦 Starting Redis container...`)
    const redisContainer = await new RedisContainer("redis:8.2.1").start()
    console.log("✅ Redis is ready")

    const minioRootUser = "minioadmin"
    const minioRootPassword = "minioadmin"
    console.log(`📦 Starting MinIO container...`)
    const minioContainer = await new MinioContainer("minio/minio:RELEASE.2025-09-07T16-13-09Z").start()
    console.log("✅ MinIO is ready")

    const globalConfig: GlobalConfig = {
      environment: {
        DATABASE_HOST: postgresqlContainer.getHost(),
        DATABASE_PORT: postgresqlContainer.getPort(),
        DATABASE_USERNAME: postgresqlContainer.getUsername(),
        DATABASE_PASSWORD: postgresqlContainer.getPassword(),
        DATABASE_NAME: postgresqlContainer.getDatabase(),
        REDIS_HOST: redisContainer.getHost(),
        REDIS_PORT: redisContainer.getPort(),
        MINIO_HOST: minioContainer.getHost(),
        MINIO_PORT: minioContainer.getPort(),
        MINIO_ROOT_USER: minioRootUser,
        MINIO_ROOT_PASSWORD: minioRootPassword
      }
    }
    await writeFile(GLOBAL_CONFIG_PATH, JSON.stringify(globalConfig, null, 2))

    globalThis.__CONTAINERS__ = [postgresqlContainer, redisContainer, minioContainer]

    console.log("✅ All containers are ready!")
  } catch (error) {
    console.error("❌ Error starting containers:", error)
    throw error
  }
}
