import { FIELD_TYPE } from '../../shared/validation/constants';
import { IUserRequest } from './interface';
import { validateAge } from '../../shared/validation/specific/age.validator';
import { validateRequiredField } from '../../shared/validation/common/required.validator';
import { validateFieldType, validateArrayElementsType } from '../../shared/validation/common/type.validator';
import { validateUuid } from '../../shared/validation/specific/uuid.validator';

class UserValidator {
  private userIdValidator = validateUuid;

  private readonly minAge = 1;

  private readonly REQUIRED_FIELDS: Array<keyof IUserRequest> = [
    'age',
    'hobbies',
    'username',
  ];

  public async validateUserId(id: string): Promise<void> {
    this.userIdValidator(id);
  }

  public async validateUserForCreation(user: IUserRequest): Promise<void> {
    await this.validateUserCommonFields(user);
  }

  public async validateUserForUpdate(user: IUserRequest, idFromUrl: string): Promise<void> {
    validateUuid(idFromUrl);
    await this.validateUserCommonFields(user);
  }

  private async validateUserCommonFields(user: IUserRequest): Promise<void> {
    this.REQUIRED_FIELDS.forEach((field) => {
      validateRequiredField(user, field);
    });
    validateFieldType(user, 'age', FIELD_TYPE.NUMBER);
    validateFieldType(user, 'hobbies', FIELD_TYPE.ARRAY);
    validateFieldType(user, 'username', FIELD_TYPE.STRING);
    validateArrayElementsType(user.hobbies, FIELD_TYPE.STRING, 'hobbies');
    validateAge(user.age, this.minAge);
  }
}

const userValidatorInstance = new UserValidator();

export default userValidatorInstance;
