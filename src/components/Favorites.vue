<template>
    <v-container height="calc(100% - 40px)" fluid max-width="1400px">
        <v-row v-if="loading" class="fill-height">
            <v-col cols="12" class="d-flex justify-center align-center fill-height">
                <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                    />
            </v-col>
        </v-row>

        <v-row v-else class="fill-height">
            
            <v-col cols="12" xs="12" sm="5" md="4" class="mt-3">
                <div class="text-h5 font-weight-bold mb-8">
                    Recommended
                </div>

                <v-sheet
                    v-if="!revealFlag && recommendedPooch && !loading"
                    elevation="3"
                    color="error"
                    min-height="400px"
                    style="border-radius: 8px;"
                    id="reveal-recommended-card"
                    >
                    <div 
                        style="background-color: rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: center; align-items: center; height: 400px !important; border-radius: 8px; width: 100%;"
                        >
                        <v-btn
                            color="primary"
                            text="Reveal Your new buddy!"
                            :append-icon="'mdi-heart'"
                            @click="toggleRevealRecommended"
                            />
                    </div>
                </v-sheet>

                <v-card
                    v-else-if="revealFlag && recommendedPooch && !loading && appStore.favoritesList.length !== 0"
                    :key="`recommended-dog-card-${cardKey}`"
                    elevation="3"
                    color="error"
                    lazy
                    id="recommended-dog-card"
                    >
                    <v-img v-if="recommendedPooch"
                        :src="recommendedPooch.img"
                        height="400px"
                        width="100%"
                        class="rounded-t-lg"
                        cover
                        />
                    <v-card-title>{{ recommendedPooch?.name }}</v-card-title>
                    <v-card-text>
                        <strong>{{ recommendedPooch?.name }}</strong> is a(n)
                        <strong>{{ recommendedPooch?.breed }}</strong>! An adorable pup who is <strong>{{ recommendedPooch?.age }}</strong> years old and can be picked up near <strong>{{ recommendedPooch?.zip_code }}</strong>.
                        <br />
                        <div>Take home {{ recommendedPooch?.name }} today!</div>
                    </v-card-text>
                </v-card>

                <v-card
                    v-else
                    :key="`default-dog-card-${cardKey}`"
                    elevation="3"
                    color="surface"
                    lazy
                    id="recommended-dog-card"
                    >
                    <v-card-text>
                        No favorites to generate a match with 🙁
                    </v-card-text>
                </v-card>

            </v-col>

            <v-divider hidden="sm" vertical class="mx-2" />

            <v-col cols="12" xs="12" sm="6" md="7" class="d-flex flex-column">

                <!-- The card arrangement (in this case it's exclusively the favorited) -->
                <CardGrid page="favorites" />

            </v-col>

        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import CardGrid from '@/components/body/CardGrid.vue';
import { useAppStore } from '@/stores/app';
import api, { type Dog } from '@/services/api';
import JSConfetti from 'js-confetti';


const appStore = useAppStore();

const jsConfetti = new JSConfetti();

const recommendedPooch = ref<Dog>();
const matchedPoochIsEmpty = computed(() => appStore.matchedPooch === "");
const loading = ref(false);
const cardKey = ref(0);
const revealFlag = computed(() => appStore.matchRevealed);
const isAuthExpired = computed(() => appStore.isAuthExpired);
const favoritesChanged = computed(() => JSON.stringify(appStore.favoritesList) !== JSON.stringify(appStore.prevFavoritesList));


const getMatchedDog = async () => {
    loading.value = true;

    try {
        if(!appStore.favoritesList.length) {
            recommendedPooch.value = undefined;
            loading.value = false;
            return;
        }

        // get a new match if the previous value is different OR our list of favorites has changed
        if (favoritesChanged.value || matchedPoochIsEmpty) {
            // get the favorited dogs
            const favoritedDogList: Dog[] = await api.getDogsByIds(appStore.favoritesList);
            
            if (!favoritedDogList) return null;
            
            // need to parse out the ids to feed into '/match'
            const dogIds = favoritedDogList.map((dog: any) => dog.id);
            // response = matched id
            const matchId: any = await api.matchDogs(dogIds);
    
            if (!matchId) return null;
    
            appStore.matchedPooch = matchId.data.match;
            appStore.setMatchRevealed(false);
            appStore.setPreviousFavorites([...appStore.favoritesList]);
        }

        // default: set the new/existing matched dog
        if(!matchedPoochIsEmpty) return null;

        const thePooch: Dog[] = await api.getDogsByIds([appStore.matchedPooch]);

        if (!thePooch) return null;

        const { id, img, name, age, breed, zip_code } = thePooch[0];
        
        recommendedPooch.value = {
            id,
            img,
            name,
            age,
            breed,
            zip_code,
        }
        cardKey.value++;
        
    } catch (error) {
        console.error('Error fetching dogs:', error);
    }
    
    loading.value = false;
}

const toggleRevealRecommended = () => {
    appStore.setMatchRevealed(true);
    cardKey.value++;
    jsConfetti.addConfetti();
}

onMounted(() => {
    if (!isAuthExpired.value) {
        getMatchedDog()
    };
})

watch(isAuthExpired, (newValue) => {
    if(!newValue) getMatchedDog();
})

watch(favoritesChanged, (newValue) => {
    if (newValue) getMatchedDog();
})

// watch(matchedPooch, (newValue) => {
//     if (newValue === "") getMatchedDog();
// })

watch(() => appStore.favoritesList, async(newFavorites, oldFavorites) => {
    if (JSON.stringify(newFavorites) !== JSON.stringify(oldFavorites)) {
        nextTick(() => {
            if (matchedPoochIsEmpty) {
                appStore.setMatchRevealed(false);
                recommendedPooch.value = undefined;
            }
            // appStore.setMatchRevealed(true);
            getMatchedDog();
        })
    }
}, { deep: true})
</script>
