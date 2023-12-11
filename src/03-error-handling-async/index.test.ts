import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const input = 'value';
    const data = await resolveValue(input);
    expect(data).toBe(input);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errMessage = 'Something went wrong';
    const throwErrWithMsg = () => {
      throwError(errMessage);
    };
    expect(throwErrWithMsg).toThrow(errMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    const throwErrWithoutMsg = () => {
      throwError();
    };
    expect(throwErrWithoutMsg).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const throwCustomMsgErr = () => {
      throwCustomError();
    };
    expect(throwCustomMsgErr).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const throwCustomMsgErr = async () => {
      return rejectCustomError();
    };
    await expect(throwCustomMsgErr).rejects.toThrow(MyAwesomeError);
  });
});
