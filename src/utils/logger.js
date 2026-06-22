const logger = {
  debug: (msg, meta) => console.log(`[DEBUG] ${msg}`, meta ? JSON.stringify(meta) : ''),
  info: (msg, meta) => console.info(`[INFO] ${msg}`, meta ? JSON.stringify(meta) : ''),
  warn: (msg, meta) => console.warn(`[WARN] ${msg}`, meta ? JSON.stringify(meta) : ''),
  error: (msg, meta) => console.error(`[ERROR] ${msg}`, meta ? JSON.stringify(meta) : '')
};

export default logger;
