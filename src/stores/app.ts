// Utilities
import { defineStore } from 'pinia';
import api, { type Locations, type SearchResults } from '@/services/api';


// mock 'session'
type User = {
    name: string,
    email: string,
};

interface StateZips {
    key: string;
    zips: string[];
}

export const useAppStore = defineStore('app', {
    state: () => ({
        // user
        session: {
            user: {} as User,
            expiry: null as Date | null,
        },
        // filter params state
        filterState: {
            breeds: [] as string[],
            ageMin: 0,
            ageMax: 20,
            size: 10,
            sortBy: 'Breed',
            sortDir: 'asc',
        },
        // location data
        // locationData: {
        //     stateAbbrvs: [] as string[],
        //     allStateAbrvAndZips: [] as StateZips[],
        //     loc_size: 100,
        //     loc_from: 0,
        //     isInitialRun: true,
        //     remainderDogSearchResponse: [] as string[],
        // },
        // potentialDogLocations: {} as Locations,
        userGeoData: {
            postcode:  "" as string, // ie zip code
            state: "" as string, // FULL state name
            lat: 0,
            lon: 0,
        },
        // pagination
        pagination: {
            pageNum: 1,
            total: 0,
        },
        // favorites state
        favoritesList: [] as string[],
        prevFavoritesList: [] as string[],
        // matched
        matchedPooch: "" as string,
        matchRevealed: false,        
    }),
    getters: {
        isAuthExpired: (state) => {
            // true if expired, false if not
            if (!state.session.expiry) return true;
            
            return new Date(state.session.expiry) < new Date();
        },
        isUserGeoDataEmpty: (state) => {
            // if any are empty returns true (false to refetch)
            return !state.userGeoData.postcode || !state.userGeoData.state || state.userGeoData.lat === 0 || state.userGeoData.lon === 0;
        },        
    },
    actions: {
        // auth
        async login(name: string, email: string) {
            try {
                const expiryInMins = 59;
                const expiryDate = new Date(Date.now() + 1000 * 60 * expiryInMins);

                const res = await api.login(name, email);

                if (res.status === 200) {
                    this.$patch({
                        session: {
                            user: { name, email },
                            expiry: expiryDate,
                        }
                    })

                    return res;
                };

                return res;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },
        async logout() {
            try {
                const res = await api.logout();
                if (res.status === 200) {
                    this.$patch({
                        session: {
                            user: {},
                            expiry: null,
                        }
                    })

                    return res;
                }
            } catch (error) {
                console.error('Logout failed:', error);
                return false;
            }
        },
        // set filter state
        // setFilterState(filterState: any) {
        //     this.$patch({
        //         filterState: filterState
        //     })
        // },
        setFilterBreeds(breeds: string[]) {
            this.filterState.breeds = breeds;
        },
        // set favorites
        setFavorites(favorites: string[]) {
            this.$patch({
                favoritesList: favorites
            })
            if (!this.favoritesList.includes(this.matchedPooch)) {
                this.$patch({ matchedPooch: "" });
                this.setMatchRevealed(false);
            }
        },
        setMatchRevealed(revealed: boolean) {
            this.matchRevealed = revealed;
        },
        setPreviousFavorites(prevFavorites: string[]) {
            this.prevFavoritesList = prevFavorites;
        },
        // set pagination
        setResultsPerPage(size: number) {
            this.filterState.size = size;
            // this.locationData.loc_size = size;
        },
        setPagination(page: number) {
            this.pagination.pageNum = page;
        },
        // set user geo & location-related data
        setUserGeoData(geoData: any) {
            this.$patch({
                userGeoData: {
                    postcode: geoData.postcode,
                    state: geoData.state,
                    lat: geoData.lat,
                    lon: geoData.lon,
                }
            })
        },
        // setFilterZipCodeData(zipCodeData: string[]) {
        //     this.filterState.zipCodes = zipCodeData;
        // },
        // setStateAbbrvs(stateAbbrvs: string[]) {
        //     this.locationData.stateAbbrvs = stateAbbrvs;

        //     const newStateZips: StateZips[] = [];

        //     for (const abbr of stateAbbrvs) {
        //         const existing = this.locationData.allStateAbrvAndZips.find((entry) => entry.key === abbr);
        //         if (existing) {
        //             newStateZips.push(existing);
        //         } else {
        //             newStateZips.push({ key: abbr, zips: [] });
        //         }
        //     }
        //     this.locationData.allStateAbrvAndZips = newStateZips;
        // },
        // setPotentialDogLocations(dogLocations: Locations) {
        //     this.potentialDogLocations = dogLocations;

        //     if (this.potentialDogLocations.results.length > 0) {
        //         for (const stateZipEntry of this.locationData.allStateAbrvAndZips) {
        //             const matchingZipList = this.potentialDogLocations.results
        //                 .filter((loc: any) => loc.state === stateZipEntry.key)
        //                 .map((loc: any) => loc.zip_code);

        //             stateZipEntry.zips = matchingZipList;
        //         }
        //     }
        //     else {
        //         this.locationData.allStateAbrvAndZips = [];
        //     }
        // },
        // set location data
        // setZipCodeData(zipCodeData: string[]) {
        //     this.$patch({
        //         locationData: {
        //             zipCodes: zipCodeData,
        //         }
        //     })
        // },
        // setStateAbbrvData(stateAbbrvData: string[]) {
        //     this.$patch({
        //         locationData: {
        //             stateAbbrvs: stateAbbrvData,
        //         }
        //     })
        // },
         // reset filter and location states
        resetFilterState() {
            this.$patch({
                filterState: {
                    breeds: [],
                    // zipCodes: [],
                    ageMin: 0,
                    ageMax: 20,
                    size: 10,
                    sortBy: 'Breed',
                    sortDir: 'asc',
                }
            })
            this.$patch({
                pagination: {
                    pageNum: 1,
                }
            })
            // this.$patch({
            //     locationData: {
            //         stateAbbrvs: [],
            //         allStateAbrvAndZips: [],
            //     }
            // })
        },
        // reset all states
        resetState() {
            this.$reset();
        }
    },
    // pkg installed to persist state across page loads - otherwise state resets
    persist: true,
})
