import  StatusCodes from 'http-status-codes'
import CustomApiError from './customApiError.js'
class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}


export default BadRequestError