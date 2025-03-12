<template>
    <!-- the row of chips that indicate which filters are being applied -->
    <v-row>
        <v-col cols="12" class="px-8" style="min-height: 40px;">

            <!-- title and clear/reset filter to defautls -->
            <div class="text-body d-flex flex-row align-center">
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
            <div class="d-flex ga-1 flex-wrap pt-1">
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
            <div class="d-flex ga-1 flex-wrap mt-2 py-2 px-1">
                <v-chip 
                    v-if="appStore.filterState.sortBy" 
                    key="filter-sort-by-breed"
                    class="opacity-100" 
                    variant="tonal" 
                    color="text" 
                    density="compact" 
                    >
                    <span>Sorted By {{ appStore.filterState.sortBy }}</span>
                </v-chip>
                <v-chip 
                    v-if="appStore.filterState.ageMin > -1 && appStore.filterState.ageMax" 
                    key="filter-age-range"
                    class="opacity-100" 
                    variant="tonal" 
                    color="text" 
                    density="compact" 
                    >
                    <span>Ages {{ appStore.filterState.ageMin }} to {{ appStore.filterState.ageMax }}</span>
                </v-chip>
                <v-chip 
                    v-if="appStore.filterState.sortDir" 
                    key="filter-sorted-direction"
                    class="opacity-100" 
                    variant="tonal" 
                    color="text" 
                    density="compact" 
                    >
                    <span>{{ appStore.filterState.sortDir === 'asc' ? 'A to Z' : 'Z to A' }}</span>
                </v-chip>
                <v-chip 
                    v-if="appStore.filterState.size" 
                    key="filter-results-per-page"
                    class="opacity-100" 
                    variant="tonal" 
                    color="text" 
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
    appStore.removeBreedFromFilter(breed);
}
</script>


<style scoped>
</style>