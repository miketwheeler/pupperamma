<template>
    <v-row max-height="fit-content">
        <v-col v-if="!loading && props && props.page === 'home'" cols="12" class="justify-end d-flex px-8">
            <div v-if="cardListDogItems && cardListDogItems.length > 0" class="text-grey">
                {{ viewingText }}
            </div>
        </v-col>
        <v-col v-if="!loading && props && props.page === 'favorites'" cols="12" class="mt-3">
            <div class="text-h5 font-weight-bold">
                You have {{ favoritesLength || 0 }} Favorites!
            </div>
            <v-btn v-if="favoritesLength === 0" append-icon="mdi-home" to="/" color="primary" class="mt-8">
                Home page
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" class="d-flex flex-wrap justify-center">

            <div v-if="loading" class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
                <v-progress-circular indeterminate color="primary" size="64" width="4" />
            </div>

            <div v-if="!loading && cardListDogItems && cardListDogItems.length === 0 " class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
                <div class="text-h5 font-weight-bold">
                    No dogs found here. Please try a different filter.
                </div>
            </div>

            <v-card 
                v-else 
                v-for="card in cardStack" 
                :key="`pup-card-${card.id}`" 
                bordered
                class="mx-2 my-2" 
                style="width: 280px;"
                max-height="430px"
                @click="card.liked = !card.liked; setFavorite($event, card.id, card.liked)"
                >
                <v-img
                    :src="card.img"
                    height="300px"
                    width="100%"
                    class="rounded-t-lg"
                    cover
                    >
                    <div class="card-like-btn-container">
                        <v-btn 
                            :v-model="appStore.favoritesList.includes(card.id)"
                            :color="card.liked ? 'error' : 'grey'" 
                            class="opacity-100 ma-1"
                            variant="plain"
                            icon 
                            :disabled="loading"
                            @click.stop="card.liked = !card.liked; setFavorite($event, card.id, card.liked)" 
                            >
                            <v-icon v-if="card.liked" icon="mdi-heart" />
                            <v-icon v-else icon="mdi-heart-outline" />
                        </v-btn>
                    </div>
                </v-img>
                <v-card-title>{{ card.name }}</v-card-title>
                <v-card-text>
                    {{ card.breed }}&nbsp; |&nbsp; {{ card.age }}yo&nbsp; |&nbsp; Zipcode {{ card.zip_code }}
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col v-if="!loading && props && props.page === 'home'" cols="12" class="justify-end d-flex px-8">
            <div v-if="cardListDogItems && cardListDogItems.length > 0" class="text-grey">
                {{ viewingText }}
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" class="d-flex justify-center">
            <div style="display: flex; justify-content: center; align-items: center;">
                <v-pagination 
                    v-if="!loading && props && props.page === 'home' && cardListDogItems && cardListDogItems.length > 0"
                    v-model="appStore.pagination.pageNum" 
                    :length="paginationLimit | 0" 
                    :id="`pagination-${appStore.pagination.pageNum}`"
                    :total-visible="4"
                    @update:model-value="updatePagination($event)"
                    start="1"
                    class="my-4" 
                    />
            </div>
        </v-col>
    </v-row>
    
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/app';
import api, { type Dog, type SearchResults, type Locations } from '@/services/api';
import { showSnackbar } from '@/services/snackbar';


// TODO: type to the card model && 'Dog' model
interface Card {
    id: string;
    img: string;
    name: string;
    age: number;
    breed: string;
    zip_code: string;
    liked: boolean;
}

//#region vars
//////////////////////////////////////////////////////////////////
const props = defineProps({ page: String });
const appStore = useAppStore();

// card management
const cardStack = ref<Card[]>([]);
const dogsSearchResponse = ref<SearchResults | null>(null);
const cardListDogItems = ref<Dog[] | null>(null);

