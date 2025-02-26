<template>
    <v-container height="calc(100% - 40px)" fluid max-width="1400px">
        <v-row class="fill-height">
            <v-col cols="4">
                <v-card
                    class="py-4"
                    prepend-icon="mdi-filter"
                    image="/src/assets/pupsSideEye_isnet-anime.png"
                    height="100%"
                    elevation="3"
                    style="background-color: transparent;"
                    >
                    <!-- style="background-color: transparent; outline: 2px solid rgba(255, 255, 255, 0.2);" -->
                    <template #image>
                        <v-img position="right" style="opacity: 0.15; height: 1000px; transform: translate(0%, 20%);" />
                    </template>
                    <template #title>
                        <h2 class="text-h5 font-weight-bold">Filter</h2>
                    </template>
                    <template #text>

                        <FilterPanel />

                    </template>
                </v-card>
            </v-col>

            <v-col cols="8">

                <CardGrid />

            </v-col>

        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import FilterPanel from '@/components/body/FilterPanel.vue';
import CardGrid from '@/components/body/CardGrid.vue';


</script>
