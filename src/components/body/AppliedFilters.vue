<template>
    <v-row>
        <v-col cols="12" class="px-8" style="min-height: 40px;">

            <!-- title and clear/reset filter to defautls -->
            <div class="text-body" style="display: flex; flex-direction: row; align-items: center;">
                Applied Filters
                <v-btn
                    class="ml-2 opacity-100 rounded-sm"
                    variant="plain" 
                    color="primary" 
                    density="compact"
                    size="small"
                    @click="appStore.resetFilterState()"
                    >
                    <span>reset all</span>
                </v-btn>
            </div>

            <!-- filter items - breed -->
            <div class="d-flex ga-1 flex-wrap pt-1" style="width: 100%;">
                <v-chip 
                    v-if="appStore.filterState.breeds.length" 
                    v-for="breed in appStore.filterState.breeds"
                    :key="`filter-breed-${breed}`"
                    class="opacity-100" 
                    variant="flat" 
                    color="primary" 
                    density="compact" 
                    closable
                    @click:close="removeBreedFromFilter(breed)"
                    >
                    <span>{{ breed }}</span>
                </v-chip>
            </div>

            <!-- filter items - others (age, sort by, asc/desc distance, etc) -->
            <div class="d-flex ga-1 flex-wrap mt-2 py-2 px-1" style="width: 100%; background-color: rgb(var(--v-theme-surface)); border-radius: 8px;">
                <!-- <v-chip 
                    v-if="appStore.locationData.stateAbbrvs.length" 
                    key="filter-sort-by-breed"
                    class="opacity-100" 
                    variant="tonal" 
                    color="white" 
                    density="compact" 
                    width="100%"
                    style="display: flex; flex-direction: row; align-items: center; gap: 0.5rem;"
                    >
                    <div style="display: flex; flex-direction: row; flex-wrap: nowrap; gap: 0.2rem">States: 
                        <div v-for="state, index in appStore.locationData.stateAbbrvs" style="display: flex; flex-direction: row; width: fit-content;">
                            {{ state }}
                            <div v-if="index > 0 && index < appStore.locationData.stateAbbrvs.length - 1">, </div>
                        </div>
                    </div>
                </v-chip> -->
                <v-chip 
                    v-if="appStore.filterState.sortBy" 
                    key="filter-sort-by-breed"
                    class="opacity-100" 
                    variant="tonal" 
                    color="white" 
                    density="compact" 
                    >
                    <span>Sorted By {{ appStore.filterState.sortBy }}</span>
                </v-chip>
                <v-chip 
                    v-if="appStore.filterState.ageMin && appStore.filterState.ageMax" 
                    key="filter-age-range"
                    class="opacity-100" 
                    variant="tonal" 
                    color="white" 
                    density="compact" 
                    >
                    <span>Ages {{ appStore.filterState.ageMin }} to {{ appStore.filterState.ageMax }}</span>
                </v-chip>
                <v-chip 
                    v-if="appStore.filterState.sortDir" 
                    key="filter-sorted-direction"
                    class="opacity-100" 
                    variant="tonal" 
                    color="white" 
                    density="compact" 
                    >
                    <span>{{ appStore.filterState.sortDir === 'asc' ? 'A to Z' : 'Z to A' }}</span>
                </v-chip>
                <v-chip 
                    v-if="appStore.filterState.size" 
                    key="filter-results-per-page"
                    class="opacity-100" 
                    variant="tonal" 
                    color="white" 
                    density="compact" 
                    >
                    <span>{{ appStore.filterState.size }} per page</span>
                </v-chip>
            </div>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';


const appStore = useAppStore();

// removes a single 
const removeBreedFromFilter = (breed: string) => {
    appStore.filterState.breeds.splice(appStore.filterState.breeds.indexOf(breed), 1);
}
</script>


<style scoped>
</style>