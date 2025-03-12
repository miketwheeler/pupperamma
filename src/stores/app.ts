// Utilities
import { defineStore } from 'pinia';
import api from '@/services/api';


// mock 'session'
type User = {
    name: string,
    email: string,
};


// the applicaiton state - filter, session, geodata, pagination, favorites, matched
export const useAppStore = defineStore('app', {
    state: () => ({
        // user
        session: {
            user: {} as User,
            expiry: null as Date | null,
        },
        // filter params
        filterState: {
            breeds: [] as string[],
            ageMin: 0,
            ageMax: 20,
            size: 10,
            sortBy: 'Breed',
            sortDir: 'asc',
        },
        // user location data
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
        // favorites
        favoritesList: [] as string[],
        matchedPup: "" as string,
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
        // filters
        setFilterBreeds(breeds: string[]) {
            this.filterState.breeds = breeds;
        },
        removeBreedFromFilter(breed: string) {
            this.filterState.breeds = this.filterState.breeds.filter(b => b !== breed);
        },
        // set pagination
        setResultsPerPage(size: number) {
            this.filterState.size = size;
        },
        setPagination(page: number) {
            this.pagination.pageNum = page;
        },
        // favorites
        setFavorites(favorites: string[]) {
            this.$patch({
                favoritesList: favorites
            })
            if (!this.favoritesList.includes(this.matchedPup)) {
                this.$patch({ matchedPup: "" });
                this.setMatchRevealed(false);
            }
        },
        setMatchRevealed(revealed: boolean) {
            this.matchRevealed = revealed;
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
         // reset filter and pagination states
        resetFilterState() {
            this.$patch({
                filterState: {
                    breeds: [],
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
        },
        // reset all states
        resetState() {
            this.$reset();
        }
    },
    // pkg installed to persist state across page loads - otherwise state resets
    persist: true,
})
