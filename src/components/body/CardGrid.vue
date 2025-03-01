<template>
    <v-row>
        <v-col v-if="!loading && props && props.page === 'home'" cols="12" class="justify-end d-flex px-8">
            <div class="text-grey">
                Viewing {{ currentResultRangeStart }}-{{ currentResultRangeEnd }} of {{ totalResults }}
            </div>
        </v-col>
        <v-col v-if="!loading && props && props.page === 'favorites'" cols="12" class="mt-3">
            <div class="text-h5 font-weight-bold">
                You have {{ appStore.favorites.length || 0 }} Favorites!
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" class="d-flex flex-wrap justify-center">
            <div v-if="loading" class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
                <v-progress-circular indeterminate color="primary" size="64" width="4" />
            </div>
            <v-card 
                v-else 
                v-for="card in cardStack" 
                :key="`pup-card-${card.id}`" 
                link
                bordered
                class="mx-2 my-2" 
                style="width: 280px;"
                >
                <v-img
                    :src="card.img"
                    height="300px"
                    width="100%"
                    class="rounded-t-lg"
                    cover
                    >
                    <div style="display: flex; flex-direction: row; width: 100%; justify-content: end;">
                        <v-btn 
                            :v-model="appStore.favorites.includes(card.id)"
                            :color="card.liked ? 'error' : 'grey'" 
                            class="opacity-100 ma-1"
                            variant="plain"
                            icon 
                            :disabled="loading || props.page === 'favorites'"
                            @click="card.liked = !card.liked; setFavorite($event, card.id, card.liked)" 
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
            <div class="text-grey">
                Viewing {{ currentResultRangeStart }}-{{ currentResultRangeEnd }} of {{ totalResults }}
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" class="d-flex justify-center">
            <div style="display: flex; justify-content: center; align-items: center;">
                <v-pagination 
                    v-if="!loading && props && props.page === 'home'"
                    v-model="appStore.pagination.from" 
                    :current-page-aria-label="`viewing-page-number-${page}`"
                    :length="totalResults" 
                    :total-visible="6"
                    @change="appStore.setPagination({ from: (page - 1) * appStore.filterState.size })"
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
import api, { type Dog } from '@/services/api';


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

const props = defineProps({ page: String });

const appStore = useAppStore();

const cardStack = ref<Card[]>([]);
const totalResults = ref(0);
const loading = ref(false);
const searchedDogsResult = ref(null);
const page = computed(() => appStore.pagination.from + 1);
const currentResultRangeStart = computed(() => appStore.pagination.from * appStore.filterState.size - appStore.filterState.size + 1);
const currentResultRangeEnd = computed(() => appStore.pagination.from > 0 ? appStore.pagination.from * appStore.filterState.size : appStore.filterState.size)
const isAuthExpired = computed(() => appStore.isAuthExpired);

// adds/remove favorites to state var -> appStore.favorites (list ids)
const setFavorite = (event: MouseEvent, id: string, liked: boolean) => {
    console.log("id", id);

    if (liked) {
        appStore.setFavorites([...appStore.favorites, id]);
        // console.log('appStore.favorites', [...appStore.favorites, id]);
    } else {
        appStore.favorites.splice(appStore.favorites.indexOf(id), 1);
    }
}

// req to get all dogs to populate the card stack. 
// local ref assignment. 
// applies state filters
const getDogs = async () => {
    loading.value = true;

    try {
        await api.searchDogs(
            appStore.filterState.breeds,
            appStore.filterState.zip_codes,
            appStore.filterState.ageMin,
            appStore.filterState.ageMax,
            appStore.filterState.size,
            appStore.pagination.from - 1,
        `${appStore.filterState.sortBy.toLowerCase()}:${appStore.filterState.sortDir}`
        ).then(async (res) => {
            // grab the search response data for the page ref (resultIds string[], total, next, prev)
            const searchedDogs: any = await api.getDogsByIds(res.data.resultIds);
            
            if (!searchedDogs) return null;
            searchedDogsResult.value = res.data;
            totalResults.value = res.data.total;
            
            for(const dog of searchedDogs.data) {
                cardStack.value.push({
                    id: dog.id,
                    img: dog.img,
                    name: dog.name,
                    age: dog.age,
                    breed: dog.breed,
                    zip_code: dog.zip_code,
                    liked: appStore.favorites.includes(dog.id) ? true : false,
                })
            }
        })
    } catch (error) {
        console.error('Error fetching dogs:', error);
    }
    
    loading.value = false;
}

// if card grid is favorites page, get the favorited dogs. 
// local ref assignment
// uses state var with favorited ids
const getFavoritedDogs = async () => {
    loading.value = true;

    try {
        const favoritedDogs: any = await api.getDogsByIds(appStore.favorites)

        if (!favoritedDogs) return null;
        searchedDogsResult.value = favoritedDogs.data;
        totalResults.value = favoritedDogs.data.total;
        
        for(const dog of favoritedDogs.data) {
            cardStack.value.push({
                id: dog.id,
                img: dog.img,
                name: dog.name,
                age: dog.age,
                breed: dog.breed,
                zip_code: dog.zip_code,
                liked: appStore.favorites.includes(dog.id) ? true : false,
            })
        }
    } catch (error) {
        console.error('Error fetching dogs:', error);
    }
    
    loading.value = false;
}

// if page is home, get the dogs, else get the favorited dogs
onMounted(() => {
    if(!isAuthExpired.value) {
        if(props && props.page === 'home') {
            getDogs();
        }
        else if(props && props.page === 'favorites') {
            getFavoritedDogs();
        }
    }
})

// watch for changes in the filter state and pagination
watch([appStore.filterState, appStore.pagination, isAuthExpired], (newValue) => {
    if (props && !isAuthExpired.value) {
        if (props.page === 'home') {
            cardStack.value = [];
            getDogs();
        }
        if (props.page === 'favorites') {
            cardStack.value = [];
            getDogs();
        }
    }
})
</script>


<style scoped>

</style>