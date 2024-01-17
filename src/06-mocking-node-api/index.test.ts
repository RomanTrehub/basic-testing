import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fsPromises from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

// jest.createMockFromModule('node:fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const cb = jest.fn();
    const timer = 1000;

    doStuffByTimeout(cb, timer);

    expect(setTimeout).toHaveBeenCalledWith(cb, timer);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const cb = jest.fn();
    const timer = 1000;

    doStuffByTimeout(cb, timer);
    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timer);
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
    const cb = jest.fn();
    const timer = 1000;

    doStuffByInterval(cb, timer);

    expect(setInterval).toHaveBeenCalledWith(cb, timer);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const cb = jest.fn();
    const timer = 1000;
    const intervalsCount = 3;

    doStuffByInterval(cb, timer);

    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(intervalsCount * timer);
    expect(cb).toHaveBeenCalledTimes(intervalsCount);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    jest.spyOn(path, 'join');
    const fileName = 'file';

    await readFileAsynchronously(fileName);

    expect(path.join).toHaveBeenCalledWith(__dirname, fileName);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const fileName = 'file';

    const result = await readFileAsynchronously(fileName);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileName = 'file';
    const fileContent = 'Content';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(fileContent);

    const result = await readFileAsynchronously(fileName);

    expect(result).toBe(fileContent);
  });
});
