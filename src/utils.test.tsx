import { getQueueName } from "./utils";

describe('getQueueName', () => {
  it('should remove [PENDING] from the name', () => {
    const result = getQueueName('Queue 1 [PENDING]');
    expect(result).toBe('Queue 1');
  });

  it('should remove [ALERT] from the name', () => {
    const result = getQueueName('Queue 2 [ALERT]');
    expect(result).toBe('Queue 2');
  });

  it('should remove [DONE] from the name', () => {
    const result = getQueueName('Queue 3 [DONE]');
    expect(result).toBe('Queue 3');
  });

  it('should remove [MISSED] from the name', () => {
    const result = getQueueName('Queue 4 [MISSED]');
    expect(result).toBe('Queue 4');
  });

  it('should remove multiple titles from the name', () => {
    const result = getQueueName('Queue 5 [PENDING] [ALERT]');
    expect(result).toBe('Queue 5');
  });

  it('should trim the name after removing titles', () => {
    const result = getQueueName('   Queue 6 [DONE]   ');
    expect(result).toBe('Queue 6');
  });

  it('should return the same name if no titles are found', () => {
    const result = getQueueName('Queue 7');
    expect(result).toBe('Queue 7');
  });
});
