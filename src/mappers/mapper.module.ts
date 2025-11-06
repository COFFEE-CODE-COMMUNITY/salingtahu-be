import { Module } from "@nestjs/common"
import { GlobalMapper } from "./global.mapper"
import { AutomapperModule } from "@automapper/nestjs"
import { classes } from "@automapper/classes"
import { Logger } from "../log/logger.abstract"

// @Global()
@Module({
  imports: [
    AutomapperModule.forRootAsync({
      useFactory(logger: Logger) {
        return {
          strategyInitializer: classes(),
          errorHandler: {
            handle(error: Error): void {
              logger.error("Automapper error:", error)
            }
          }
        }
      },
      inject: [Logger]
    })
  ],
  providers: [GlobalMapper]
})
export class MapperModule {}
