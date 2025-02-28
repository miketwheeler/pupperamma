// Utilities
import { defineStore } from 'pinia';
import api from '@/services/api';

// sesh
type User = {
    name: string,
    email: string,
};

export const useAppStore = defineStore('app', {
    state: () => ({
        // user
        session: {
            user: {} as User,
            loggedIn: false,
            expiry: {} as Date,
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
    actions: {
        // set user
        setUser(user: User) {
            this.session.user = user;
            this.session.loggedIn = true;
        },
        setUserLoggedOut() {
            this.session.user = {} as User;
            this.session.loggedIn = false;
        },
        // set filter state
        setFilterState(filterState: any) {
            this.filterState = filterState;
        },
        // set favorites
        setFavorites(favorites: string[]) {
            this.favorites = favorites;
        },
        // set pagination
        setPagination(pagination: any) {
            this.pagination = pagination;
        },
        resetFilterState() {
            this.filterState.breeds = [];
            this.filterState.zip_codes = [];
            this.filterState.ageMin = 0;
            this.filterState.ageMax = 20;
            this.filterState.size = 10;
            this.filterState.sortBy = 'Breed';
            this.filterState.sortDir = 'asc';
            // this.filterState.sort = 'breed:asc';
            this.filterState.distance_from = 100;
        },
        checkTokenExpiry() {
            const now = new Date();
            if (this.session.expiry < now) {
                this.setUserLoggedOut();
                this.resetState();
            }
        },
        async login(name: string, email: string) {
            try {
                const res = await api.login(name, email);
                if (res.status === 200) {
                    this.setUser({ name, email });
                    this.session.expiry = new Date(Date.now() + 1000 * 60 * 59);

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
                    this.setUserLoggedOut();
                    return res;
                }
            } catch (error) {
                console.error('Logout failed:', error);
                // return res;
            }
        },

        // reset state
        resetState() {
            this.$reset();
        }
    },
    persist: true,
})
