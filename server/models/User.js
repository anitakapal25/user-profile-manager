const users = [];

class User {
  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static create(userData) {
    const user = {
      id: users.length + 1,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(user);
    return user;
  }

  static update(id, updateData) {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updateData,
      updatedAt: new Date()
    };
    return users[index];
  }

  static getAll() {
    return users;
  }
}

module.exports = User;