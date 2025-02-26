<template>
    <v-container fluid class="pa-0">
        <v-row>
            <v-col cols="12" class="px-8">
                <div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">

                    <div style="display: flex; flex-direction: column; width: 100%;">

                        <div class="text-body" style="display: flex; flex-direction: row; align-items: center;">
                            Applied Filters
                            <v-chip class="ml-2 opacity-100 rounded-sm" variant="plain" color="primary" density="compact"
                                closable close-icon="mdi-close">
                                <span>clear all</span>
                            </v-chip>
                        </div>
                        <div class="d-flex ga-2">

                            <!-- TODO: LOOP THIS -->
                            <v-chip class="my-2 opacity-100" variant="flat" color="primary" density="compact" closable>
                                <span>Mock_BreedName</span>
                            </v-chip>
                            <v-chip class="my-2 opacity-100" variant="flat" color="primary" density="compact" closable>
                                <span>Mock_level</span>
                            </v-chip>

                        </div>
                    </div>
                    <div style="width: 200px;">
                        <v-select v-model="sortBySelected" :items="sortByList" color="primary" label="Sort By" variant="solo"
                            class="my-1 opacity-100" />
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="d-flex flex-wrap justify-center" style="overflow-y: auto;">

                <v-card v-for="i in 10" :key="i" class="mx-2 my-2" style="width: 280px;">
                    <v-img
                        :src="`https://picsum.photos/seed/${i}/300/200`"
                        height="200px"
                        width="100%"
                        class="rounded-t-lg"
                        style="object-fit: cover;"
                        >
                        <div style="display: flex; flex-direction: row; width: 100%; justify-content: end;">
                            <v-btn 
                                icon 
                                variant="plain" 
                                :color="likedImg ? 'error' : 'white'" 
                                @click="likedImg = !likedImg" 
                                class="opacity-100"
                                >
                                <v-icon v-if="likedImg" icon="mdi-heart" />
                                <v-icon v-else icon="mdi-heart-outline" />
                            </v-btn>
                        </div>
                    </v-img>
                    <v-card-title>
                        Name {{ i }}
                    </v-card-title>
                    <v-card-subtitle>
                        Breed {{ i }}&nbsp; |&nbsp; Age {{ i }}&nbsp; |&nbsp; Location {{ i }}
                    </v-card-subtitle>
                    <!-- <v-card-text>
                        Age: {{ i }} Location: {{ i }}
                    </v-card-text> -->
                    <v-card-actions>
                        <v-spacer />
                        <v-btn variant="plain" color="primary">
                            View
                        </v-btn>
                        <v-btn variant="plain" color="primary" class="text-capitalize" append-icon="mdi-share">
                            share
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const sortByList = ['Ascending', 'Descending', 'Distance', 'Age'];
const sortBySelected = ref('Ascending');

const likedImg = ref(false);

</script>


<style scoped></style>