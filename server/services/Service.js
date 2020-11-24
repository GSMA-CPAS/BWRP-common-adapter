class Service {
  static rejectResponse(error, code = 500) {
    return { error, code };
  }

  static successResponse(payload, code = 200, headers = undefined) {
    return { payload, code, headers };
  }
}

module.exports = Service;
