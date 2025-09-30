import { LogLevel } from "./log-level.enum"
import {
  createLogger,
  Logger as WinstonLoggerInstance,
  addColors,
  config as WinstonConfig,
  format,
  transport,
  transports,
} from "winston"
import { IsEnum, IsBoolean, ValidateNested, validateOrReject } from "class-validator"
import { join } from "path"
import { plainToInstance, Type } from "class-transformer"
import { readFileSync } from "fs"

class FileLoggerConfig {
  @IsBoolean()
  public enabled: boolean = false

  @IsEnum(LogLevel)
  public level: LogLevel = LogLevel.INFO
}

class LoggerConfig {
  @IsEnum(LogLevel)
  public level: LogLevel = LogLevel.INFO

  @ValidateNested()
  @Type(() => FileLoggerConfig)
  public file!: FileLoggerConfig
}

export class Logger {
  private static config: LoggerConfig

  private readonly logger: WinstonLoggerInstance

  // Safe JSON stringify that handles circular references
  private static safeStringify(obj: any): string {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      if (typeof value === 'function') {
        return '[Function]';
      }
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack
        };
      }
      return value;
    });
  }

  public constructor(context: string | Function) {
    const customLevels = Object.values(LogLevel).reduce((acc, key, index) => {
      acc[key] = index
      return acc
    }, {} as Record<string, number>)
    const customColors: WinstonConfig.AbstractConfigSetColors = {
      [LogLevel.FATAL]: 'magenta',
      [LogLevel.ERROR]: 'red',
      [LogLevel.WARN]: 'yellow',
      [LogLevel.INFO]: 'green',
      [LogLevel.VERBOSE]: 'cyan',
      [LogLevel.DEBUG]: 'blue',
      [LogLevel.TRACE]: 'gray'
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
        const argsStr = Object.keys(meta).length > 0 ? ` ${Logger.safeStringify(meta)}` : ''
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const stackStr = stack ? `\n${stack}` : ''
        return `[${level}] [${typeof context === "string" ? context : context.name}] ${timestamp} - ${message}${argsStr}${stackStr}`
      }),
    )
    const fileFormat = format.combine(
      format.errors({ stack: true }),
      format.printf(({ message, level, timestamp, stack, ...meta }) => {
        const safeObj = {
          level,
          timestamp,
          message,
          ...(Object.keys(meta).length > 0 ? { meta: Logger.safeStringify(meta) } : {}),
          ...(stack ? { stack } : {})
        };
        return JSON.stringify(safeObj);
      })
    )
    const transportsList: transport[] = [
      new transports.Console({
        level: Logger.config.level,
        format: consoleFormat,
        handleRejections: true,
        handleExceptions: true,
      })
    ]

    if (Logger.config.file.enabled) {
      const filePath = join('logs', 'application.log')

      if (filePath) {
        transportsList.push(
          new transports.File({
            filename: filePath,
            level: Logger.config.file.level,
            format: fileFormat,
            handleExceptions: true,
            handleRejections: true
          })
        )
      }
    }

    this.logger = createLogger({
      levels: customLevels,
      format: format.combine(
        format.timestamp()
      ),
      transports: transportsList,
      exitOnError: false,
    })
  }

  private handleLog(level: LogLevel, message: string, ...args: any[]): void {
    this.logger.log(level, message, ...args)
  }

  public trace(message: string, ...args: any[]): void {
    this.handleLog(LogLevel.TRACE, message, ...args)
  }

  public debug(message: string, ...args: any[]): void {
    this.handleLog(LogLevel.DEBUG, message, ...args)
  }

  public verbose(message: string, ...args: any[]): void {
    this.handleLog(LogLevel.VERBOSE, message, ...args)
  }

  public info(message: string, ...args: any[]): void {
    this.handleLog(LogLevel.INFO, message, ...args)
  }

  public log(message: string, ...args: any[]): void {
    this.handleLog(LogLevel.INFO, message, ...args)
  }

  public warn(message: string, ...args: any[]): void {
    this.handleLog(LogLevel.WARN, message, ...args)
  }

  public error(message: string, ...args: any[]): void {
    this.handleLog(LogLevel.ERROR, message, ...args)
  }

  public fatal(message: string, ...args: any[]): void {
    this.handleLog(LogLevel.FATAL, message, ...args)
  }

  static {
      const loggerConfig = readFileSync("app-config.json", 'utf-8')
      this.config = plainToInstance(LoggerConfig, JSON.parse(loggerConfig).logger)
  
      validateOrReject(this.config, { whitelist: true, forbidNonWhitelisted: true }).catch(errors => {
        console.error('Logger configuration validation failed:', errors)
      })
    } 
}
