<template>

    <!-- breed multiselection -->
    <div class="text-h6 ml-2 mb-1">Categories</div>
    <v-select
        v-model="appStore.filterState.breeds"
        :items="breedList"
        :count="breedsCount"
        :label="breedsCount > 1 ? 'Breeds' : 'Breed'"
        color="primary"
        variant="solo-filled"
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

    <!-- min/max age range -->
    <div class="text-h6 ml-2 mb-1">Results</div>
    <div class="d-flex flex-row ga-2 flex-wrap">
        <v-text-field
            v-model="appStore.filterState.ageMin"
            label="Age Min"
            color="primary"
            variant="solo-filled"
            class="my-1 opacity-100"
            type="number"

            minWidth="80px"
            min="0"
            :max="appStore.filterState.ageMax"
            />
        <div style="display: flex; align-items: center;">to</div>
        <v-text-field
            v-model="appStore.filterState.ageMax"
            label="Age Max"
            color="primary"
            variant="solo-filled"
            class="my-1 opacity-100"
            type="number"

            minWidth="80px"
            :min="appStore.filterState.ageMin"
            max="20"
            />
    </div>

    <!-- sort-by selection, results per page, sort direction -->
    <div class="filter-row-arrangement">
        <v-select 
            v-model="appStore.filterState.sortBy" 
            :items="extraSortByList"
            color="primary" 
            label="Sort By" 
            variant="solo-filled"
            class=" opacity-100"
            />
        <v-select 
            v-model="appStore.filterState.size" 
            :items="resultsPerPage" 
            @update:model-value="appStore.setResultsPerPage($event)"
            color="primary" 
            label="Show" 
            variant="solo-filled"
            class="opacity-100" 
            />
        </div>
        <v-radio-group v-model="appStore.filterState.sortDir">
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

    <!-- Resets all filters to defaults -->
    <div class="d-flex w-100 justify-content-end">
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
const breedsCount = computed(() => {
    return appStore.filterState.breeds.length || 0;
});
const breedList = ref<any[]>([]);
const selectedBreeds = ref([]);
const extraSortByList = ['Breed', 'Name', 'Age'];
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
const isAuthExpired = computed(() => appStore !== null && appStore.isAuthExpired);

// get the breeds list from the API
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

// uses the browser's geolocation API in conjunction with open source
//      openstreetmap.org's reverse geolocation API to get the user's
//      location data
//      - left in for intended use to center filtered results around the 
//          user's location, but this proved far to laborious to implement for now
//      - left in for display purposes (since it's still a noice touch)
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

// if the user changes the breed selection or is re-logged in, update the filter state
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
.filter-row-arrangement {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    justify-content: end; 
    gap: 0.5rem;
}
</style>