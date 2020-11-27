class Service {
  static rejectResponse(error, code = 500) {
    let returnedResponse;
    if ((error !== undefined) && (error.error !== undefined) && (error.code !== undefined)) {
      // for internal errorUtils errors
      returnedResponse = { error: error.error, code: error.code };
    } else if ((error !== undefined) && (error.message !== undefined)) {
      // for backend errors
      returnedResponse = { error: error.message, code };
    } else {
      // others errors
      returnedResponse = { error: 'Invalid input', code: 405 };
    }
    return returnedResponse;
  }

  static successResponse(payload, code = 200, headers = undefined) {
    return { payload, code, headers };
  }
}

module.exports = Service;
