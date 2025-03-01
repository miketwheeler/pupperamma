<template>
    <v-row>
        <v-col cols="12" class="px-8" style="min-height: 40px;">
            <div class="text-body" style="display: flex; flex-direction: row; align-items: center;">
                Applied Filters
                <v-btn
                    class="ml-2 opacity-100 rounded-sm" 
                    variant="plain" 
                    color="primary" 
                    density="compact"
                    size="small"
                    @click="resetFilters"
                    >
                    <span>clear</span>
                </v-btn>
            </div>
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
            <div class="d-flex ga-1 flex-wrap mt-2 py-2" style="width: 100%; background-color: rgb(var(--v-theme-surface));">
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
                    <span>Ages {{ appStore.filterState.ageMin }}-{{ appStore.filterState.ageMax }}</span>
                </v-chip>
                <v-chip 
                    v-if="appStore.filterState.sortDir" 
                    key="filter-sorted-direction"
                    class="opacity-100" 
                    variant="tonal" 
                    color="white" 
                    density="compact" 
                    >
                    <span>{{ appStore.filterState.sortDir === 'asc' ? 'A-Z' : 'Z-A' }}</span>
                </v-chip>
                <v-chip 
                    v-if="appStore.filterState.size" 
                    key="filter-results-per-page"
                    class="opacity-100" 
                    variant="tonal" 
                    color="white" 
                    density="compact" 
                    >
                    <span>{{ appStore.filterState.size }} results per pg</span>
                </v-chip>
            </div>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';


const appStore = useAppStore();

// resets all filter params in state
const resetFilters = () => {
    appStore.resetFilterState();
}
// removes a single 
const removeBreedFromFilter = (breed: string) => {
    appStore.filterState.breeds.splice(appStore.filterState.breeds.indexOf(breed), 1);
}
</script>


<style scoped>
</style>