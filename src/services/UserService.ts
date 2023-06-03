import User, { UserCreationAttributes } from '../models/User';
import AlreadyExistsError from '../models/errors/AlreadyExistsError';
import NotFoundError from '../models/errors/NotFoundError';

export default class UserService {
  async createUser(data: UserCreationAttributes) {
    const [user, created] = await User.findOrCreate({
      where: {
        email: data.email,
      },
      defaults: {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
      },
    });
    return user;
  }

  async findUserBy(query: any) {
    const user = await User.findOne({ where: query });

    if (!user) {
      throw new NotFoundError('No record found');
    }
    return user;
  }
}
