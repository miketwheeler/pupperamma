<template>
    <v-app-bar 
        flat
        height="64"
        color="surface"
        >

        <v-app-bar-title style="max-width:1400px"><strong>Pupperamma</strong><v-icon color="warning" class="ml-2">mdi-dog</v-icon></v-app-bar-title>

        <template v-slot:append>
            <v-btn color="error" icon="mdi-heart"></v-btn>
            <v-divider vertical thickness="1"  opacity="100%"  height="80%" class="my-3 mx-2"></v-divider>
            <v-btn icon="mdi-account"></v-btn>
        </template>

    </v-app-bar>
    <v-toolbar class="px-4" color="primary" style="position: sticky !important; top: 64px; z-index: 100;" flat>
        <template v-slot:append>
            <v-select
                :value="distanceFrom"
                :items="[100, 50, 25, 10, 5]"
                flat
                width="65"
                variant="plain"
                density="compact"
                close-text="miles"
                menu-icon="mdi-chevron-down"
                class="mt-auto"
                >
            </v-select>
            <div style="display: flex; flex-direction: row; align-items: center;">
                &nbsp;miles from &nbsp; <b><strong>{{ currentLocation }}</strong></b><v-icon class="ml-1">mdi-map-marker-radius</v-icon>
            </div>
        </template>
    </v-toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileDrawer = ref(false);
const currentLocation = ref('Los Angeles, CA');
const distanceFrom = ref(100);

</script>