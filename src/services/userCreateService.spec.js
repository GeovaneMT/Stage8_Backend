const { UserCreateService } = require("./userCreateService")
const {
  UserRepositoryInMemory,
} = require("../repositories/userRepositoryInMemory")
const { AppError } = require("../utils/AppError")

describe("UserCreateService", () => {

  let userRepositoryInMemory = null
  let userCreateService = null

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })

  it("user should be created", async () => {
    const user = {
      name: "Tester person",
      email: "tester@test.com",
      password: "testPassword",
    }

    const userCreated = await userCreateService.execute(user)
    console.log(userCreated)

    expect(userCreated).toHaveProperty("id")
  })

  it("user should not be created if existing email is asigned to another user", async () => {

    const user1 = {
      name: "Tester person1",
      email: "tester@test.com",
      password: "testPassword1",
    }

    const user2 = {
      name: "Tester person2",
      email: "tester@test.com",
      password: "testPassword2",
    }

    await userCreateService.execute(user1)
    await expect(userCreateService.execute(user2)).rejects.toEqual(
      new AppError("User not created. This email is already in use.", 409)
    )
  })
})
