type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  const logObj = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(meta ? { meta } : {}),
  };
  
  if (level === 'error') {
    console.error(JSON.stringify(logObj));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logObj));
  } else {
    console.log(JSON.stringify(logObj));
  }
}

export const logger = {
  info: (msg: string, meta?: any) => log('info', msg, meta),
  warn: (msg: string, meta?: any) => log('warn', msg, meta),
  error: (msg: string, meta?: any) => log('error', msg, meta),
  debug: (msg: string, meta?: any) => log('debug', msg, meta),
};

export default logger;
