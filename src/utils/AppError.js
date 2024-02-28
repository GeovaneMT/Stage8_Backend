class AppError {
  constructor(message, statusCode = 401) {
    this.message = message
    this.statusCode = statusCode
    // Log the creation of an AppError instance
    console.log(
      `New AppError created: ${this.message} (Status Code: ${this.statusCode})`
    )
  }
}

module.exports = { AppError }
