const { AppError         } = require("../../utils/AppError")
const { hashPassword     } = require("../assets/passwordHashing")
const { UserRepository   } = require("../../repositories/userRepository")
const { validateEmail, validateRequiredFields,} = require("../assets/userValidation")

async function CreateUserController(request, response) {
  try {
    //Creating user...
    console.log("Creating user...")

    //request from frontend json
    const { name, email, password } = request.body
    console.log(`Received request body: name: ${name}, email: ${email}, password: unhashed`)

    //validate if all inputs exists
    validateRequiredFields(request.body)

    //validate email format
    if (!email || !validateEmail(email)) {
      throw new AppError("Invalid email format.", 400)
    }

    //user repository - database connect
    const userRepository = new UserRepository()

    //check if user exists in databse and if email is already in use
    const checkUserExists = await userRepository.findByEmail(email)
    if (checkUserExists) {
      throw new AppError("This email is already in use.", 409)
    }

    //password hashing...
    const hashedPassword = await hashPassword(password)

    await userRepository.create({ name, email, password: hashedPassword })

    return response.status(201).json({ message: "User created successfully" })

  } catch (error) {

    // Check for specific error messages and throw corresponding AppError
    if (error.message.includes("Failed to connect")) {
      console.error("Failed to connect to the database. Error:", error)
      throw new AppError(
        "Failed to connect to the database. Please try again.",
        500
      )
    }

    if (error.message.includes("Failed to execute")) {
      console.error("Failed to execute the database query. Error:", error)
      throw new AppError(
        "Failed to execute the database query. Please try again.",
        500
      )
    }

    if (error.message.includes("data and salt arguments required")) {
      const errorMessage =
        process.env.NODE_ENV === "production"
          ? "Failed to create user."
          : "Failed to hash the password. Please try again."
      console.error(errorMessage)
      throw new AppError(errorMessage, 500)
    }

    // If none of the specific error messages match, re-throw the original error
    throw error

  }
}

module.exports = CreateUserController