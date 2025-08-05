export class User {
  constructor(id, email, first_name, last_name, avatar) {
    this.id = id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar = avatar;
  }

  get fullName() {
    return `${this.first_name} ${this.last_name}`;
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

  static fromDatabase(data) {
    return new User(
      data.id,
      data.email,
      data.first_name,
      data.last_name,
      data.avatar
    );
  }

  toDatabase() {
    return {
      id: this.id,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      avatar: this.avatar
    };
  }
}