'use strict';
/*global $*/

const api_key = '455d21c1db104d289b903b95c60bbc6c';
const BASE_URL = 'https://api.nps.gov/api/v1/parks/';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('.results-list').empty();
  for ( let i = 0; i < responseJson.data.length; i++ ){
    $('.results-list').append(
      `<div class="results-wrapper">
      <a href='${responseJson.data[i].url}' for="link to park page" target="_blank"><h3 for="park-name">${responseJson.data[i].fullName}</h3></a>
      <h4 for="park-address">Located in: ${responseJson.data[i].states}</h4>
      <p for="park description">${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].directionsUrl}" for="plan your visit link" target="_blank">
      <button>Plan Your Visit</button>
      </a>
      </div>`
    )};
}

function getParks(query, limit=10) {
  const params = {
    key: api_key,
    stateCode: query,
    limit,
  };
  const queryString = formatQueryParams(params);
  const url = BASE_URL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('.js-error-msg').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('.js-parks-search-form').on( 'submit', function(event) {
    console.log('event triggered');
    event.preventDefault();
    const searchTerm = $('.js-state-select').val();
    const limit = ($('.js-number-input').val() - 1 );
    console.log(searchTerm);
    console.log(limit);
    getParks( searchTerm, limit );
  });
}

$(watchForm);
