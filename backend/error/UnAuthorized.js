import  StatusCodes from 'http-status-codes'
import CustomApiError from './customApiError.js'

class UnAuthorizedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export {UnAuthorizedError};
