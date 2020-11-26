class Service {
  static rejectResponse(error, code = 500) {
    if ((error !== undefined) && (error.error !== undefined) && (error.code !== undefined)) {
      // for internal errorUtils errors
      return { error: error.error, code: error.code };
    } else if ((error !== undefined) && (error.message !== undefined)) {
      // for backend errors
      return { error: error.message, code };
    } else {
      // others errors
      return { error: 'Invalid input', code: 405 };
    }
  }

  static successResponse(payload, code = 200, headers = undefined) {
    return { payload, code, headers };
  }
}

module.exports = Service;
