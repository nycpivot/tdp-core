import { LoggerOptions } from 'winston'

export class LoggerOptionsSurface {
  public static readonly id = 'LoggerOptionsSurface'
  private _loggerOptions: LoggerOptions

  constructor() {
    this._loggerOptions = {};
  }

  public setLoggerOptions(loggerOptions: LoggerOptions) {
    this._loggerOptions = loggerOptions
  }

  public getLoggerOptions(): LoggerOptions {
    return this._loggerOptions
  }
}