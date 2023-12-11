import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 1;
    const bancAccount = getBankAccount(initialBalance);
    expect(bancAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 1;
    const withdrawing = 2;

    const bancAccount = getBankAccount(initialBalance);
    const getWithdraw = () => {
      bancAccount.withdraw(withdrawing);
    };
    expect(getWithdraw).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 1;
    const transferAmount = 2;

    const bancAccount = getBankAccount(initialBalance);
    const anotherAccount = getBankAccount(initialBalance);
    const getTransfer = () => {
      bancAccount.transfer(transferAmount, anotherAccount);
    };
    expect(getTransfer).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 1;
    const transferAmount = 2;

    const bancAccount = getBankAccount(initialBalance);
    const getTransfer = () => {
      bancAccount.transfer(transferAmount, bancAccount);
    };
    expect(getTransfer).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initialBalance = 1;
    const depositAmount = 1;

    const bancAccount = getBankAccount(initialBalance);

    bancAccount.deposit(depositAmount);

    expect(bancAccount.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const initialBalance = 3;
    const withdrawing = 2;
    const bancAccount = getBankAccount(initialBalance);

    bancAccount.withdraw(withdrawing);

    expect(bancAccount.getBalance()).toBe(initialBalance - withdrawing);
  });

  test('should transfer money', () => {
    const initialBalance = 3;
    const transferAmount = 2;

    const bancAccount = getBankAccount(initialBalance);
    const anotherAccount = getBankAccount(initialBalance);

    bancAccount.transfer(transferAmount, anotherAccount);

    expect(bancAccount.getBalance()).toBe(initialBalance - transferAmount);
    expect(anotherAccount.getBalance()).toBe(initialBalance + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 3;
    const expectedValue = 1;
    const bancAccount = getBankAccount(initialBalance);
    jest.spyOn(lodash, 'random').mockReturnValue(expectedValue);

    const fetchedBalance = await bancAccount.fetchBalance();
    expect(fetchedBalance).toBe(expectedValue);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 3;
    const expectedValue = 1;
    const bancAccount = getBankAccount(initialBalance);
    jest.spyOn(lodash, 'random').mockReturnValue(expectedValue);

    await bancAccount.synchronizeBalance();
    expect(bancAccount.getBalance()).toBe(expectedValue);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 3;
    const bancAccount = getBankAccount(initialBalance);
    jest.spyOn(lodash, 'random').mockReturnValue(0);

    const syncBalance = async () => {
      await bancAccount.synchronizeBalance();
    };

    await expect(syncBalance).rejects.toThrow(SynchronizationFailedError);
  });
});
