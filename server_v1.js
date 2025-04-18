const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());

const API_BASE_URL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php';
const CLIMATE_API_URL = 'https://data.weather.gov.hk/weatherAPI/opendata/opendata.php';
const RAINFALL_API_URL = 'https://data.weather.gov.hk/weatherAPI/opendata/hourlyRainfall.php';

const currentYear = new Date().getFullYear();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayFormatted = yesterday.toISOString().split('T')[0].replace(/-/g, '');


const datasets = {
    forecast: { type: 'fnd' },
    current: { type: 'rhrread' },
    local: { type: 'flw' },
    warningInfo: { type: 'warningInfo' },
    warningSummary: { type: 'warnsum' },
    specialTips: { type: 'swt' },
    sunriseSunset: { type: 'SRS', params: { station: 'HKO', year: currentYear, lang: 'en', rformat: 'json' } }, 
    moonriseMoonset: { type: 'MRS', params: { station: 'HKO', year: currentYear, lang: 'en', rformat: 'json' } },
    visibility: { type: 'LTMV', params: { lang: 'en', rformat: 'json' } },
    dailyMeanTemp: { type: 'CLMTEMP', params: { station: 'HKO', year: currentYear, lang: 'en', rformat: 'json' } },
    dailyMaxTemp: { type: 'CLMMAXT', params: { station: 'HKO', year: currentYear, lang: 'en', rformat: 'json' } },
    dailyMinTemp: { type: 'CLMMINT', params: { station: 'HKO', year: currentYear, lang: 'en', rformat: 'json' } },
    radiationReport: { type: 'RYES', params: { station: 'HKO', date: yesterdayFormatted, lang: 'en', rformat: 'json' } },
    rainfallPastHour: { params: { lang: 'en' } } 
};

const fetchWeatherData = async (dataset, isClimateData, extraParams = {}, isRainfallData = false) => {
    try {
        // decide which API to use
        const baseUrl = isRainfallData ? RAINFALL_API_URL : (isClimateData ? CLIMATE_API_URL : API_BASE_URL);
        
        // ff `dataset` is provided, include it as `dataType` (except for rainfall API)
        const queryParams = new URLSearchParams({ lang: 'en', rformat: 'json', ...(dataset ? { dataType: dataset } : {}), ...extraParams }).toString();
        const url = `${baseUrl}?${queryParams}`;

        console.log(`Fetching data from: ${url}`); 
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'Failed to fetch data' };
    }
};


// endpoints
app.get('/weather/:type', async (req, res) => {
    const type = req.params.type;
    if (datasets[type]) {
        const isClimateData = ['sunriseSunset', 'moonriseMoonset', 'visibility', 'dailyMeanTemp', 'dailyMaxTemp', 'dailyMinTemp', 'radiationReport'].includes(type);
        const isRainfallData = type === 'rainfallPastHour';
        const extraParams = datasets[type].params || {};
        const data = await fetchWeatherData(datasets[type].type, isClimateData, extraParams, isRainfallData);
        res.json(data);
    } else {
        res.status(400).json({ error: 'Invalid dataset type' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
