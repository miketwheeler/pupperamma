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
            
            <v-col cols="12" xs="12" sm="6" md="5" class="mt-3">
                <div class="text-h5 font-weight-bold mb-8">
                    Recommended
                </div>
                <v-card
                    v-if="recommendedPooch"
                    :key="`recommended-dog-card-${cardKey}`"
                    height="100%"
                    max-height="790px"
                    elevation="3"
                    color="error"
                    lazy
                    id="recommended-dog-card"
                    >
                    <v-img
                        :src="recommendedPooch.img"
                        height="630px"
                        width="100%"
                        class="rounded-t-lg"
                        cover
                        />
                    <v-card-title>{{ recommendedPooch.name }}</v-card-title>
                    <v-card-text>
                        <strong>{{ recommendedPooch.name }}</strong> is a(n)
                        <strong>{{ recommendedPooch.breed }}</strong> is an adorable pup who is <strong>{{ recommendedPooch.age }}</strong> years old and lives near <strong>{{ recommendedPooch.zip_code }}</strong>.
                        <br />
                        <div>Take home {{ recommendedPooch.name }} today!</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-divider hidden="sm" vertical class="mx-2" />

            <v-col cols="12" xs="12" sm="5" md="6" class="d-flex flex-column">

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


const appStore = useAppStore();

const recommendedPooch = ref<Dog>();
const loading = ref(false);
const matchedDogId = ref<string>();
const cardKey = ref(0);
const isAuthExpired = computed(() => appStore.isAuthExpired);

const getMatchedDog = async () => {
    loading.value = true;

    try {
        // get the favorited dogs
        const favoritedDogList: any = await api.getDogsByIds(appStore.favorites);
        
        if (!favoritedDogList) return null;
        
        // need to parse out the ids to feed into '/match'
        const dogIds = favoritedDogList.data.map((dog: any) => dog.id);
        // response = matched id
        const matchedDogId: any = await api.matchDogs(dogIds);

        if (!matchedDogId) return null;

        matchedDogId.value = matchedDogId.data.match;
        appStore.matchedPooch = matchedDogId.value;
        // console.log('matchedDogId', matchedDogId.value);
        
        if (!matchedDogId.value) return null;

        const thePooch: any = await api.getDogsByIds([matchedDogId.value]);

        if (!thePooch) return null;
        
        recommendedPooch.value = {
            id: thePooch.data[0].id,
            img: thePooch.data[0].img,
            name: thePooch.data[0].name,
            age: thePooch.data[0].age,
            breed: thePooch.data[0].breed,
            zip_code: thePooch.data[0].zip_code,
        }
        
    } catch (error) {
        console.error('Error fetching dogs:', error);
    }
    
    loading.value = false;
}

onMounted(() => {
    if (!isAuthExpired.value) getMatchedDog();
})

watch(isAuthExpired, (newValue) => {
    if(!newValue) getMatchedDog();
})
watch(recommendedPooch, (newValue) => {
    cardKey.value += 1;
})
</script>
