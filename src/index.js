import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
  const countryName = e.target.value.trim();

  if (!countryName) {
    return;
    // console.log(countryName);
  }

  fetchCountries(countryName).then(onSuccess).catch(onError);
}

function onSuccess(responseData) {
  isSpecificInput(responseData);
}

function onError(data) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function isSpecificInput(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (2 <= data.length && data.length <= 10) {
    return addMarkupList(data);
  } else if (data.length === 1) {
    return addMarkupInfo(data);
  }
}

function createMarkupCard(arr) {
  const { flags, name, population, capital, languages } = arr[0];
  return `<div class="country-header">
      <img class="country-img" src="${flags.svg}" alt="${
    name.common
  }" width="75" height="auto"/>
      <p class="country-name">${name.official}</p></div>
          <ul class="country-list">
          <li><p><span>Capital: </span>${capital}</p></li>
          <li><p><span>Population: </span>${population}</p></li>
          <li><p><span>Languages: </span>${Object.values(languages)}</p></li>
        </ul>`;
}

function createMarkupList(arr) {
  return arr
    .map(item => {
      return `<li class="country-item">
      <img class="country-item-img" src="${item.flags.svg}" alt="${item.name.common}" width="50"/>
      <p class="country-name-title">${item.name.official}</p></li>`;
    })
    .join('');
}

function clearMarkup(arr, createMarkupList, createMarkupCard) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  arr.insertAdjacentHTML('beforeend', createMarkupList, createMarkupCard);
}

function addMarkupList(data) {
  clearMarkup(refs.countryList, createMarkupList(data));
}

function addMarkupInfo(data) {
  clearMarkup(refs.countryInfo, createMarkupCard(data));
}
