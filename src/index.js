import { trim } from 'lodash';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;


const refs = {
  countrySearch: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let formValue = '';

refs.countrySearch.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));


function onInput(e) {
  e.preventDefault();
  formValue = refs.countrySearch.value.trim();
  if (formValue === '') {
    clearRender();
    return;
  }

  console.log(formValue);
  fetchCountries(formValue)
    .then(countries => {
      if (countries.length === 1) {
        clearRender();
        renderCountryTitle(countries);
        renderCountryInfo(countries);
      } else if (countries.length > 1 && countries.length <= 10) {
        clearRender();
        renderCountryTitle(countries);
      } else if (countries.length > 10) {
        clearRender();
        Notify.info(
          'Too many mathces found. Please enter a more spesific name',
          { timeout: 100, cssAnimationDuration: 1000 }
        );
      }
    })
    .catch(catchError);
}

function renderCountryTitle(countries) {
  
  const markup = countries
    .map(country => {
      return `<li class="country-item">
      <img class='country-img' src="${country.flags.svg}" alt="flag">
      <p class="country-name">${(country.name.official === 'Russian Federation') ? 'Russia-Terrorist Federation' : country.name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
 
}

function renderCountryInfo(countries) {
  const langs = countries.map(({ languages }) => Object.values(languages).join(', '));
  const markup = countries
    .map(country => {
      return `<p class="info-text">Capital: <span class="value">${(country.name.official === 'Russian Federation') ? 'MORDOR' : country.capital}</span></p>
      <p class="info-text">Population: <span class="value">${(country.name.official === 'Russian Federation') ? `${country.population} ORKS` : country.population}</span></p>
      <p class="info-text">languages: <span class="value">${langs}</span></p>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clearRender() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function catchError() {
  clearRender();
  Notify.failure('Oops, there is no country with that name', {
    timeout: 100,
    cssAnimationDuration: 1000,
  });
}