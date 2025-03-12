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
import FilterPanel from '@/components/body/FilterPanel.vue';
import CardGrid from '@/components/body/CardGrid.vue';
import AppliedFilters from '@/components/body/AppliedFilters.vue';


</script>

<style scoped>
</style>