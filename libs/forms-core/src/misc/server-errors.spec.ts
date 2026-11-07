import { constructServerErrorMessageObject } from './server-errors';

describe('constructServerErrorMessageObject', () => {
  it('builds nested groups from dot paths', () => {
    expect(constructServerErrorMessageObject([{ jsonPath: 'registration.userName', validator: 'taken' }])).toEqual({
      registration: { userName: 'taken' },
    });
  });

  it('builds arrays from indexes and pads rows without errors with {}', () => {
    expect(
      constructServerErrorMessageObject([
        { jsonPath: 'registration.contacts[2].phone', validator: 'invalidPhone' },
        { jsonPath: 'registration.userName', validator: 'taken' },
      ])
    ).toEqual({ registration: { contacts: [{}, {}, { phone: 'invalidPhone' }], userName: 'taken' } });
  });

  it('fills a padded row when a later error targets it', () => {
    expect(
      constructServerErrorMessageObject([
        { jsonPath: 'root.rows[2].a', validator: 'x' },
        { jsonPath: 'root.rows[0].a', validator: 'y' },
      ])
    ).toEqual({ root: { rows: [{ a: 'y' }, {}, { a: 'x' }] } });
  });

  it('collects two errors on the same path into an array, without duplicates', () => {
    expect(
      constructServerErrorMessageObject([
        { jsonPath: 'root.a', validator: 'one' },
        { jsonPath: 'root.a', validator: 'two' },
        { jsonPath: 'root.a', validator: 'two' },
        { jsonPath: 'root.a', validator: 'three' },
      ])
    ).toEqual({ root: { a: ['one', 'two', 'three'] } });
  });

  it('ignores a leading $ and accepts bracket keys', () => {
    expect(
      constructServerErrorMessageObject([
        { jsonPath: '$.root.list[1]', validator: 'bad' },
        { jsonPath: "$['root']['user name']", validator: 'taken' },
      ])
    ).toEqual({ root: { list: [{}, 'bad'], 'user name': 'taken' } });
  });

  it('handles nested arrays', () => {
    expect(constructServerErrorMessageObject([{ jsonPath: 'root.grid[1][0].v', validator: 'x' }])).toEqual({
      root: { grid: [{}, [{ v: 'x' }]] },
    });
  });

  it('skips entries with an empty path or validator', () => {
    expect(
      constructServerErrorMessageObject([
        { jsonPath: '', validator: 'x' },
        { jsonPath: 'root.a', validator: '' },
      ])
    ).toEqual({});
  });
});
