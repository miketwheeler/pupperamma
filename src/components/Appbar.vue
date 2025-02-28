<template>
    <v-app-bar 
        flat
        height="64"
        color="surface"
        >
        <v-container fluid max-width="1400px" class="d-flex justify-space-between align-center">
            <v-app-bar-title style="max-width:1400px">
                <v-btn
                    variant="text" 
                    color="white" 
                    href="/"
                    size="xl"
                    style="display: flex; align-items: center; width: fit-content; padding: 0; margin: 0; text-transform: none;"
                    >
                    <strong>Pupperamma</strong>
                    <v-icon color="white" class="ml-2">mdi-dog</v-icon>
                </v-btn>
            </v-app-bar-title>

            <!-- <v-spacer /> -->
            <div style="display: flex; flex-direction: row; align-items: center;">
                <v-btn color="white" :prepend-icon="'mdi-heart'" to="favorites">Faves</v-btn>
                <v-divider vertical thickness="1"  opacity="100%"  height="80%" class="my-3 mx-2"></v-divider>
                <v-btn icon="mdi-account" @click="showAuthDialog(true)"></v-btn>
            </div>
            <!-- </template> -->
        </v-container>
    </v-app-bar>
    <v-toolbar class="px-4" color="primary" style="position: sticky !important; top: 64px; z-index: 100;" flat>
        <v-container fluid max-width="1400px" class="d-flex justify-space-between align-center">
            <v-spacer />
            <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; height: fit-content;">
                <v-select
                    :value="distanceFrom"
                    :items="[100, 50, 25, 10, 5]"
                    flat
                    width="65"
                    variant="plain"
                    density="compact"
                    close-text="miles"
                    menu-icon="mdi-chevron-down"
                    style="margin-bottom: -14px;" 
                    >
                </v-select>
                <div style="display: flex; flex-direction: row; align-items: center;">
                    &nbsp;miles from &nbsp; <b><strong>{{ currentLocation }}</strong></b><v-icon class="ml-1">mdi-map-marker-radius</v-icon>
                </div>
            </div>
        </v-container>

        <AuthDialog :id="'appbar-invoked'" :visible="authDialogVisible" @update:visible="authDialogVisible = $event" />
    </v-toolbar>
</template>

<script setup>
import { ref } from 'vue';
import AuthDialog from '@/components/menu/AuthDialog.vue';


const mobileDrawer = ref(false);
const authDialogVisible = ref(false);
const currentLocation = ref('Los Angeles, CA');
const distanceFrom = ref(100);

const showAuthDialog = (isVisible) => {
    authDialogVisible.value = isVisible;
}

</script>