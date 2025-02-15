import i18next from 'i18next';
import onChange from 'on-change';
import resources from './locales/index.js';

export const normalize = userData => {
  const resultData = [];
  const keys = Object.keys(userData);
  const normalizedKeys = keys.filter(key => {
    if (
      !userData[key] ||
      typeof userData[key] === 'function' ||
      typeof userData[key] === 'object'
    ) {
      return false;
    }
    return true;
  });

  normalizedKeys.forEach(key => resultData.push([key, userData[key]]));

  return resultData;
};

export const sortByNamesAsc = data => {
  data.sort(([name1, value1], [name2, value2]) => {
    if (name1 === name2) {
      return value1.localeCompare(value2);
    }
    return name1.localeCompare(name2);
  });
};

export const sortByNamesDesc = data => {
  data.sort(([name1, value1], [name2, value2]) => {
    if (name1 === name2) {
      return value2.localeCompare(value1);
    }
    return name2.localeCompare(name1);
  });
};

export const sortByValuesAsc = data => {
  data.sort(([name1, value1], [name2, value2]) => {
    if (value1 === value2) {
      return name1.localeCompare(name2);
    }
    return value1.localeCompare(value2);
  });
};

export const sortByValuesDesc = data => {
  data.sort(([name1, value1], [name2, value2]) => {
    if (value1 === value2) {
      return name2.localeCompare(name1);
    }
    return value2.localeCompare(value1);
  });
};

export function generateTable(rowNum, colNum) {
  const tbl = document.createElement('table');
  const tblBody = document.createElement('tbody');
  for (let i = 0; i < rowNum; i += 1) {
    const row = document.createElement('tr');
    for (let j = 0; j < colNum; j += 1) {
      const cell = document.createElement('td');
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  tbl.appendChild(tblBody);
  tbl.setAttribute('class', 'table');

  return tbl;
}

export const fillGridWithHeaders = (grid, headers) => {
  for (let j = 0; j < headers.length; j += 1) {
    grid.rows[0].cells[j].appendChild(headers[j]);
  }
};

export const fillGridWithData = (grid, data) => {
  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      // eslint-disable-next-line no-param-reassign
      grid.rows[i + 1].cells[j].textContent = data[i][j];
    }
  }
};

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'en',
    debug: true,
    resources: {
      en: resources.en,
      ru: resources.ru,
    },
  });

  await i18nextInstance.changeLanguage('ru', null);

  const rawData = document.location;
  // const rawData = { first: '1', second: '2', third: '2', z: '0', a: '9' };

  const state = {
    nameOrder: 'Asc',
    valueOrder: 'Unsorted',
    data: [],
  };

  // Initialisation================================
  const nameHeader = document.createElement('a');
  nameHeader.href = '';
  nameHeader.textContent = `${i18nextInstance.t('nameHeader')} (${state.nameOrder})`;
  const valueHeader = document.createElement('a');
  valueHeader.href = '';
  valueHeader.textContent = `${i18nextInstance.t('valueHeader')} (${state.valueOrder})`;
  const tableHeaders = [nameHeader, valueHeader];

  state.data = normalize(rawData);
  sortByNamesAsc(state.data);

  const grid = generateTable(state.data.length + 1, 2);
  fillGridWithHeaders(grid, tableHeaders);
  fillGridWithData(grid, state.data);

  const container = document.querySelector('.container');
  container.appendChild(grid);

  // VIEW: ==========================================
  const render = (path, value) => {
    if (path === 'nameOrder') {
      nameHeader.textContent = `${i18nextInstance.t('nameHeader')} (${value})`;
    }

    if (path === 'valueOrder') {
      valueHeader.textContent = `${i18nextInstance.t('valueHeader')} (${value})`;
    }

    if (path === 'data') {
      fillGridWithData(grid, value);
    }
  };
  // ------------------------------------------------

  const watchedState = onChange(state, render);

  // CONTROLLER: ====================================
  nameHeader.addEventListener('click', e => {
    e.preventDefault();
    if (watchedState.nameOrder === 'Asc') {
      watchedState.nameOrder = 'Desc';
      sortByNamesDesc(watchedState.data);
      watchedState.data = [...watchedState.data];
    } else {
      watchedState.nameOrder = 'Asc';
      sortByNamesAsc(watchedState.data);
      watchedState.data = [...watchedState.data];
    }
    watchedState.valueOrder = 'Unsorted';
  });

  valueHeader.addEventListener('click', e => {
    e.preventDefault();
    if (watchedState.valueOrder === 'Asc') {
      watchedState.valueOrder = 'Desc';
      sortByValuesDesc(watchedState.data);
      watchedState.data = [...watchedState.data];
    } else {
      watchedState.valueOrder = 'Asc';
      sortByValuesAsc(watchedState.data);
      watchedState.data = [...watchedState.data];
    }
    watchedState.nameOrder = 'Unsorted';
  });
};
