const signupUrl = `http://localhost:4000/api/signup`
const loginUrl = `http://localhost:4000/api/login`
const logoutUrl = `http://localhost:4000/api/logout`

class UserModel {
  static create(newUser) {
    return fetch(signupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    .then((res) => res.json())
    .catch((err) => {
      console.log('Error fetching data in UserModel.create', err)
      return { message: 'Error fetching data in UserModel.create' }
    })
  }

  static login(user) {
    console.log(user)
    return fetch(loginUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    })
    .then((res) => {
      console.log("this is the response from the server", res)
      return res.json()
    })
    .catch((err) => {
      console.log('Error fetching data in UserModel.findOne', err)
      return { message: 'Error fetching data in UserModel.findOne' }
    })
  }

  // TO DO - logout not working!!
  static logout() {
    return fetch(loginUrl, {
      method: 'DELETE'
    })
    .then((res) => {
      res.json()
    })
    .catch((err) => {
      console.log('Error fetching data in UserModel.logout', err)
      return { message: 'Error fetching data in UserModel.logout' };
    });
  }
}

export default UserModel;