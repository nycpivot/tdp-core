import { format, LoggerOptions } from 'winston';
import { TransformableInfo } from 'logform';

/*
 * formatAsTAPAlignedJSONLog
 *
 * Follows conventions from:
 * https://gitlab.eng.vmware.com/tap-architecture/notes/-/blob/main/006-logging.md
 *
 */
const formatAsTAPAlignedJSONLog = format.printf(
  (info: TransformableInfo, _opts?: any) => {
    const { timestamp, message, level, ts, ...meta } = info;
    return JSON.stringify(
      Object.assign(
        {
          ts: timestamp,
          level: level,
          meta: meta,
        },
        level === 'error' ? { err: message } : { msg: message },
      ),
    );
  },
);

export const CustomLoggerOptions: LoggerOptions = {
  format: format.combine(format.timestamp(), formatAsTAPAlignedJSONLog),
};
