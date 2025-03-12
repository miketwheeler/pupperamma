<template>
    <v-row max-height="fit-content">
        <v-col v-if="!loading && props && props.page === 'home'" cols="12" class="justify-end d-flex px-8">
            <div v-if="cardListDogItems && cardListDogItems.length > 0" class="text-grey">
                {{ viewingText }}
            </div>
        </v-col>
        <v-col v-if="!loading && props && props.page === 'favorites'" cols="12" class="mt-3">
            <div class="text-h5 font-weight-bold">
                You have {{ favoritesLength || 0 }} {{ favoritesLength === 1 ? "Favorite": "Favorites" }}!
            </div>
            <v-btn v-if="favoritesLength === 0" append-icon="mdi-home" to="/" color="primary" class="mt-8">
                Home page
            </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" class="d-flex flex-wrap justify-center">

            <!-- loading results indicator -->
            <div v-if="loading" class="d-flex justify-center align-center w-100 h-100">
                <v-progress-circular indeterminate color="primary" size="64" width="4" />
            </div>

            <!-- present 'no results' if filter yields none -->
            <div v-if="!loading && !cardListDogItems?.length" class="d-flex justify-center align-center w-100 h-100">
                <div class="text-h5 font-weight-bold">
                    {{ props?.page == "favorites" ? "No favorites to display." : "No dogs found here. Please try a different filter."}}
                </div>
            </div>

            <!-- othewise loop and display the dog data in a card grid -->
            <v-tooltip 
                v-else 
                v-for="card in cardStack" 
                location="center"
                >
                <template v-slot:activator="{ props: activatorProps }">
                    <v-card 
                        :key="`pup-card-${card.id}`" 
                        bordered
                        class="mx-2 my-2" 
                        style="width: 280px;"
                        max-height="430px"
                        @click="card.liked = !card.liked; setFavorite($event, card.id, card.liked)"
                        v-bind="activatorProps"
                        
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
                        <v-card-text class="d-flex flex-row flex-wrap ga-6">
                            {{ card.breed }} | {{ card.age > 0 ? card.age : "N/A" }} {{ card.age < 1 ? "" : card.age === 1 ? "yr old" : "yrs old" }} | Zipcode {{ card.zip_code }}
                        </v-card-text>
                    </v-card>
                </template>
                <span>
                    {{ 
                        props.page === 'favorites' 
                        ? "Remove from favorites" 
                        : card.liked && props.page === "home" 
                        ? "Remove from favorites" 
                        : "Add to Favorites" 
                    }}
                </span>
            </v-tooltip>
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
const dogsSearchResponse = ref<SearchResults>();
const cardListDogItems = ref<Dog[]>();

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
//#endregion

// updates the pagination state var -> appStore.pagination.pageNum & scrolls to top
const updatePagination = async (pageNum: number) => {
    scrollTo({ top: 0, behavior: 'smooth' });
    appStore.setPagination(pageNum);
}

// adds/remove favorites to state var -> appStore.favorites (list ids)
const setFavorite = (event: MouseEvent, id: string, liked: boolean) => {
    if (props && props.page !== 'favorites') {
        if (liked) {
            appStore.setFavorites([...appStore.favoritesList, id]);

            // always reset on additions - since pool to generate from has changed
            appStore.matchedPup = "";
            appStore.setMatchRevealed(false);
        } else {
            const wasMatched = appStore.matchedPup === id;
            appStore.setFavorites(appStore.favoritesList.filter((item) => item !== id));

            // if the one removed was the state's matched, reset
            if (wasMatched) {
                appStore.matchedPup = "";
                appStore.setMatchRevealed(false);
            }
        }
    } else {
        // if removed on the favorites page, need to remove fromt the dysplay stack
        if(appStore.favoritesList.includes(id) && !liked) {
            appStore.setFavorites(appStore.favoritesList.filter((itemId) => itemId !== id));
            cardStack.value = cardStack.value.filter((item) => item.id !== id);
        }
    }

    showSnackbar(`Favorites updated! You now have ${appStore.favoritesList.length} favorites.`, 'primary');
}

// populates the card stack with the dog data - for rendering the cards
const populateCards = (liked?: boolean) => {
    if (!cardListDogItems.value) {
        showSnackbar('Something went wrong loading dog data. Please try again.', 'warning');
        return 
    };

    cardStack.value = cardListDogItems.value.map((dog) => ({
        id: dog.id,
        img: dog.img,
        name: dog.name,
        age: dog.age,
        breed: dog.breed,
        zip_code: dog.zip_code,
        liked: liked ? liked : appStore.favoritesList.includes(dog.id)
    }));
}

// req to populate the favorites page 
const getFavoritedDogs = async () => {
    loading.value = true;
    cardStack.value = [];

    try {
        // get the dog data list - using the stashed favorites list of dog ids
        cardListDogItems.value = await api.getDogsByIds(appStore.favoritesList)

        if (!cardListDogItems.value) { 
            showSnackbar('Something went wrong displaying your favorites.', 'warning');   
            return
        };

        // render favorited dog cards
        await populateCards(true);

    } catch (error) {
        console.error('Error fetching dogs:', error);
    } finally {
        loading.value = false;
    }
}

// search using fliter params -> returns list of ids and total potential results (indep of current size-window))
const searchDogs = async () => {
    try {        
        const allZips: string[] = []

        // use the filter params in state to filter /search results (just -> ids, total (not size))
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
        return await api.searchDogs(params);

    } catch (error) {
        console.error('Error searching for dogs:', error);
    }
}

// fetch dog data -> returns list of ids
const getDogsByIds = async () => {
    try {
        if (!dogsSearchResponse.value) {
            showSnackbar('No dogs found for this search. Please try a different filter parameter.', 'warning');
            return
        };

        // uses the stashed dog id list to get all dogs by ids
        return await api.getDogsByIds(dogsSearchResponse.value.resultIds);

    } catch (error) {
        console.error('Error fetching dogs by ids:', error);
    }
}

// call to hit both searchDogs and getDogsByIds -> returns dog data list
const getTheDogGoneData = async () => {
    try {
         // always make the search request
        dogsSearchResponse.value = await searchDogs();

        // set the pagination total value to the total results from the search (this is leveraged for dynamic pagination-)
        appStore.pagination.total = dogsSearchResponse.value?.total || 1;

        if (!dogsSearchResponse.value) {
            showSnackbar('No dogs found for this search. Please try again.', 'warning');
            return
        };

        // get the id list returned by the search
        cardListDogItems.value = await getDogsByIds() || [];

    } catch (error) {
        console.error('Error searching for dogs:', error);
    }
}

// req to get all dogs to populate the card stack. 
const getDogs = async () => {
    loading.value = true;
    cardStack.value = []; // reset rendered cards on state changes/refetching

    try {
        // get the dog data list
        await getTheDogGoneData();

        if(!cardListDogItems.value) {
            showSnackbar('No dogs found for this search. Please try a different filter parameter.', 'warning');
            return
        };

        // for rendering the current stack of dog data
        populateCards();

    } catch (error) {
        console.error('Error fetching dogs:', error);
    } finally {
        loading.value = false;
    }
}


// if page is home, get the dogs, else get the favorited dogs
onMounted(async () => {
    if(!isAuthExpired.value) {
        if(props?.page === 'home') await getDogs();
        if(props?.page === 'favorites') await getFavoritedDogs();
    }
})

// watch for changes in the filter state, pagination, and auth state
watch([
    () => appStore.filterState,
    () => appStore.pagination,
    isAuthExpired, 
], async (newValues, oldValues) => {
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