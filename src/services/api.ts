import axios from "axios";

export interface Dog {
    id: string,
    img: string,
    name: string,
    age: number,
    zip_code: string,
    breed: string,
}
interface Location {
    zip_code: string,
    latitude: number,
    longitude: number,
    city: string,
    state: string,
    county: string,
}
export interface Locations {
    results: Location[],
    total: number
}
interface Coordinates {
    lat: number,
    long: number
}
export interface SearchResults {
    resultIds: string[],
    total: number,
    next: string,
    prev: string
}


const baseURL = "https://frontend-take-home-service.fetch.com";

const apiClient = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
    }
});


let fetched: PrevParams[] = new Array(0); // used to store previous params for pagination
const MAX_FETCHED = 3; // max number of previous params to store

interface PrevParams {
    params: string,
    results: SearchResults
}

// all endpoints for the dog api
export default {
    // 🫡 post login - (base)/auth/login, body: { name: string, email: string }, -> res: http status
    async login(name: string, email: string) {
        return await apiClient.post("/auth/login", { name, email });
    },
    // 🫡 post logout - (base)/auth/logout
    async logout() {
        return await apiClient.post("/auth/logout");
    },

    // 🫡 get - (base)/dogs/breeds, res -> array of breed names
    async getBreeds(): Promise<string[]> {
        return await apiClient.get("/dogs/breeds").then(res => res.data);
    },
    // 🫡 get - (base)/dogs/search
    // query params: breeds (array), zipCodes (array), ageMin, ageMax, size (num results)
    //    from (pagination cursor, optional), sort (sort by field, direction -- sort=field:[asc|desc]) 
    //       *sort ex:  "sort=breed:asc"
    //   -> res: {
    //         resultIds: aray of dog ids,
    //         total: total number of results (not just current pg),
    //         next: a query to req next page of results (if exists),
    //         prev: a query to req next page of results (if exists)
    //     } 
    //   *max # of total dogs matched per query is 10k
    // async searchDogs(
    //     breeds?: string[], 
    //     zipCodes?: string[], 
    //     ageMin: number = 0, 
    //     ageMax: number = 1000, 
    //     size: number = 10, 
    //     from: number = 0, 
    //     sort: string = 'breed:asc'
    // ): Promise<SearchResults> {
    //     return await apiClient.get("/dogs/search", {
    //         params: { breeds, zipCodes, ageMin, ageMax, size, from, sort }
    //     }).then(res => res.data);
    // },
    async searchDogs(params: any): Promise<SearchResults> {
        const paramStr = JSON.stringify(params)

        // if there's any items
        if (fetched.length) {
            const existing = fetched.find((item) => item.params === paramStr);
            
            // if previous exist
            if (existing) {

                console.log("fetched stash: ", fetched);
                
                return existing.results;
            }
        }

        // otherwise normal fetch - stash to start of prevResults and remove if we're at the limit from the tail 
        const dogSearchResults = await apiClient.get("/dogs/search", {params}).then(res => res.data);
        
        fetched.unshift({ params: paramStr, results: dogSearchResults });

        if (fetched.length > MAX_FETCHED) fetched.pop(); // remove last

        console.log("fetched stash: ", fetched);
        
        return dogSearchResults;
    },
    // 🫡 post - (base)/dogs
    // body: { string[] }  length <=100 ids, res: dog objs
    async getDogsByIds(idList: string[]): Promise<Dog[]> {
        return await apiClient.post("/dogs", idList).then(res => res.data);
    },
    // 🫡 post - (base)/dogs/match
    // body: { string[] }  assumed-length <=100 ids, res: dog objs
    //  -> res: { match: str }, a single dog id
    async matchDogs(idList: string[]) {
        return await apiClient.post("/dogs/match", idList);
    },
    // 🙁 post - (base)/locations/search
    // async searchLocations(params: any): Promise<Locations> {
    //     return await apiClient.post("/locations/search", params).then(res => res.data);
    // }
}