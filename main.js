const puppeteer = require('puppeteer');
const md5 = require('md5');
const axios = require('axios');

// Set up headers for API requests
const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

// Insert your account information
const acc_info = {
    email: "vvlinh37.na@gmail.com", // Replace with your email
    password: md5("Linhpro1234/"), // Replace with your MD5 hashed password
};

// Function to get the authentication token
async function get_token() {
    const signIn_URL = "https://api.multilogin.com/user/signin";
    try {
        const response = await axios.post(signIn_URL, acc_info, {
            headers: HEADERS,
        });
        console.log("token"+response.data.data.token);
        return response.data.data.token; // Return the token
        
        
    } catch (error) {
        console.log(error.message);
        console.log("Response data:", error.response?.data);
        return false;
    }
}

// Function to start a quick browser profile
async function start_quickProfile() {
    const token = await get_token(); // Get the token
    if (!token) return; // Exit if token retrieval failed

    HEADERS.Authorization = 'Bearer ' + token;

    const requestBody = {
        "browser_type": "mimic",
    "core_version": 124,
    "os_type": "windows",
    "automation":"puppeteer",
    "is_headless": false,
    "parameters": {
        "flags": {
            "audio_masking": "mask",
            "fonts_masking": "custom",
            "geolocation_masking": "custom",
            "geolocation_popup": "prompt",
            "graphics_masking": "custom",
            "graphics_noise": "mask",
            "localization_masking": "custom",
            "media_devices_masking": "custom",
            "navigator_masking": "custom",
            "ports_masking": "mask",
            "proxy_masking": "custom",
            "quic_mode": "natural",
            "screen_masking": "custom",
            "timezone_masking": "custom",
            "webrtc_masking": "custom",
            "canvas_noise:": "custom",
            "startup_behavior": "custom"
        },
        "fingerprint": {
            "navigator": {
                "hardware_concurrency": 8,
                "platform": "Win32",
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "os_cpu": ""
            },
            "localization": {
                "languages": "en-US",
                "locale": "en-US",
                "accept_languages": "en-US,en;q=0.5"
            },
            "timezone": {
                "zone": "Asia/Bangkok"
            },
            "graphic": {
                "renderer": "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)",
                "vendor": "Google Inc. (NVIDIA)"
            },
            "webrtc": {
                "public_ip": "123.123.123.123"
            },
            "media_devices": {
                "audio_inputs": 1,
                "audio_outputs": 1,
                "video_inputs": 2
            },
            "screen": {
                "height": 1200,
                "pixel_ratio": 1,
                "width": 1920
            },
            "geolocation": {
                "accuracy": 100,
                "altitude": 100,
                "latitude": 52.02,
                "longitude": -52.1
            },
            "ports": [
                12345
            ],
            "fonts": [
                "81938139"
            ],
            "cmd_params": {
                "params": [
                    {
                        "flag": "show-fps-counter",
                        "value": "true"
                    }
                ]
            }
        },
        "custom_start_urls": [
            "https://jsonformatter.org/",
            "https://python.org/"
        ]
    },
    };

    const profileLaunch_URL = "https://launcher.mlx.yt:45001/api/v2/profile/quick";
    
    try {
        const response = await axios.post(profileLaunch_URL, requestBody, {
            headers: HEADERS,
        });

        const browserPort = response.data.data.port; // Get the browser port
        console.log("Port:" +browserPort);
        
        if (!browserPort) {
            console.log("Error: No port returned in the response.");
            return;
        }
        
        const browserURL = `http://127.0.0.1:${browserPort}`; // Get the browser URL
        console.log("Browser URL:", browserURL); // Log the browser URL for debugging

        // Connect to the Puppeteer browser instance
        const browser = await puppeteer.connect({
            browserURL: browserURL,
            timeout: 10000,
        });

        const page = await browser.newPage(); // Open a new page

        // Define the capital cities to check the weather
        const capitalCities = [
            { name: "Tokyo", country: "Japan" },
            { name: "Berlin", country: "Germany" },
            { name: "Canberra", country: "Australia" },
            { name: "Ottawa", country: "Canada" },
            { name: "London", country: "United Kingdom" }
        ];

        const weatherResults = [];

        for (const city of capitalCities) {
            const weatherAPIKey = '0ff39a22d113a45332da482c9f4b3069'; 
            const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&appid=${weatherAPIKey}&units=metric`;
            console.log("Weather API URL:", weatherAPIUrl); 
            try {
                const weatherResponse = await axios.get(weatherAPIUrl);
                const weatherData = weatherResponse.data;
                const weatherInfo = {
                    city: city.name,
                    temperature: weatherData.main.temp,
                    description: weatherData.weather[0].description,
                };
                weatherResults.push(weatherInfo);
            } catch (error) {
                console.log(`Error fetching weather for ${city.name}:`, error.message);
            }
        }

        // Log the weather results
        console.log("Current weather in capital cities:");
        weatherResults.forEach(result => {
            console.log(`${result.city}: ${result.temperature}°C, ${result.description}`);
        });

        await page.close(); // Close the page
    } catch (error) {
        console.log("Error:", error.message);
        if (error.response) {
            console.log("Response data:", error.response.data);
        }
    }
}

// Start the quick browser profile and fetch weather
start_quickProfile();