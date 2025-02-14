import i18next from 'i18next';
import onChange from 'on-change';
import resources from './locales/index.js';

// BEGIN (write your solution here)

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

const normalize = userData => {
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

const sortByNamesAsc = data => {
  data.sort(([name1, value1], [name2, value2]) => {
    if (name1 === name2) {
      return value1.localeCompare(value2);
    }
    return name1.localeCompare(name2);
  });
};

const sortByNamesDesc = data => {
  data.sort(([name1, value1], [name2, value2]) => {
    if (name1 === name2) {
      return value2.localeCompare(value1);
    }
    return name2.localeCompare(name1);
  });
};

const sortByValuesAsc = data => {
  data.sort(([name1, value1], [name2, value2]) => {
    if (value1 === value2) {
      return name1.localeCompare(name2);
    }
    return value1.localeCompare(value2);
  });
};

const sortByValuesDesc = data => {
  data.sort(([name1, value1], [name2, value2]) => {
    if (value1 === value2) {
      return name2.localeCompare(name1);
    }
    return value2.localeCompare(value1);
  });
};

function generateTable(rowNum, colNum) {
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

const fillGridWithHeaders = (grid, headers) => {
  for (let j = 0; j < headers.length; j += 1) {
    grid.rows[0].cells[j].appendChild(headers[j]);
  }
};

const fillGridWithData = (grid, data) => {
  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      grid.rows[i + 1].cells[j].textContent = data[i][j];
    }
  }
};

export default () => {
  const state = {
    nameOrder: 'Asc',
    valueOrder: 'Unsorted',
    data: [],
  };

  // Initialisation================================
  const nameHeading = document.createElement('a');
  nameHeading.href = '';
  nameHeading.textContent = `${i18nextInstance.t('nameHeading')} (${state.nameOrder})`;
  const valueHeading = document.createElement('a');
  valueHeading.href = '';
  valueHeading.textContent = `${i18nextInstance.t('valueHeading')} (${state.valueOrder})`;

  const tableHeaders = [nameHeading, valueHeading];

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
      nameHeading.textContent = `${i18nextInstance.t('nameHeading')} (${value})`;
    }

    if (path === 'valueOrder') {
      valueHeading.textContent = `${i18nextInstance.t('valueHeading')} (${value})`;
    }

    if (path === 'data') {
      fillGridWithData(grid, value);
    }
  };
  // ------------------------------------------------

  const watchedState = onChange(state, render);

  nameHeading.addEventListener('click', e => {
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

  valueHeading.addEventListener('click', e => {
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
