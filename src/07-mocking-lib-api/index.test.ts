import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // const timer = 5000;
  const path = 'somewhere';

  test('should create instance with provided base url', async () => {
    const mockedCreate = jest.spyOn(axios, 'create');
    jest.spyOn(axios.Axios.prototype, 'get').mockResolvedValue({});
    const baseURL = 'https://jsonplaceholder.typicode.com';

    jest.runAllTimers();

    await throttledGetDataFromApi(path);

    expect(mockedCreate).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const mockedGet = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValue({});

    jest.runAllTimers();

    await throttledGetDataFromApi(path);

    expect(mockedGet).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const receivedData = { userId: 1, username: 'John Doe' };
    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValue({ data: receivedData });

    jest.runAllTimers();

    const response = await throttledGetDataFromApi(path);

    expect(response).toBe(receivedData);
  });
});