// pagination
const totalResults = computed(() => appStore.pagination.total); // either total '/location/search' total or '/dogs/search' total
const perpageSize = computed(() => appStore.filterState.size); // rep the filter-selected card qty to display
const paginationLimit = computed(() => Math.ceil(totalResults.value / perpageSize.value)); // sets the limit on the pagination display-only (max page)
const currentResultRangeEnd = computed(() => Math.min(perpageSize.value * appStore.pagination.pageNum, totalResults.value)); // !Zero-based! for pagination calcs
const currentResultRangeStart = computed(() => (perpageSize.value * appStore.pagination.pageNum) - perpageSize.value); // !Zero-based! for pagination calcs

// displays
const viewingText = computed(() => `Viewing ${currentResultRangeStart.value + 1} - ${currentResultRangeEnd.value} of ${totalResults.value}`);
const favoritesLength = computed(() => appStore.favoritesList.length || 0);

// auth state & other
const isAuthExpired = computed(() => appStore.isAuthExpired);
const loading = ref(false);
//////////////////////////////////////////////////////////////////

// figuring out location approach
const locationsByState = ref<number>(0);
const currentLocationMarker = ref<number>(0);
// const locationRangeEnd = computed(() => Math.min(appStore.locationData.locSampleWindowWidth * appStore.pagination.pageNum, totalResults.value));
//#endregion


// updates the pagination state var -> appStore.pagination.pageNum & scrolls to top
const updatePagination = async (pageNum: number) => {
    scrollTo({ top: 0, behavior: 'smooth' });
    appStore.setPagination(pageNum);
}

// adds/remove favorites to state var -> appStore.favorites (list ids)
const setFavorite = (event: MouseEvent, id: string, liked: boolean) => {
    // if on the home page
    if (props && props.page !== 'favorites') {
        if (liked) {
            appStore.setFavorites([...appStore.favoritesList, id]);
        } else {
            appStore.setFavorites(appStore.favoritesList.filter((item) => item !== id));
        }
    } else {
        // if removed on the favorites page, need to remove fromt the stack
        if(appStore.favoritesList.includes(id) && !liked) {
            appStore.setFavorites(appStore.favoritesList.filter((itemId) => itemId !== id));
            cardStack.value = cardStack.value.filter((item) => item.id !== id);
        }
        if(appStore.favoritesList.length === 0) {
            appStore.setPreviousFavorites([]);
            cardStack.value = [];
        }
    }

    showSnackbar(`Favorites updated! You now have ${appStore.favoritesList.length} favorites.`, 'primary');
}

// '/locations/search'
// const getZipCodesFromStateAbbrvs = async () => {
//     try {
//         const useSize = appStore.locationData.loc_size; // if not the initial run, use the size from the filter
//         const useFrom = appStore.locationData.loc_from; // if not the initial run, use the from from the filter

//         const params: any = {
//             states: appStore.locationData.stateAbbrvs,
//             size: useSize,  // starts as same as 'size' filter, if < size dogs, is doubled and refetched
//             from: useFrom,
//         }       

//         const potentialLocations = await api.searchLocations(params);

//         if (!potentialLocations) {
//             showSnackbar('No locations found. Please try a different filter parameter.', 'warning');
//             return null
//         };

//         console.log('location window width: ', useFrom, " to ", useSize, "total: ", potentialLocations.total);

//         // ***in state, set the location data of the POTENTIAL dog locations
//         // parse out the zip codes per stateAbbrv & assign to filterState's zipCodes var
//         appStore.setPotentialDogLocations(potentialLocations)

//     } catch (error) {
//         console.error('Error fetching locations:', error);
//     }
// }

