import { describe, expect, it } from 'vitest';

describe('suite', () => {
  it('passes', () => {
    expect(1).toBe(1);
  });

  it('fails', () => {
    expect(1).toBe(2);
  });

  it.skip('is skipped', () => {});

  it.todo('is todo');
});
