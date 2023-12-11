import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fsPromises from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const cb = jest.fn(() => 'cb');
    const timer = 1000;

    doStuffByTimeout(cb, timer);

    expect(setTimeout).toHaveBeenCalledWith(cb, timer);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const cb = jest.fn(() => 'cb');
    const timer = 1000;

    doStuffByTimeout(cb, timer);

    expect(cb).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const cb = jest.fn(() => 'cb');
    const timer = 1000;

    doStuffByInterval(cb, timer);

    expect(setInterval).toHaveBeenCalledWith(cb, timer);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setTimeout');
    const cb = jest.fn(() => 'cb');
    const timer = 1000;

    doStuffByInterval(cb, timer);

    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3 * timer);
    expect(cb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    jest.spyOn(path, 'join');
    const filePath = '/file';

    await readFileAsynchronously(filePath);

    expect(path.join).toHaveBeenCalledWith(__dirname, filePath);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const filePath = '/file';

    const result = await readFileAsynchronously(filePath);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fsPromises, 'readFile')
      .mockReturnValue(Promise.resolve('Content'));
    const filePath = '/file';
    const fileContent = 'Content';

    const result = await readFileAsynchronously(filePath);

    expect(result).toBe(fileContent);
  });
});
