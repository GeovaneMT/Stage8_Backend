class UsersController {

  create(request, response) {
    const { user, email, password } = request.body

    response.status(201).json({ user, email, password })
  }

}

module.exports = UsersController