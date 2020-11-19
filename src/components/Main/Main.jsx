import React, { useState, useEffect } from 'react';


const Main = () => {

    const [nasaSrc, setNasaSrc] = useState('');
    const [weather, setWeather] = useState({});
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        getData()
    }, []);

    const showCost = (currency, cost) => {
        let finalCost = '';
        for (let i = 0; i < cost; i++) {
            finalCost += currency;
        }
        return finalCost;
    }

    const getData = () => {
        // Downtown Indy
        let userLong = -86.156;
        let userLat = 39.768;

        // NASA
        const nasaKey = 'UV9GIvC2mGysQN2b2cDOgQ4pg7uJiVJRsLcQVgr4';
        const nasaBase = 'https://api.nasa.gov/planetary/earth/imagery';
        const nasaDate = '2014-02-01'  // this for now as Jul 31st did not return an image
        const dim = 0.15;
        let nasaUrl = `${nasaBase}?lon=${userLong}&lat=${userLat}&date=${nasaDate}&dim=${dim}&api_key=${nasaKey}`;
        setNasaSrc(nasaUrl);
        console.log(nasaUrl);

        // Weather
        const weatherKey = 'b5588ab3994f619bf839b645f2ecb671'
        const weatherBase = 'http://api.openweathermap.org/data/2.5/weather'
        let weatherUrl = `${weatherBase}?lat=${userLat}&lon=${userLong}&appid=${weatherKey}`;
        // **note** it looks like the temp comes back in Kelvin
            // temp is @ json.main.temp (I think)
        fetch(weatherUrl)
            .then(res => res.json())
            .then(json => setWeather(json))
            .catch(err => console.log(err));
            console.log(weather);

        // Zomato
        const zomatoKey = '4b3cf7159b998f7d9dd7f5bc251282e5';
        const zomatoBase = 'https://developers.zomato.com/api/v2.1/search';
        let zomatoUrl = `${zomatoBase}?lat=${userLat}&lon=${userLong}&sort=real_distance`;
        fetch(zomatoUrl, {
            headers: {
                'user-key': zomatoKey
            }
        })
            .then(res => res.json())
            .then(json => setRestaurants(json))
            .catch(err => console.log(err));
            console.log(restaurants);
    }
    return(
        <div>
            <h1>Viewing data for: {weather.name}</h1>
            <img className='satImg' src={nasaSrc} />
            {weather.main != undefined ? (<div>
                <span>The temp is {Math.floor(weather.main.temp - 273.15)} degrees</span>
            </div>): null}
            <h2>Here are some nearby restaurants:</h2>
            {restaurants.restaurants.map(item => {
                return(
                    <div key={item.restaurant.name}>
                        <h3>{item.restaurant.name}</h3>
                    <p><span>Avg Rating: {item.restaurant.user_rating.aggregate_rating}</span>  <span>Cost: {showCost(item.restaurant.currency, item.restaurant.price_range)}</span></p>
                    </div>
                )
            })}
        </div>
    )
}

export default Main;