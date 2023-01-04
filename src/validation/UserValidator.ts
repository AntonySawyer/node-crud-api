import { FIELD_TYPE } from '../constants/main';
import { IUser, IUserForm } from '../interface/user';
import {
  validateAge,
  validateFieldType,
  validateRequiredField,
  validateUuid,
} from './common';

class UserValidator {
  private userIdValidator = validateUuid;

  private readonly minAge = 1;

  private readonly REQUIRED_FIELDS: Array<keyof IUserForm> = [
    'age',
    'hobbies',
    'username',
  ];

  public async validateUserId(id: string): Promise<void> {
    this.userIdValidator(id);
  }

  public async validateUserForCreation(user: IUserForm): Promise<void> {
    await this.validateUserCommonFields(user);
  }

  public async validateUserForUpdate(user: IUser, idFromUrl: string): Promise<void> {
    validateUuid(idFromUrl);
    await this.validateUserCommonFields(user);
  }

  private async validateUserCommonFields(user: IUserForm): Promise<void> {
    this.REQUIRED_FIELDS.forEach((field) => {
      validateRequiredField(user, field);
    });
    validateFieldType(user, 'age', FIELD_TYPE.NUMBER);
    validateFieldType(user, 'hobbies', FIELD_TYPE.ARRAY);
    validateFieldType(user, 'username', FIELD_TYPE.STRING);
    validateAge(user.age, this.minAge);
  }
}

const userValidatorInstance = new UserValidator();

export default userValidatorInstance;