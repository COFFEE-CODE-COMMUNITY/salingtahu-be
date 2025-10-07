import { HttpAdapterHost, NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { BadRequestException, INestApplication, ValidationPipe, VersioningType } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { Logger } from "./infrastructure/log/logger.abstract"
import { ConfigService } from "@nestjs/config"
import { json } from "express"
import { AllExceptionFilter } from "./common/filters/all-exception.filter"
import cors from "cors"
import cookieParser from "cookie-parser"
import { useContainer } from "class-validator"

export class Main {
  private static readonly isMain = require.main === module

  public static async main(): Promise<void> {
    if (this.isMain) {
      const app = await this.initializeApp(
        await NestFactory.create(AppModule, {
          bodyParser: false,
        }),
      )
      const configService = app.get(ConfigService)
      const domain = configService.get<string>("app.domain")
      const port = configService.get<number>("app.port", 3000)
      const logger = await app.resolve<Logger>(Logger)

      await app.listen(port, () => {
        logger.info(`Server is running on ${domain}`)
      })
    }
  }

  public static async initializeApp<T>(app: INestApplication<T>): Promise<INestApplication<T>> {
    const logger = await app.resolve(Logger)
    const config = app.get(ConfigService)
    const httpAdapter = app.get(HttpAdapterHost)

    useContainer(app.select(AppModule), { fallbackOnErrors: true })

    app.use(json({ limit: "10mb", type: "application/json" }))
    app.use(
      cors({
        origin: config.get<string>("client.web.url"),
        credentials: true,
      }),
    )
    app.use(cookieParser())
    app.useLogger(logger)
    app.useGlobalFilters(new AllExceptionFilter(httpAdapter))
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory(errors) {
          const formattedErrors: Record<string, string[]> = {}

          for (const err of errors) {
            if (err.constraints) {
              formattedErrors[err.property] = Object.values(err.constraints)
            }

            if (err.children && err.children.length > 0) {
              for (const child of err.children) {
                if (child.constraints) {
                  formattedErrors[`${err.property}.${child.property}`] = Object.values(child.constraints)
                }
              }
            }
          }

          return new BadRequestException({
            message: "Validation Failed",
            errors: formattedErrors,
          })
        },
      }),
    )
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" })
    app.setGlobalPrefix("api")

    const swaggerConfig = new DocumentBuilder()
      .setTitle("SalingTahu API")
      .setDescription("Api documentation for SalingTahu")
      .setVersion("1.0")
      .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)

    SwaggerModule.setup("api", app, document)

    return app
  }
}
Main.main()
