<template>

    <!-- breed multiselection -->
    <div class="text-h6 ml-2 mb-1">Categories</div>
    <v-select
        v-model="appStore.filterState.breeds"
        :items="breedList"
        :count="breedsCount"
        :label="breedsCount > 1 ? 'Breeds' : 'Breed'"
        color="primary"
        variant="solo"
        messages="Select one or more breeds"
        multiple
        class="mt-1 opacity-100 mb-2"
        >
        <template v-slot:selection="{ item, index }">
            <span v-if="index===0" class="text-grey text-caption align-self-center">
                ({{ breedsCount }}) Selected 
            </span>
        </template>
    </v-select>

    <v-divider class="my-4" style="width: 80%; justify-self: center;" />

    <!-- Location/distance from origin -->
    <!-- <div class="text-h6 ml-2" style="display: flex; flex-direction: row;">
        Location
    </div>
    <v-select
        v-model="appStore.locationData.stateAbbrvs"
        :items="stateAbbrvsList"
        :count="statesCount"
        :label="statesCount > 1 ? 'States' : 'State'"
        @update:model-value="appStore.setStateAbbrvs($event)"
        multiple
        variant="solo"
        color="primary"
        >
        <template v-slot:selection="{ item, index }">
            <span v-if="index===0" class="text-grey text-caption align-self-center">
                ({{ statesCount }}) {{ statesCount > 1 ? 'States' : 'State' }}
            </span>
        </template>
    </v-select>

    <v-divider class="my-4" style="width: 80%; justify-self: center;" /> -->

    <!-- min/max age range -->
    <div class="text-h6 ml-2 mb-1">Results</div>
    <div style="display: flex; flex-direction: row; gap: 0.5rem;">
        <v-text-field
            v-model="appStore.filterState.ageMin"
            :disabled="appStore.pagination.total === 0"
            label="Age Min"
            color="primary"
            variant="solo"
            class="my-1 opacity-100"
            type="number"
            maxWidth="120px"
            minWidth="80px"
            min="0"
            :max="appStore.filterState.ageMax"
            />
        <div style="display: flex; align-items: center;">to</div>
        <v-text-field
            v-model="appStore.filterState.ageMax"
            :disabled="appStore.pagination.total === 0"
            label="Age Max"
            color="primary"
            variant="solo"
            class="my-1 opacity-100"
            type="number"
            maxWidth="120px"
            minWidth="80px"
            :min="appStore.filterState.ageMin"
            max="40"
            />
    </div>

    <!-- sort-by selection, results per page, sort direction -->
    <div style="display: flex; flex-direction: row; gap: 0.5rem;">
        <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: end; gap: 0.5rem;">
            <v-select 
                v-model="appStore.filterState.sortBy" 
                :items="extraSortByList"
                :disabled="paginationTotal <= 1"
                color="primary" 
                label="Sort By" 
                variant="solo"
                class=" opacity-100"
                />
            <v-select 
                v-model="appStore.filterState.size" 
                :items="resultsPerPage" 
                :disabled="paginationTotal <= 10"
                @update:model-value="appStore.setResultsPerPage($event)"
                color="primary" 
                label="Show" 
                variant="solo"
                class="opacity-100" 
                minWidth="104px"
                />
            <v-radio-group :disabled="paginationTotal < 2" v-model="appStore.filterState.sortDir"  >
                <v-radio
                    label="Ascending"
                    appendIcon="mdi-filter-list"
                    value="asc"
                    color="primary"
                    />
                <v-radio
                    label="Descending"
                    value="desc"
                    color="primary"
                    />
            </v-radio-group>            
        </div>
    </div>

    <!-- Resets all filters to defaults -->
    <div style="display: flex; width: 100%">
        <v-btn 
            class="ml-auto mt-auto opacity-100 rounded-sm" 
            variant="plain" 
            color="primary" 
            density="compact"
            size="small"
            @click="appStore.resetFilterState()"
            >
            <span>reset all</span>
        </v-btn>
    </div>

</template>


<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAppStore } from '@/stores/app';
import api from '@/services/api';
import locApi from '@/services/locApi';


const appStore = useAppStore();

const isAuthExpired = computed(() => appStore !== null && appStore.isAuthExpired);
const selectedBreeds = ref([]);
const extraSortByList = ['Breed', 'Name', 'Distance', 'Age'];
const stateAbbrvsList: string[] = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
// const statesCount = computed(() => appStore.locationData.stateAbbrvs.length);
const paginationTotal = computed(() => appStore.pagination.total);
const stateNameToAbbr: Record<string, string> = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
};
const resultsPerPage = [10, 20, 50, 100];
const breedsCount = computed(() => {
    return appStore.filterState.breeds.length || 0;
});
const breedList = ref<any[]>([]);


onMounted(async () => {
    if (isAuthExpired.value) return;

    if (appStore.isUserGeoDataEmpty) getGeoData();

    try {
        const breeds: any = await api.getBreeds();
        breedList.value = breeds;
    } catch (error) {
        console.error('Error fetching breeds', error);
    }
})

const getGeoData = async () => {
    if(navigator.geolocation && appStore.isUserGeoDataEmpty) {
        navigator.geolocation.getCurrentPosition(async (position) => {            
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const reverseLookupFromLatLon = await locApi.getLocData(lat, lon);

            const { postcode, state } = reverseLookupFromLatLon?.address;
            const stateAbbrv = stateNameToAbbr[state];
            if(postcode && state && lat && lon && stateAbbrv) {
                appStore.setUserGeoData({
                    postcode,
                    state,
                    stateAbbrv,
                    lat,
                    lon,
                });
            }
        }, 
        (error) => console.error('Error getting location:', error));        
    } else {
        console.error('Geolation not available!');
    }
}

watch(isAuthExpired, async (newValue) => {
    if (newValue) return;
    
    try {
        const breeds: any = await api.getBreeds();
        breedList.value = breeds;
    } catch (error) {
        console.error('Error fetching breeds', error);
    }
})
watch(selectedBreeds, (newValue) => {
    if (newValue) return;

    appStore.setFilterBreeds(selectedBreeds.value);
})
</script>


<style scoped>

</style>