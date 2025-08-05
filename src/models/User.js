export class User {
  constructor(id, email, firstName, lastName, avatar) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatar = avatar;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  static fromApiResponse(data) {
    return new User(
      data.id,
      data.email,
      data.first_name,
      data.last_name,
      data.avatar
    );
  }

  toDbObject() {
    return {
      id: this.id,
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      avatar: this.avatar
    };
  }

  static fromDbObject(data) {
    return new User(
      data.id,
      data.email,
      data.first_name,
      data.last_name,
      data.avatar
    );
  }
}