export default class AppError extends Error {
  constructor(msg, status = 500, details = null) {
    super(msg);
    this.statusCode = status;
    this.details = details;
  }
}