const searchDogs = async (zipArrStart?: number, zipArrEnd?:number) => {
    try {        
        // get the search response data for the page ref (resultIds string[], total, next, prev)
        // const allZips = appStore.locationData.allStateAbrvAndZips.flatMap((entry: any) => entry.zips || []);
        // console.log('allZips.length: ', allZips.length);
        const allZips: string[] = []

        const params: any = {
            breeds: appStore.filterState.breeds,
            zipCodes: allZips,
            ageMin: appStore.filterState.ageMin,
            ageMax: appStore.filterState.ageMax,
            size: appStore.filterState.size,
            from: currentResultRangeStart.value,
            sort: `${appStore.filterState.sortBy.toLowerCase()}:${appStore.filterState.sortDir}`,
        }

        // store the list of dog ids from the response
        dogsSearchResponse.value = await api.searchDogs(params);

        // if(appStore.locationData.stateAbbrvs.length > 0) {
        //     // while ()
        // }
        console.log('dogsSearchRespons total: ', dogsSearchResponse.value.total);

        // if there's locational data, card render qty (size) will need to track the total from the location mixin
        // if(!appStore.locationData.allStateAbrvAndZips.length) 
        appStore.pagination.total = dogsSearchResponse.value.total;

    } catch (error) {
        console.error('Error searching for dogs:', error);
    }
}

const getDogsByIds = async () => {
    try {
        if (!dogsSearchResponse.value) {
            showSnackbar('No dogs found for this search. Please try a different filter parameter.', 'warning');
            return null
        };

        // const allDogIds = [...appStore.locationData.remainderDogSearchResponse, ...dogsSearchResponse.value.resultIds];
        const allDogIds = dogsSearchResponse.value.resultIds;

        // cardListDogItems.value = await api.getDogsByIds(allDogIds.slice(0, appStore.filterState.size));

        cardListDogItems.value = await api.getDogsByIds(dogsSearchResponse.value.resultIds);

        // TODO: assess if needed
        if (!cardListDogItems.value) {
            showSnackbar('Something went wrong getting those results. Please try again.', 'warning');
            return null
        };

        // console.log('getDogsByIds.length: ', cardListDogItems.value.length);

        // return dogs;
    } catch (error) {
        console.error('Error fetching dogs by ids:', error);
    }
}

const getTheDogGoneData = async () => {
    try {
         // always make the search request
        await searchDogs();

        await getDogsByIds();
    } catch (error) {
        console.error('Error searching for dogs:', error);
    }
}

const populateCards = () => {
    if (!cardListDogItems.value) return;

    // if(appStore.locationData.allStateAbrvAndZips.length > 0) 
    //     appStore.pagination.total = cardListDogItems.value.length;

    // finally - map the data to the card stack for rendering
    cardStack.value = cardListDogItems.value.map((dog) => ({
        id: dog.id,
        img: dog.img,
        name: dog.name,
        age: dog.age,
        breed: dog.breed,
        zip_code: dog.zip_code,
        liked: appStore.favoritesList.includes(dog.id)
    }));
}

