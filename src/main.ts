import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { VersioningType } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

class Main {
  public static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
      bodyParser: false
    })

    app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" })

    const swaggerConfig = new DocumentBuilder()
      .setTitle("SalingTahu API")
      .setDescription("Api documentation for SalingTahu")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup("api", app, document)

    await app.listen(3001);
  }
}
Main.main()