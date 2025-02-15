import {
  normalize,
  sortByNamesAsc,
  sortByNamesDesc,
  sortByValuesAsc,
  sortByValuesDesc,
  generateTable,
  fillGridWithHeaders,
  fillGridWithData,
} from '../src/application';

describe('Utility Functions', () => {
  test('normalize should filter and return key-value pairs', () => {
    const input = { a: '1', b: '2', c: null, d: {}, e: () => { }, f: '3' };
    const expected = [
      ['a', '1'],
      ['b', '2'],
      ['f', '3'],
    ];
    expect(normalize(input)).toEqual(expected);
  });

  test('sortByNamesAsc should sort by name in ascending order', () => {
    const data = [
      ['b', '2'],
      ['a', '1'],
    ];
    sortByNamesAsc(data);
    expect(data).toEqual([
      ['a', '1'],
      ['b', '2'],
    ]);
  });

  test('sortByNamesDesc should sort by name in descending order', () => {
    const data = [
      ['a', '1'],
      ['b', '2'],
    ];
    sortByNamesDesc(data);
    expect(data).toEqual([
      ['b', '2'],
      ['a', '1'],
    ]);
  });

  test('sortByValuesAsc should sort by value in ascending order', () => {
    const data = [
      ['a', '2'],
      ['b', '1'],
    ];
    sortByValuesAsc(data);
    expect(data).toEqual([
      ['b', '1'],
      ['a', '2'],
    ]);
  });

  test('sortByValuesDesc should sort by value in descending order', () => {
    const data = [
      ['a', '1'],
      ['b', '2'],
    ];
    sortByValuesDesc(data);
    expect(data).toEqual([
      ['b', '2'],
      ['a', '1'],
    ]);
  });
});

describe('DOM Manipulation', () => {
  document.body.innerHTML = '<div class="container"></div>';

  test('generateTable should create a table with correct dimensions', () => {
    const table = generateTable(2, 3);
    expect(table.tagName).toBe('TABLE');
    expect(table.rows.length).toBe(2);
    expect(table.rows[0].cells.length).toBe(3);
  });

  test('fillGridWithHeaders should populate table headers', () => {
    const table = generateTable(3, 2);
    const headers = [document.createElement('a'), document.createElement('a')];
    fillGridWithHeaders(table, headers);
    expect(table.rows[0].cells[0].firstChild).toBe(headers[0]);
    expect(table.rows[0].cells[1].firstChild).toBe(headers[1]);
  });

  test('fillGridWithData should populate table with data', () => {
    const table = generateTable(3, 2);
    const data = [
      ['a', '1'],
      ['b', '2'],
    ];
    fillGridWithData(table, data);
    expect(table.rows[1].cells[0].textContent).toBe('a');
    expect(table.rows[1].cells[1].textContent).toBe('1');
  });
});
