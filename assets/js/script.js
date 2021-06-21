// start Modals
// alert modal will replace any default alerts
var alertModal = function() {
    // select the page and disables the scroll by adding respective classes(from framework)
    var htmlEl = document.querySelector('html');
    htmlEl.classList.add('is-clipped');
    // select modal div and render on page(styles are from framework)
    var modalEl = document.querySelector('#alert');
    modalEl.classList.add('is-active');
};
// close modals by removing the respective classes
var closeModalBtn = function() {
    var htmlEl = document.querySelector('html');
    htmlEl.classList.remove('is-clipped');
    var modalEl = document.querySelector('#alert');
    modalEl.classList.remove('is-active');
};
// "close button" on modals will close them
document.querySelector(".modal-close").addEventListener("click", closeModalBtn);
// by clicking anywhere on page, mpdals will close aswell
document.querySelector(".modal-background").addEventListener("click", closeModalBtn);
// end Modals

// start address autocomplete(this is copied from Google documentation, and simplified)
var autocomplete;
var searchEl = document.getElementById('autocomplete');

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (searchEl), {
            // options(from google documentation)
            types: ['geocode'],
            componentRestrictions: { country: "us" }
        }
    );
};
// end address auto complete

// fetch IP of user (first API for our app, identifies the users exact location by IP address)
var IPapiKey = "602f8d85bc584bb4b0b520771a9d3287";
var IPapi = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + IPapiKey;
fetch(IPapi)
    .then((r) => r.json())
    .then((d) => {
        // assign user's lat/long to variables to be used by Google Places
        searchLat = d.latitude;
        searchLng = d.longitude;
    });
// end of IP of user fetch

//api call functions

//google places api START

//button click and button data storage
//********iryana use these variables and append to list for each function and append to the page in correct section 
//getting elements name
document.getElementById("search").onclick = function() { searchBar() };
document.getElementById("allID").onclick = function() { getAll() };
document.getElementById("groceryID").onclick = function() { getGroceries() };
document.getElementById("churchID").onclick = function() { getChurches() };
document.getElementById("schoolID").onclick = function() { getSchools() };
document.getElementById("hospitalID").onclick = function() { getHospitals() };

function searchBar() {
    // retrive the search bar value and store it into variable to be used by HERE API
    var addressSearch = searchEl.value;
    console.log(addressSearch);
    //this is where chris code call from the api lat long will go to call google maps
    initMap();
};

//function to run user button click data into variables and displays all options on page in a list
function getAll() {
    //document.getElementById("allID").innerHTML = "YOU CLICKED ME!";
    initMap();
}

//function to run user button click data into variables and displays on page in a list
function getGroceries() {
    //document.getElementById("groceryID").innerHTML = "YOU CLICKED ME!";
    searchWord = "grocery";
    initMap();
}

//function to run user button click data into variables and displays on page for groceries in a list
function getChurches() {
    //document.getElementById("churchID").innerHTML = "YOU CLICKED ME!";
    searchWord = "church";
    initMap();
}
//function to run user button click data into variables and displays on page for schools in a list
function getSchools() {
    //document.getElementById("schoolID").innerHTML = "YOU CLICKED ME!";
    searchWord = "school";
    initMap();
}
//function to run user button click data into variables and displays on page for hospitals in a list
function getHospitals() {
    searchWord = "hospital";
    // document.getElementById("hospitalID").innerHTML = "YOU CLICKED ME!";
    initMap();
}

// variables for lat and longitude from user entered address will replace the numbers below
let userInputLat = 30.2672;
let userInputLng = -97.7431;

var searchLat = userInputLat;
var searchLng = userInputLng;

function initMap() {
    // Create the map.
    const searchedLocation = { lat: searchLat, lng: searchLng };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: searchedLocation,
        zoom: 17,
        mapId: "8d193001f940fde3",
    });
    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");

    moreButton.onclick = function() {
        moreButton.disabled = true;

        if (getNextPage) {
            getNextPage();
        }
    };
    // Perform a nearby search.
    service.nearbySearch({ location: searchedLocation, radius: 500, type: searchWord },
        (results, status, pagination) => {
            if (status !== "OK" || !results) return;
            addPlaces(results, map);
            moreButton.disabled = !pagination || !pagination.hasNextPage;

            if (pagination && pagination.hasNextPage) {
                getNextPage = () => {
                    // Note: nextPage will call the same handler function as the initial call
                    pagination.nextPage();
                };
            }
        }
    );
}

function addPlaces(places, map) {
    const placesList = document.getElementById("list-container");

    for (const place of places) {
        if (place.geometry && place.geometry.location) {
            const image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };
            new google.maps.Marker({
                map,
                icon: image,
                title: place.name,
                position: place.geometry.location,
            });
            const li = document.createElement("div");
            li.classList = "panel-block is-active";
            li.textContent = place.name;
            placesList.appendChild(li);
            li.addEventListener("click", () => {
                map.setCenter(place.geometry.location);
            });
        }
    }
}