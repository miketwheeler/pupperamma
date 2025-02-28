<template>
    <div class="text-h6 ml-2 mb-1">Categories</div>
    <v-select
        v-model="appStore.filterState.breeds"
        :items="breedList"
        :count="breedsCount"
        label="Breed(s)"
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

    <div class="text-h6 ml-2 mb-1">Results</div>
    <div style="display: flex; flex-direction: row; gap: 0.5rem;">
        <v-text-field
            v-model="appStore.filterState.ageMin"
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
            label="Age Max"
            color="primary"
            variant="solo"
            class="my-1 opacity-100"
            type="number"
            maxWidth="120px"
            minWidth="80px"
            :min="appStore.filterState.ageMin"
            max="30"
            />
    </div>
    <div style="display: flex; flex-direction: row; gap: 0.5rem;">
        <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: end; gap: 0.5rem;">
            <v-select 
                v-model="appStore.filterState.sortBy" 
                :items="extraSortByList" 
                color="primary" 
                label="Sort By" 
                variant="solo"
                class=" opacity-100"
                />
            <v-select 
                v-model="appStore.filterState.size" 
                :items="resultsPerPage" 
                color="primary" 
                label="Show" 
                variant="solo"
                class="opacity-100" 
                minWidth="104px"
                />
            <v-radio-group v-model="appStore.filterState.sortDir"  >
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
    <div style="display: flex; width: 100%">
        <v-btn 
            class="ml-auto mt-auto opacity-100 rounded-sm" 
            variant="plain" 
            color="primary" 
            density="compact"
            size="small"
            @click="appStore.resetFilterState()"
            >
            <span>clear all</span>
        </v-btn>
    </div>
</template>



<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAppStore } from '@/stores/app';
import api from '@/services/api';

const appStore = useAppStore();
const isAuthExpired = computed(() => appStore !== null && appStore.isAuthExpired);
const selectedBreeds = ref([]);
const extraSortByList = ['Breed', 'Name', 'Distance', 'Age'];
const resultsPerPage = [10, 20, 50, 100];

const breedsCount = computed(() => {
    return appStore.filterState.breeds.length || 0;
});

const breedList = ref<any[]>([]);


onMounted(async () => {
    if (isAuthExpired.value) return;

    try {
        const breeds: any = await api.getBreeds();
        breedList.value = breeds.data;
    } catch (error) {
        console.error('Error fetching breeds', error);
    }
})

watch(isAuthExpired, async (newValue) => {
    if (newValue) return;
    
    try {
        const breeds: any = await api.getBreeds();
        breedList.value = breeds.data;
    } catch (error) {
        console.error('Error fetching breeds', error);
    }
})
watch(selectedBreeds, (newValue) => {
    if (newValue) return;

    appStore.setFilterState({
        breeds: selectedBreeds.value,
    });
})
</script>


<style scoped>

</style>