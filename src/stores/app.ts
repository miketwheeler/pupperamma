// Utilities
import { defineStore } from 'pinia';
import api from '@/services/api';
import { useRouter } from 'vue-router';

// mock 'session'
type User = {
    name: string,
    email: string,
};

export const useAppStore = defineStore('app', {
    state: () => ({
        // user
        session: {
            user: {} as User,
            // loggedIn: false,
            expiry: null as Date | null,
        },
        // filter state
        filterState: {
            breeds: [] as string[],
            zip_codes: [],
            ageMin: 0,
            ageMax: 20,
            size: 10,
            sortBy: 'Breed',
            sortDir: 'asc',
            distance_from: 100,
        },
        // favorites state
        favorites: [] as string[],
        // matched
        matchedPooch: "" as string,
        // pagination
        pagination: {
            from: 1,
        }
    }),
    getters: {
        isAuthExpired: (state) => {
            // true if expired, false if not
            if (!state.session.expiry) {
                return true;
            }
            return new Date(state.session.expiry) < new Date();
        },
    },
    actions: {
        // set user
        // setUser(user: User) {
        //     this.session.user = user;
        //     // this.session.loggedIn = true;
        // },
        // setUserLoggedOut() {
        //     this.session.user = {} as User;
        //     // this.session.loggedIn = false;
        //     this.session.expiry = null;
        // },
        // set filter state
        setFilterState(filterState: any) {
            this.$patch({
                filterState: filterState
            })
            // this.filterState = filterState;
        },
        // set favorites
        setFavorites(favorites: string[]) {
            this.$patch({
                favorites: favorites
            })
            // this.favorites = favorites;
        },
        // set pagination
        setPagination(pagination: any) {
            this.$patch({
                pagination: pagination
            })
        },
        resetFilterState() {
            this.$patch({
                filterState: {
                    breeds: [],
                    zip_codes: [],
                    ageMin: 0,
                    ageMax: 20,
                    size: 10,
                    sortBy: 'Breed',
                    sortDir: 'asc',
                    distance_from: 100,
                }
            })
            // this.filterState.breeds = [];
            // this.filterState.zip_codes = [];
            // this.filterState.ageMin = 0;
            // this.filterState.ageMax = 20;
            // this.filterState.size = 10;
            // this.filterState.sortBy = 'Breed';
            // this.filterState.sortDir = 'asc';
            // this.filterState.distance_from = 100;
        },
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

        // reset state
        resetState() {
            this.$reset();
        }
    },
    // pkg installed to persist state across page loads - otherwise state resets
    persist: true,
})
