import { HttpAdapterHost, NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { BadRequestException, ValidationPipe, VersioningType } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { Logger } from "./infrastructure/log/logger.abstract"
import { ConfigService } from "@nestjs/config"
import { json } from "express"
import { AllExceptionFilter } from "./common/filters/all-exception.filter"
import cors from "cors"
import cookieParser from "cookie-parser"

class Main {
  public static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
      bodyParser: false,
    })

    const logger = await app.resolve(Logger)
    const config = app.get(ConfigService)
    const httpAdapter = app.get(HttpAdapterHost)
    const domain = config.get<string>("app.domain")
    const port = config.get<number>("app.port", 3000)

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

            // Kalau nested DTO (misal children)
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

    await app.listen(port, () => {
      logger.info(`Server is running at http://${domain}:${port}/api`)
    })
  }
}
Main.main()