// req to get all dogs to populate the card stack. 
const getDogs = async () => {
    loading.value = true;
    cardStack.value = [];

    try {
        // if (appStore.locationData.stateAbbrvs.length > 0) {
        //     console.log("is locations!")

        //     await getZipCodesFromStateAbbrvs();
        //     await searchDogs();

        //     if(!dogsSearchResponse.value) return;

            // while (dogsSearchResponse.value.total <= appStore.filterState.size) {
            //     // appStore.locationData.loc_size = appStore.locationData.loc_size + appStore.filterState.size; // Start: 20 +filter size
            //     appStore.locationData.loc_size += 100;

            //     console.log("while loop- loc_size: ", appStore.locationData.loc_size);

            //     await getZipCodesFromStateAbbrvs();
            //     await searchDogs();
            // }

            // appStore.locationData.loc_from = appStore.locationData.loc_size; // increase to the now-from value upto the last size
            // appStore.locationData.loc_size = Math.min(appStore.filterState.size, appStore.potentialDogLocations.total); // reset loc_size to the original size

            // console.log('dogIds pre-remainder: ', dogsSearchResponse.value.resultIds);
            // const remainder = dogsSearchResponse.value.resultIds.slice(appStore.filterState.size);
            // console.log('remainder after loop: ', remainder);
            
            // appStore.locationData.remainderDogSearchResponse = remainder; // store the remaining dog ids for later

            // console.log("endWhile-loc_size: ", appStore.locationData.loc_size, "endWhile-loc_from: ", appStore.locationData.loc_from);

            // await getDogsByIds();

        // if(appStore.locationData.stateAbbrvs.length && cardListDogItems.value && cardListDogItems.value.length < appStore.filterState.size) {
        //     while(cardListDogItems.value.length < appStore.filterState.size) {

        //         // appStore.locationData.locSampleWindowWidth += appStore.filterState.size // add size-more to the window width
        //         // console.log("while in loc loop - window: ", appStore.locationData.locSampleWindowWidth, 'size filter: ', appStore.filterState.size);
        //         // await getZipCodesFromStateAbbrvs();
        //         // await getTheDogGoneData();
        //     }
        // } else {
            // console.log("no locations!")
            // await getTheDogGoneData();
        // }

        await getTheDogGoneData();

        // appStore.locationData.loc_from = 0;
        // appStore.locationData.loc_size = appStore.filterState.size;

        populateCards();

        // if (!cardListDogItems.value) return;

        // if(appStore.locationData.allStateAbrvAndZips.length > 0) 
        //     appStore.pagination.total = cardListDogItems.value.length;

        // // finally - map the data to the card stack for rendering
        // cardStack.value = cardListDogItems.value.map((dog) => ({
        //     id: dog.id,
        //     img: dog.img,
        //     name: dog.name,
        //     age: dog.age,
        //     breed: dog.breed,
        //     zip_code: dog.zip_code,
        //     liked: appStore.favoritesList.includes(dog.id)
        // }));
    } catch (error) {
        console.error('Error fetching dogs:', error);
    } finally {
        loading.value = false;
    }
}

// req to populate the favorites page 
const getFavoritedDogs = async () => {
    loading.value = true;
    cardStack.value = [];

    try {
        cardListDogItems.value = await api.getDogsByIds(appStore.favoritesList)

        if (!cardListDogItems.value) return;
        
        cardStack.value = cardListDogItems.value.map((dog) => ({
            id: dog.id,
            img: dog.img,
            name: dog.name,
            age: dog.age,
            breed: dog.breed,
            zip_code: dog.zip_code,
            liked: true, // appStore.favoritesList.includes(dog.id) ? true : false
        }));
    } catch (error) {
        console.error('Error fetching dogs:', error);
    } finally {
        loading.value = false;
    }
}

// if page is home, get the dogs, else get the favorited dogs
onMounted(async () => {
    if(!isAuthExpired.value) {
        console.log('onMounted called')
        if(props?.page === 'home') await getDogs();
        if(props?.page === 'favorites') await getFavoritedDogs();
    }
})

// watch for changes in the state-abbrv selection portion of the filter
// watch([
//     () => appStore.locationData.stateAbbrvs, 
// ], async (newValue, oldValue) => {
//     // console.log('watcher (stateAbbrvs) triggered')
//     if (!isAuthExpired.value && props?.page === 'home') {

//         cardStack.value = [];

//         // if (newValue.length > 0) {
//         //     await getZipCodesFromStateAbbrvs();
//         //     // await setFilterStateZips();
//         // }

//         // if the state-abbrvs selection is emptied, refectch base
//         await getDogs();
//     }
// }, { deep: true, immediate: false})

// watch for changes in the filter state, pagination and auth combined
watch([
    () => appStore.filterState,
    () => appStore.pagination,
    isAuthExpired, 
], async (newValues, oldValues) => {
    // console.log('watcher (filter/pagination) triggered')
    if (!isAuthExpired.value && props && newValues) {
        if (props.page === 'home') 
            await getDogs();

        if (props.page === 'favorites') 
            await getFavoritedDogs();
    }
}, { deep: true, immediate: false });
</script>


<style scoped>
.card-like-btn-container {
    display: flex; 
    flex-direction: row; 
    width: 100%; 
    justify-content: end;
}
</style>