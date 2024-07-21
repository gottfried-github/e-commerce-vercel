class Logger {
  constructor() {
    this.logs = []
  }

  log(...args) {
    if (process.env.NODE_ENV === 'production') return
    this.logs.unshift(...args)
    console.log(...args)
  }
}

const logger = new Logger()
const log = (...args) => {
  logger.log.bind(logger)(...args)
}
export { Logger, log, logger }
