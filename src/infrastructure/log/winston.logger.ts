import { Inject, Injectable, Scope } from "@nestjs/common"
import { Logger } from "./logger.abstract"
import { INQUIRER } from "@nestjs/core"
import { LogLevel } from "./log-level.enum"
import { ConfigService } from "@nestjs/config"
import {
  createLogger,
  Logger as WinstonLoggerInstance,
  addColors,
  config as WinstonConfig,
  format,
  transport,
  transports,
} from "winston"

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger extends Logger {
  private readonly logger: WinstonLoggerInstance

  public constructor(
    private readonly config: ConfigService,
    @Inject(INQUIRER) parentClass: object = {},
  ) {
    super()

    const logLevel = this.config.get<LogLevel>("log.level", LogLevel.INFO)
    const customLevels = Object.values(LogLevel).reduce(
      (acc, key, index) => {
        acc[key] = index
        return acc
      },
      {} as Record<string, number>,
    )
    const customColors: WinstonConfig.AbstractConfigSetColors = {
      [LogLevel.FATAL]: "magenta",
      [LogLevel.ERROR]: "red",
      [LogLevel.WARN]: "yellow",
      [LogLevel.INFO]: "green",
      [LogLevel.VERBOSE]: "cyan",
      [LogLevel.DEBUG]: "blue",
      [LogLevel.TRACE]: "gray",
    }

    addColors(customColors)

    const consoleFormat = format.combine(
      format.errors({ stack: true }),
      format(info => {
        info.level = info.level.toUpperCase()
        return info
      })(),
      format.colorize({ level: true }),
      format.printf(({ message, level, timestamp, stack, ...meta }): string => {
        const safeStringify = (obj: any): string => {
          const seen = new WeakSet()
          return JSON.stringify(
            obj,
            (key, value) => {
              if (typeof value === "object" && value !== null) {
                if (seen.has(value)) return "[Circular]"
                seen.add(value)
              }
              if (typeof value === "function") return "[Function]"
              return value
            },
            2,
          )
        }
        const argsStr = Object.keys(meta).length > 0 ? ` ${safeStringify(meta)}` : ""

        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const stackStr = stack ? `\n${stack}` : ""
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const className = parentClass?.constructor.name || "Unknown"
        return `[${level}] [${className}] ${timestamp} - ${message}${argsStr}${stackStr}`
      }),
    )
    const fileFormat = format.combine(
      format.errors({ stack: true }),
      format.json({
        replacer(_, value) {
          if (typeof value === "function") {
            return "[Function]"
          }
          return value
        },
      }),
    )
    const transportsList: transport[] = [
      new transports.Console({
        level: logLevel,
        format: consoleFormat,
        handleRejections: true,
        handleExceptions: true,
      }),
    ]

    if (this.config.get<boolean>("logger.file.enabled", false)) {
      const filePath = this.config.get<string>("logger.file.outputPath")
      const fileLevel = this.config.get<LogLevel>("logger.file.level", logLevel)
      const maxSize = this.config.get<number>("logger.file.maxSize", 5242880) // 5MB default
      const maxFiles = this.config.get<number>("logger.file.maxFiles", 5)

      if (filePath) {
        transportsList.push(
          new transports.File({
            filename: filePath,
            level: fileLevel,
            format: fileFormat,
            maxsize: maxSize,
            maxFiles: maxFiles,
            handleExceptions: true,
            handleRejections: true,
          }),
        )
      }
    }

    this.logger = createLogger({
      levels: customLevels,
      level: logLevel,
      format: format.combine(format.timestamp()),
      transports: transportsList,
      exitOnError: false,
      silent: this.config.get<boolean>("logger.silent", false),
    })
  }

  protected handleLog(level: LogLevel, message: string, ...args: any[]): void {
    this.logger.log(level, message, ...args)
  }
}
