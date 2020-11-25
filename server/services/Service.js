class Service {
  static rejectResponse(error, code = 500) {
    if ((error !== undefined) && (error.error !== undefined) && (error.code !== undefined)) {
      return { error: error.error, code: error.code }
    } else {
      return { error, code };
    }
  }

  static successResponse(payload, code = 200, headers = undefined) {
    return { payload, code, headers };
  }
}

module.exports = Service;
