<template>
    <v-container height="calc(100% - 40px)" fluid max-width="1400px">
        <v-row class="fill-height">

            <!-- left-hand Filter Panel -->
            <v-col cols="12" xs="12" sm="4" md="3">
                <v-card
                    class="py-4 filter-card"
                    prepend-icon="mdi-filter"
                    height="100%"
                    elevation="3"
                    >
                    <template #image>
                        <v-img 
                            src="/src/assets/pupsSideEye_isnet-anime.png" 
                            position="right"
                            max-height="1000px"
                            cover 
                            eager
                            :aspect-ratio="imageAspectRatio"
                            class="filter-card-image"
                            />
                    </template>
                    <template #title>
                        <h2 class="text-h5 font-weight-bold">Filter</h2>
                    </template>
                    <template #text>
                        
                        <!-- the filter parameter selections -->
                        <FilterPanel />

                    </template>
                </v-card>
            </v-col>

            <!-- The main body section (except the left-hand filterPanel)-->
            <v-col cols="12"xs="12" sm="8" md="9" class="d-flex flex-column">

                <!-- visual feedback for applied filter state -->
                <AppliedFilters />

                <!-- card grid -->
                <CardGrid page="home" />
            </v-col>

        </v-row>
    </v-container>
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import FilterPanel from '@/components/body/FilterPanel.vue';
import CardGrid from '@/components/body/CardGrid.vue';
import AppliedFilters from '@/components/body/AppliedFilters.vue';


const imageAspectRatio = ref<number>(1);

onMounted(() => {
    // preload image to get aspect ratio
    const img = new Image();
    img.onload = () => {
        imageAspectRatio.value = img.naturalWidth / img.naturalHeight;
    }
    img.src = '/src/assets/pupsSideEye_isnet-anime.png';
})

</script>

<style scoped>
.filter-card {
    border: 1px solid var(--v-border-color);
    background-color: var(--v-background-base);
    overflow: hidden;
}
.filter-card-image {
    opacity: 0.15;
    transform: translateY(36%);
}

@media (max-width: 599px) {
    .filter-card-image {
        width: auto;
        transform: translate(-20%, 20%);
    }
}
</style>