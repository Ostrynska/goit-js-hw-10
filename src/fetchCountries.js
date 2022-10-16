const base_url = 'https://restcountries.com/v3.1/name/';
const options = `?fields=name,capital,population,flags,languages`;

function fetchCountries(name) {
  let final_url = `${base_url}${name}${options}`;
  return fetch(`${final_url}`).then(response => {
    if (!response.ok) {
      throw new Error(
        Notiflix.Notify.failure('Oops, there is no country with that name')
      );
    }
    return response.json();
  });
}

export { fetchCountries };
