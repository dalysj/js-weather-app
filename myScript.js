/**
 * This script controls functionality for the weather application
 * @author ste_daly13
 */

// global array for image sources and images
const imageSources = ['Clear.jpg', 'Clouds.jpg', 'Compass.jpg', 'Drizzle.jpg', 'Fog.jpg', 'Mist.jpg', 'Rain.jpg', 'Snow.jpg', 'Thunderstorm.jpg', 'Tornado.jpg', 'Unavailable.jpg'];
const images = [];

// preload images in browser
for(let el of imageSources)
{
    const image = new Image();
    image.src = 'images/background-images/' + el;
    images.push(image);
}
console.log(images);

window.addEventListener('load', () => 
{
    
    // check for navigation capabilities
    navigatorCeck();

    // change temperature metric when temperature is clicked
    $('#temp-click').addEventListener('click', () =>
    {
        metricChange($('#temperature-number').innerHTML);
    });

    // check weather for the searched location
    $('#search-button').addEventListener('click', () =>
    {
        const searchVal =  $('#search-box').value;

        if(searchVal == "")
        {
            navError('nav-object-error');
        }
        else
        {
            searchCity(searchVal);
        }
    });

});

const $ = (selector) =>
{
    return document.querySelector(selector);
};

/**
 * Calls API based on entered value by user into search bar
 * @param userInput User entered search bar value
 */
const searchCity = (userInput) =>
{
    // check for navigation capabilities
    if(navigator.geolocation)
    {
        callApi('https://api.openweathermap.org/data/2.5/weather?q=' + userInput + '&appid=1c9e69d2081b4eb0a724a3143d8e792f&units=metric');
    }
    else
    {
        // unavailable navigation capabilities
        navError('nav-object-error');
    }
}

/**
 * Checks fro navigation capabilities, if available obtains longitude
 * and latitude
 */
const navigatorCeck = () =>
{
    let lat;
    let long;

    // check for navigation capabilities
    if(navigator.geolocation)
    {
        // get current position
        navigator.geolocation.getCurrentPosition((position) =>
        {
            // successfull callback function
            long = position.coords.longitude;
            lat = position.coords.latitude;

            // log long and lat in console
            callApi('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=1c9e69d2081b4eb0a724a3143d8e792f&units=metric');

        }, () => 
        {
            // unsuccessfull callback function
            navError('nav-object-error');
        });

    }
    else
    {
        // unavailable navigation capabilities
        navError('nav-object-error');
    }
}

/**
 * Handles errors in obtaining weather conditions at location
 * @param error If there is an error
 */
const navError = (error) =>
{
    if(error == 'nav-object-error')
    {
        const imageSource = 'images/background-images/Compass.jpg';
        const timezone = 'Error...';
        const description = 'Navigation capabilities are currently unavailable';
        const iconSource = 'images/weather-icons/Compass.png';
        const temp = 0;

        // update DOM
        updateDom(imageSource, timezone, temp,  description, iconSource, error);
    }
    else
    {
        const imageSource = 'images/background-images/Unavailable.jpg';
        const timezone = 'Error...';
        const description = 'Data about entered location is unavailable';
        const iconSource = 'images/weather-icons/Compass.png';
        const temp = 0;

        // update DOM
        updateDom(imageSource, timezone, temp, description, iconSource, error);
    }

}

/**
 * Requests data from web server then processes http response
 * @param api API call for web server
 */
const callApi = (api) =>
{

    // call api
    fetch(api)
    .then((response) => 
    {
        return response.json(); 
    })
    .then((data) => 
    {
        // log the json file containing the weather data
        console.log(data);

        // store data in weather variables
        const temp = data.main.temp;
        let description = data.weather[0].description;
        const main = data.weather[0].main;
        const timezone = data.name + ', ' + data.sys.country;
        
        // console log weather conditions
        console.log('Timezone: ' + location + '\nTemp: ' + temp + '\nDescription: ' + description);

        // from description, select correct weather and background image source address
        const iconSource = iconSelect(main);
        const imageSource = imageSelect(main);
        console.log(imageSource);


        // ensure first letter of weather description is a capital letter
        description = capitalLetterConverter(description);

        // update DOM
        updateDom(imageSource, timezone, temp, description, iconSource, 'no-error');
        
    })
    .catch(() =>
    {
        navError('unavailable-city');
    });
}

