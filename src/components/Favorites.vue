<template>
    <!-- The favorites display page -->
    <v-container height="calc(100% - 40px)" fluid max-width="1400px">

        <!-- display load spinner on loading -->
        <v-row v-if="loading" class="fill-height">
            <v-col cols="12" class="d-flex justify-center align-center fill-height">
                <v-progress-circular indeterminate color="primary" size="64"/>
            </v-col>
        </v-row>

        <v-row v-else class="fill-height">

            <!-- the left-hand panel only for displaying the recommended dog -->
            <v-col cols="12" xs="12" sm="5" md="4" class="mt-3">
                <div class="text-h5 font-weight-bold mb-8">
                    Recommended
                </div>

                <!-- cover & action reveal panel (overlaid on recommended dog area) -->
                <v-sheet
                    v-if="!appStore.matchRevealed && appStore.favoritesList.length > 0 && !loading"
                    elevation="3"
                    color="error"
                    min-height="400px"
                    style="border-radius: 8px;"
                    id="reveal-recommended-card"
                    >
                    <div class="recommended-overlay">
                        <v-btn
                            color="primary"
                            text="Reveal Your new buddy!"
                            :append-icon="'mdi-heart'"
                            @click="toggleRevealRecommended"
                            />
                    </div>
                </v-sheet>

                <!-- the recommended dog and related data -->
                <v-card
                    v-else-if="appStore.matchRevealed && recommendedPup && !loading"
                    elevation="3"
                    color="error"
                    id="recommended-dog-card"
                    >
                    <!-- v-if="recommendedPup" -->
                    <v-img
                        :src="recommendedPup.img"
                        height="400px"
                        width="100%"
                        class="rounded-t-lg"
                        cover
                        />
                    <v-card-title class="text-h5">{{ recommendedPup?.name }}</v-card-title>
                    <v-card-text class="text-body-1">
                        <strong>{{ recommendedPup?.name }}</strong> is {{ /^[aeiou]/i.test(recommendedPup?.breed.charAt(0)) ? 'an' : 'a' }}
                        <strong>{{ recommendedPup?.breed }}</strong>! An adorable pup who is 
                        <strong>{{ recommendedPup?.age > 1 ? recommendedPup.age + " years old" : recommendedPup.age < 1 ? "of unknown age" : "a " + recommendedPup.age + " year old"  }}</strong> and can be picked up near the zip code 
                        <strong>{{ recommendedPup?.zip_code }}</strong>.
                        <br />
                        <div>Take home {{ recommendedPup?.name }} today!</div>
                    </v-card-text>
                </v-card>

                <!-- empty: no favorites to generate a match with -->
                <v-card
                    v-else-if="appStore.favoritesList.length === 0 && !loading"
                    elevation="3"
                    color="surface"
                    id="recommended-dog-card"
                    >
                    <v-card-text>
                        No favorites to generate a match with 🙁
                    </v-card-text>
                </v-card>
            </v-col>

            <v-divider hidden="sm" vertical class="mx-2" />

            <v-col cols="12" xs="12" sm="6" md="7" class="d-flex flex-column">

                <!-- Favorites dog card grid -->
                <CardGrid page="favorites" />

            </v-col>

        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, toRaw } from 'vue';
import CardGrid from '@/components/body/CardGrid.vue';
import { useAppStore } from '@/stores/app';
import api, { type Dog } from '@/services/api';
import JSConfetti from 'js-confetti';


const appStore = useAppStore();
const jsConfetti = new JSConfetti();

const recommendedPup = ref<Dog | undefined>();
const loading = ref(false);
const isAuthExpired = computed(() => appStore.isAuthExpired);


const getMatchedPup = async () => {
    loading.value = true;

    try {
        // if there are no favorites, reset the recommended dog
        if(appStore.favoritesList.length === 0) {
            recommendedPup.value = undefined;
            appStore.matchedPup = "";
            appStore.setMatchRevealed(false);
            return;
        }

        // get a new match if the previous value is different OR our list of favorites has changed
        if (appStore.matchedPup === "") {
            // need to parse out the ids to feed into '/match'
            const dogIds = appStore.favoritesList;
            // response = matched id
            const matchId: any = await api.matchDogs(dogIds);

            if (!matchId || !matchId.data || !matchId.data.match) {
                console.log('Invalid matchId:', matchId);
                recommendedPup.value = undefined;
                return;
            }
            appStore.matchedPup = matchId.data.match;
            appStore.setMatchRevealed(false);
        }

        // use the matchedId to fetch the single dog
        // instead of fetching single, could of used cardStack, searched for that Id, but 
        //   the card stack is rotated by page, son only a subset 'exist' at any given time
        const match: Dog[] = await api.getDogsByIds([appStore.matchedPup]);

        if (!match || match.length === 0) {
            console.log('Invalid dog:', match);
            recommendedPup.value = undefined;
            return;
        };
        
        recommendedPup.value = match[0]; // only one returned, so grab the first
        
    } catch (error) {
        console.error('Error fetching dogs:', error);
        recommendedPup.value = undefined;
    }
    
    loading.value = false;
}

// reveal the recommended dog
const toggleRevealRecommended = () => {
    appStore.setMatchRevealed(true);
    jsConfetti.addConfetti();
}

onMounted(() => {
    if (!isAuthExpired.value) {
        getMatchedPup()
    };
})

watch([
    () => appStore.favoritesList, 
    isAuthExpired
], async(newValues, oldValues) => {
    console.log("favorites watcher triggered")
    console.log("newValues:", newValues)
    console.log("oldValues:", oldValues)

    const [newFavorites, newAuthExpired] = newValues;
    const [oldFavorites, oldAuthExpired] = oldValues;

    console.log("newFavorites:", newFavorites)
    console.log("oldFavorites:", oldFavorites)


    if (!newAuthExpired) {
        const favesChanged = newFavorites.length !== oldFavorites.length || !newFavorites.every((val: any) => oldFavorites.includes(val)) 
        const matchExistsInFavorites = newFavorites.includes(appStore.matchedPup);

        // anytime it changes, if the matched was removed., reset the matched params
        if (favesChanged && !matchExistsInFavorites) {
            appStore.matchedPup = "";
            appStore.setMatchRevealed(false);

        // else if there was no matched, fetch one
        } else if (!appStore.matchedPup) {
            await getMatchedPup();
        }
    }
}, { deep: true })
</script>

<style scoped>
.recommended-overlay {
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px !important;
    border-radius: 8px;
    width: 100%;
}
</style>