let form = document.forms[0];

let displayButton = document.querySelector("form select");

var num = 1;
let locations = [];
var midpoint_lat = 1.3521; //midpoint between starting locations
var midpoint_long = 103.819;
var filtered_malls = [];
let locat_coords = [];
var modeNum = 1;
const loaderContainer = document.querySelector('.loader-container');

// window.addEventListener('load', () => {
//     loaderContainer.style.display = 'none';
// });
const displayLoading = () => {
    loaderContainer.style.display = 'block';
};

const hideLoading = () => {
    loaderContainer.style.display = 'none';
};

function add_input(element) {
    let div = document.createElement("div");
    div.setAttribute("class", "inputs");
    let inputs = document.createElement("input");
    inputs.setAttribute("type", "text");
    inputs.setAttribute("name", "locations[]");
    inputs.setAttribute("placeholder", "Enter another location");
    inputs.setAttribute("size", "30");
    inputs.setAttribute("style", "height:40px;font-size:12pt;");
    let plus = document.createElement("span");
    plus.setAttribute("onclick", "add_input(this)");
    let plusText = document.createTextNode("+");
    plus.appendChild(plusText);

    let minus = document.createElement("span");
    minus.setAttribute("onclick", "remove_input(this)");
    let minusText = document.createTextNode("-");
    minus.appendChild(minusText);

    form.insertBefore(div, displayButton);
    div.appendChild(inputs);
    div.appendChild(plus);
    div.appendChild(minus);

    if (num != 1) {
        element.nextElementSibling.style.display = "block";
    }
    num += 1;
    element.style.display = "none";
}

function remove_input(element) {
    element.parentElement.remove();
}



form.onsubmit = async function (event) { //issue here?
    displayLoading();
    // await selected();
    event.preventDefault();
    let data = new FormData(form);
    console.log(data);
    data.forEach(function (value) {
        if ((value !== "") && (value !== 'Meet@Where') && (value !== 'Eat@Where') && (value !== 'Adventure@Where') && (value !== 'Study@Where')) {
            locations.push(value);
            console.log(value);

        }
        else if ((value == 'Meet@Where') || (value == 'Eat@Where') || (value == 'Adventure@Where') || (value == 'Study@Where')) {
            if (value == 'Meet@Where') {
                modeNum = 1;
            }
            else if (value == 'Eat@Where') {
                modeNum = 2;
            }
            else if(value == 'Adventure@Where') {
                modeNum = 3;
            }
            else {
                modeNum = 4;
            }
        }
    });

    await convert_to_coords(); //convert the input locations to coordinates and store in array locat_coords

    //////////Code below is for calculating average midpoint between user input locations////////////
    var lat_sum = 0;
    var long_sum = 0;
    for (let x = 0; x < locat_coords.length; x++) {
        lat_sum += locat_coords[x].lat;
        long_sum += locat_coords[x].lng;
    }
    midpoint_lat = lat_sum / locat_coords.length;
    midpoint_long = long_sum / locat_coords.length;
    //////////Code above is for calculating average midpoint between user input locations////////////

    if(modeNum == 1){
    filter_malls(); //if meet@where filter malls within a certain radius
    meetup_location();
    }
    else if(modeNum == 2){
        console.log('Eat');
    }
    else if(modeNum == 3){
        console.log('Adventure');
    }
    else{
        console.log('Study');
    }
}

// async function selected(){
//     var selectobject = document.getElementById("mode");
//     if (selectobject.value == 'Meet@Where') {
//         modeNum = 1;
//     }
//     else if (selectobject.value == 'Eat@Where') {
//         modeNum = 2;
//     }
//     else if (selectobject.value == 'Adventure@Where') {
//         modeNum = 3;
//     }
//     else {
//         modeNum = 4;
//     }
// }

