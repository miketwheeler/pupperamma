<template>
    <v-row>
        <v-col cols="12" class="px-8" style="min-height: 40px;">
            <div class="text-body" style="display: flex; flex-direction: row; align-items: center;">
                Applied Filters
                <v-btn
                    class="ml-2 mt-auto opacity-100 rounded-sm" 
                    variant="plain" 
                    color="primary" 
                    density="compact"
                    size="small"
                    @click="resetFilters"
                    >
                    <span>clear all</span>
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
            <div class="d-flex ga-1 flex-wrap pt-1" style="width: 100%;">
                <v-chip 
                    v-if="appStore.filterState.sortBy" 
                    :key="`filter-sort-by-${appStore.filterState.sortBy}`"
                    class="opacity-100" 
                    variant="flat" 
                    color="secondary" 
                    density="compact" 
                    >
                    <span>{{ appStore.filterState.sortBy }}</span>
                </v-chip>
            </div>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';


const appStore = useAppStore();

const resetFilters = () => {
    appStore.resetFilterState();
}
const removeBreedFromFilter = (breed: string) => {
    appStore.filterState.breeds.splice(appStore.filterState.breeds.indexOf(breed), 1);
}
</script>


<style scoped></style>