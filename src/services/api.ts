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
interface Coordinates {
    lat: number,
    long: number
}

interface SearchResults {
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
    },
});

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
    async getBreeds() {
        return await apiClient.get("/dogs/breeds");
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
    async searchDogs(
        breeds?: string[], 
        zipCodes?: string[], 
        ageMin: number = 0, 
        ageMax: number = 1000, 
        size: number = 25, 
        from: number = 0, 
        sort: string = 'breed:asc'
    ) {
        return await apiClient.get("/dogs/search", {
            params: { breeds, zipCodes, ageMin, ageMax, size, from, sort }
        });
    },

    // 🫡 post - (base)/dogs
    // body: { string[] }  length <=100 ids, res: dog objs
    async getDogsByIds(idList: string[]): Promise<Dog[]> {
        return await apiClient.post("/dogs", idList);
    },

    // 🫡 post - (base)/dogs/match
    // body: { string[] }  assumed-length <=100 ids, res: dog objs
    //  -> res: { match: str }, a single dog id
    async matchDogs(idList: string[]) {
        return await apiClient.post("/dogs/match", idList);
    },

    // post - (base)/locations/search
    // body: {
    //     city?: string,
    //     states?: string[],
    //     geoBoundingBox?: {
    //         top?: Coordinates,
    //         left?: Coordinates,
    //         bottom?: Coordinates,
    //         right?: Coordinates,
    //         bottom_left?: Coordinates,
    //         top_left?: Coordinates
    //     },
    //     size?: number,
    //     from?: number
    // }
    // -> res: {
    //     results: Location[],
    //     total: number
    // }
    async searchLocations(
        city?: string | null,
        states?: string[] | null,
        geoBoundingBox?: {
            top?: Coordinates,
            left?: Coordinates,
            bottom?: Coordinates,
            right?: Coordinates,
            bottom_left?: Coordinates,
            top_left?: Coordinates
        } | null,
        size?: number, // defaults to 25 if omitted
        from?: number // optional - for pagination
    ): Promise<Location[] & number> {
        return await apiClient.post("/locations/search", {
            city,
            states,
            geoBoundingBox,
            size,
            from
        });
    }

}