async function convert_to_coords() {
    for (let k = 0; k < locations.length; k++) {
        await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: locations[k] + ' ' + 'SG',
                key: 'AIzaSyDFR0seyb_LY92JNbiZZgairVUDa9hB08g'
            }
        })
            .then(function (response) {
                var lat = response.data.results[0].geometry.location.lat;
                var lng = response.data.results[0].geometry.location.lng;
                locat_coords.push({ lat: lat, lng: lng });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function filter_malls() {
    var midpoint_x = 6371 * midpoint_long * Math.cos(1.3521);
    var midpoint_y = 6371 * midpoint_lat;

    for (let y = 0; y < malls.length; y++) {

        var mall_locat = malls[y];
        var LatLng = mall_locat.split(",");
        var Lat = parseFloat(LatLng[0]);
        var Lng = parseFloat(LatLng[1]);
        //Haversine Formula
        var R = 6371;
        var Lat_diff = (midpoint_lat - Lat) * (Math.PI / 180);
        var Lng_diff = (midpoint_long - Lng) * (Math.PI / 180);
        var a = Math.sin(Lat_diff / 2) * Math.sin(Lat_diff / 2) +
            Math.cos(Lat * (Math.PI / 180)) * Math.cos(midpoint_lat * (Math.PI / 180)) *
            Math.sin(Lng_diff / 2) * Math.sin(Lng_diff / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var diff = R * c;
        if (diff < 4) {
            filtered_malls.push(mall_locat);
        }
    }
}


var malls = ['1.2750063,103.8435656', '1.300898,103.838361', '1.310458,103.8641669', '1.3258546,103.8428618', '1.2981918,103.8556572',
    '1.352083,103.819836', '1.2995955,103.8542191', '1.2929876,103.8511619',
    '1.3016866,103.8365735', '1.2890252,103.8466098', '1.3015383,103.8401372', '1.3114516,103.8561608', '1.3022509,103.8625132', '1.2913005,103.8551976',
    '1.352083,103.819836', '1.3071502,103.8337132', '1.2912647,103.8501932', '1.2936417,103.8319293', '1.3323583,103.8479611', '1.3039288,103.8319512', '1.3506808,103.8487631',
    '1.3030644,103.8361853', '1.3051925,103.8305905', '1.3045795,103.8340621', '1.2846547,103.8609937', '1.2795303,103.8543391', '1.2911534,103.8576778', '1.2916585,103.8597629',
    '1.309637,103.8558162', '1.3025572,103.834568', '1.3006295,103.8398742', '1.300459,103.8393516', '1.3009768,103.8410562', '1.3015954,103.8386169', '1.306542,103.8295263', '1.285631,103.8440929',
    '1.3005317,103.8452356', '1.352083,103.819836', '1.29401,103.8531473', '1.3058788,103.8329554', '1.3058458,103.8312426', '1.3030433,103.8529208', '1.2980833,103.8440979', '1.2957395,103.8566136',
    '1.3004038,103.8511253', '1.29503,103.8583026', '1.3048437,103.8238278', '1.276951,103.8458291', '1.3039633,103.8360565', '1.2862842,103.8277824', '1.3308253,103.8682484', '1.3548,103.8308',
    '1.3171849,103.8436045', '1.3200049,103.8439137', '1.3047145,103.8305375', '1.3037148,103.8332642', '1.3270618,103.8464431', '1.3241182,103.9290329', '1.3236038,103.9273405', '1.3525968,103.9436741', '1.3536067,103.9403839',
    '1.3342732,103.9627387', '1.3776279,103.9546233', '1.3427145,103.9530415', '1.3602082,103.9897593', '1.303903,103.9011732', '1.3032243,103.8728714', '1.3032243,103.8728714', '1.3052934,103.9051599', '1.3013366,103.9052333',
    '1.3242752,103.8906292', '1.3044974,103.9028598', '1.3540351,103.9453692', '1.3522589,103.9450627', '1.3724166,103.9496584', '1.3147665,103.8934127', '1.3786144,103.9420438', '1.3669795,103.9645538', '1.438178,103.7955224',
    '1.440093,103.8014491', '1.36953,103.8484398', '1.443306,103.8305883', '1.4360933,103.7859471', '1.3719487,103.8459981', '1.3717025,103.8476215', '1.3506808,103.8487631', '1.4293478,103.8358671', '1.4058699,103.9017532', '1.3920064,103.89505',
    '1.359469,103.8851289', '1.3504646,103.8727453', '1.3874274,103.8690715', '1.3650699,103.8652075', '1.4023703,103.9132022', '1.394228,103.913016', '1.3846918,103.8819586', '1.3539782,103.8786504', '1.342311,103.7763425', '1.3784819,103.7632117', '1.363354,103.7643204', '1.3803079,103.7601697', '1.3851169,103.7449142',
    '1.3581599,103.7678472', '1.4014568,103.750954', '1.3980893,103.7469334', '1.2644032,103.8222071', '1.314918,103.7643089', '1.3348154,103.7468395', '1.3333104,103.7401991', '1.3331334,103.7436361', '1.3345013,103.7426077', '1.3367679,103.6941672', '1.3418699,103.6973858', '1.3068072,103.7883997',
    '1.303702,103.7659312', '1.2875526,103.8034685'];
function initMap() {
    var options = {
        zoom: 10,
        center: { lat: 1.3521, lng: 103.8198 }
    }
    var map = new google.maps.Map(document.getElementById('map'), options);
}


async function geocode(location) {
    //var input1 = document.getElementById('location-1').value + ' ' + 'SG';
    await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {

        params: {
            address: location,
            key: 'AIzaSyDFR0seyb_LY92JNbiZZgairVUDa9hB08g'
        }
    })
        .then(function (response) {
            //console.log(response);
            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;
            var options = {
                zoom: 10,
                center: { lat: 1.3521, lng: 103.8198 }
            }
            var map = new google.maps.Map(document.getElementById('map'), options);
            var marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map
            });
            console.log('Latitude: ' + lat);
            console.log('Longitude: ' + lng);

        })
        .catch(function (error) {
            console.log(error);
        });
}

async function travelling_time(start, end) {
    try {
        //var response = await axios.get('https://maps.googleapis.com/maps/api/directions/json?origin='+start+'&destination='+end+'&mode=transit'+'&key=AIzaSyBit3gJOMo0EUKqLZZJWaJ21nfO0jbUzFg');
        var response = await axios.get('https://nodejs-proxy-serverr.herokuapp.com/json?origin='+start+'&destination='+end+'&mode=transit'); //use data destructuring to get data from the promise object
        console.log('https://nodejs-proxy-serverr.herokuapp.com/json?origin='+start+'&destination='+end+'&mode=transit')
        return response.data.routes[0].legs[0].duration.value;
    }

    catch (error) {
        console.log(error);
    }
}



async function meetup_location() {
    var meetup = [{ location: 'default', duration: 19000 }];
    for (let i = 0; i < filtered_malls.length; i++) {
        var total_duration = 0;
        for (let j = 0; j < locations.length; j++) {
            let locat = locations[j] + '+' + 'SG';
            //console.log(i);
            let duration = await travelling_time(locat, filtered_malls[i]);
            total_duration += duration;
        }
        //console.log(total_duration);
        if (total_duration < meetup[0].duration) {
            meetup[0].location = filtered_malls[i];
            meetup[0].duration = total_duration;
        }
    }
    locations = [];
    filtered_malls = [];
    locat_coords = [];
    //console.log(meetup[0].location);
    hideLoading();
    geocode(meetup[0].location);
}

