/** Logger provider () */
export class Logger {
  /** Log at debug level */
  debug = console.debug;

  /** Log at info level */
  info = console.info;

  /** Log at warn level */
  warn = console.warn;

  /** Log at error level */
  error = console.error;
}

// TODO: utilize reporting/analytics services for error/warn
