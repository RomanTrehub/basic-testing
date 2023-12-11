import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  const list = [1, 2, 3];
  const linkedList = {
    value: 1,
    next: {
      value: 2,
      next: {
        value: 3,
        next: {
          value: null,
          next: null,
        },
      },
    },
  };
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(list)).toStrictEqual(linkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(list)).toMatchSnapshot();
  });
});