/**
 * 
 * @param imageSource Source of image
 * @param timezone Timezone
 * @param temp Temperature at location
 * @param description Description of weather
 * @param iconSource Source of icon
 * @param error If there is an error
 */
const updateDom = (imageSource, timezone, temp, description, iconSource, error) =>
{
    document.body.style.backgroundImage = 'url("' + imageSource + '")';
    $('#temp-box').style.display = 'block'
    $('#name').style.display = 'block';
    $('#city').innerHTML = timezone;
    $('#temperature-number').innerHTML = temp;
    $('#temperature-description').innerHTML = description;
    $('#weather-icon').src = iconSource;
    $('#weather-icon').style.display = 'inline';
    $('#temperature-metric').innerHTML = '&#8451';
    if(error == 'no-error')
    {
        $('#temperature-metric').style.display = 'block';
        $('#temperature-number').style.display = 'block';
    }
    else
    {
        $('#temperature-metric').style.display = 'none';
        $('#temperature-number').style.display = 'none';
    }

}

/**
 * Changes temperature metric
 * @param temp Current temperature metric
 */
const metricChange = (temp) =>
{
    if($('#temperature-metric').innerHTML == '℃')
    {
        temp = ((temp * 9/5) + 32).toFixed(2);
        $('#temperature-number').innerHTML = temp; 
        $('#temperature-metric').innerHTML = '&#8457';
    }
    else if($('#temperature-metric').innerHTML == '℉')
    {
        temp = ((temp - 32) * 5/9).toFixed(2);
        $('#temperature-number').innerHTML = temp;
        $('#temperature-metric').innerHTML = '&#8451';
    }
}

/**
 * Converts first letter of description to a capital
 * @param description Description of weather
 * @returns 
 */
const capitalLetterConverter = (description) =>
{
    const tempString = description.substr(1, description.length);
    const firstLetter = description.charAt(0);
    description = firstLetter.toUpperCase() + tempString;
    console.log();
    return description;
    
} 

/**
 * Returns correct weather icon based on main condition
 * @param main Main weather condition
 * @returns Source for icon
 */
const iconSelect = (main) =>
{
    const conditions = ['Thunderstorm', 'Drizzle', 'Rain', 'Snow', 'Mist', 'Smoke', 'Haze', 'Dust', 'Sand', 'Ash', 'Squall', 'Fog', 'Tornado', 'Clear', 'Clouds'];
    for(let i = 4; i < 11; i++)
    {
        if(conditions[i] == main)
        {
            return 'images/weather-icons/Mist.png';
        }
    }
    
    for(let i = 0; i < conditions.length; i++)
    {
        if(conditions[i] == main)
        {
            return 'images/weather-icons/' + main + '.png';
        }
    }
}

/**
 * Returns correct weather image based on main condition
 * @param main Main weather condition
 * @returns Source for image
 */
const imageSelect = (main) =>
{
    const conditions = ['Thunderstorm', 'Drizzle', 'Rain', 'Snow', 'Mist', 'Smoke', 'Haze', 'Dust', 'Sand', 'Ash', 'Squall', 'Fog', 'Tornado', 'Clear', 'Clouds'];
    for(i = 4; i < 11; i++)
    {
        if(conditions[i] == main)
        {
            return 'images/background-images/Mist.jpg';
        }
    }
    
    for(let i = 0; i < conditions.length; i++)
    {
        if(conditions[i] == main)
        {
            return 'images/background-images/' + main + '.jpg';
        }
    }
}

