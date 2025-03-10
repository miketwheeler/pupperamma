import axios from "axios";



const baseURL = "https://nominatim.openstreetmap.org"

const locApiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

export default {
    // get location data
    async getLocData(lat: number, lon: number) {
        if (!lat || !lon) return null;

        const res = await locApiClient.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        
        return res.data;
    },
}