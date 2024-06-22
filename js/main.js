let btn = document.querySelector('.btn')
let input = document.querySelector('input')
let citySearch = document.getElementById('city')
let cityName = []
let currentData = []
let forecast = []
let forecastTom = []
let forecastAfterTom = []
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

window.addEventListener('load', function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error)
  }
  async function success(position) {
    let lat = position.coords.latitude
    let lon = position.coords.longitude
    let getApi = await fetch(`https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&localityLanguage=en&key=bdc_d702a57353c44d6894181adce545c117`)
    let response = await getApi.json()
    let currentCity = response.city
    input.value = currentCity
    btn.click()
    input.value = ''

  }
  function error(err) {
    console.log(err.message)
  }
})
btn.addEventListener('click', function () {
  if (validationCity) {

    if (input.value) {
      getWeather(input.value)
      input.classList.remove('is-valid')
    } else {
      alert('Required Data')
    }
  }

})
input.addEventListener('keydown', function (e) {
  if (e.key == 'Enter') {
    btn.click()
  }
})
// weather today
async function getWeather(city) {
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f9708c7c44d94f7998e191858241806&q=${city}`)
    let data = await response.json()
    cityName = data.location.name
    currentData = data.current
    forecast.push(currentData)
    displayData()
    getTomorrowWeather(cityName)
    getAfterTomorrowWeather(cityName)

  } catch (error) {
    console.log('err')
  }
}
function displayData() {
  var box = ``;
  let date = new Date()
  let day = date.getDay()
  let month = date.getMonth()
  let dayNum = date.getDate()
  for (let i = 0; i < forecast.length; i++) {
    box = `
        <div class="col-12">
            <div class="card" id="card1">
              <div class="card-header d-flex justify-content-between">
                <span>${days[day]}</span>
                <span>${dayNum} ${months[month]}</span>
              </div>
              <div class="card-body" id='card-body'>
                <h5 class="card-title">${cityName}</h5>
                <h1 class="card-text display-1 fw-semibold">${currentData.temp_c}<sup>o</sup></h1>
                <div>
                <p class='cards-body'>${currentData.condition.text}</p>
                <img src="http:${currentData.condition.icon}" alt="${currentData.condition.text}">
                </div>
                <div class="d-flex gap-3">
                    <div>
                    <i class="fa fa-umbrella fs-5"></i> <span class='fs-5'>${currentData.pressure_in}</span>
                    </div>
                    <div>
                    <i class="fa fa-wind fs-5"></i> <span class='fs-5'>${currentData.wind_kph}km/h</span>
                    </div>
                    <div>
                    <i class="fa fa-compass fs-5"></i> <span class='fs-5'>${currentData.wind_dir}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        
        `
  }
  document.getElementById('rowData').innerHTML = box
}
// weather tomorrow
async function getTomorrowWeather(city) {
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f9708c7c44d94f7998e191858241806&q=${city}&days=2`)
    let data = await response.json()
    forecastTom = data.forecast.forecastday
    displayDataTomorrow()
  } catch (error) {
    console.log('err')
  }
}
function displayDataTomorrow() {
  var box = ``;
  let date = new Date()
  let day = date.getDay()
  for (let i = 0; i < forecastTom.length; i++) {
    box = `
        <div class="col-12">
            <div class="card" id='card2'>
              <div class="card-header d-flex justify-content-between">
                <span class="m-auto">${days[(day + 1) % 7]}</span>
              </div>
              <div class="card-body" id='card-body'>
                <h1 class="card-text display-1 fw-semibold">${forecastTom[i].day.maxtemp_c}<sup>o</sup></h1>
                <h5 class="card-text fw-semibold">${forecastTom[i].day.mintemp_c}<sup>o</sup></h5>
                <div>
                <p class='cards-body'>${forecastTom[i].day.condition.text}</p>
                <img src="http:${forecastTom[i].day.condition.icon}" alt="${forecastTom[i].day.condition.text}">
                </div>
              </div>
            </div>
          </div>
        
        `
  }
  document.getElementById('rowDataTomorrow').innerHTML = box
}
// weather AfterTomorrow
async function getAfterTomorrowWeather(city) {
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f9708c7c44d94f7998e191858241806&q=${city}&days=3`)
    let data = await response.json()
    forecastAfterTom = data.forecast.forecastday
    displayDataAfterTomorrow()

  } catch (error) {
    console.log('err')
  }
}
function displayDataAfterTomorrow() {
  var box = ``;
  let date = new Date()
  let day = date.getDay()
  for (let i = 0; i < forecastAfterTom.length; i++) {
    box = `
           <div class="col-12">
               <div class="card" id='card3'>
                 <div class="card-header d-flex justify-content-between">
                   <span class="m-auto">${days[(day + 2) % 7]}</span>
                 </div>
                 <div class="card-body" id='card-body'>
                   <h1 class="card-text display-1 fw-semibold">${forecastAfterTom[i].day.maxtemp_c}<sup>o</sup></h1>
                   <h5 class="card-text fw-semibold">${forecastAfterTom[i].day.mintemp_c}<sup>o</sup></h5>
                   <div>
                   <p class='cards-body'>${forecastAfterTom[i].day.condition.text}</p>
                   <img src="http:${forecastAfterTom[i].day.condition.icon}" alt="${forecastAfterTom[i].day.condition.text}">
                   </div>
                 </div>
               </div>
             </div>
           
           `
  }
  document.getElementById('rowDataAfterTomorrow').innerHTML = box
}
//  validation
input.addEventListener("input", function () {
  validationCity()
})
function validationCity() {
  var text = input.value;
  var regex = /^[A-Za-z].{3,}$/

  if (regex.test(text) == true) {
    input.classList.add('is-valid')
    input.classList.remove('is-invalid')
  } else {
    input.classList.add('is-invalid')
    input.classList.remove('is-valid')
  }
}