import  StatusCodes from 'http-status-codes'
import CustomApiError from './customApiError.js'
class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
