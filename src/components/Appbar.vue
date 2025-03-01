<template>

    <!-- Primary AppBar -->
    <v-app-bar flat height="64" color="surface">
        <v-container fluid max-width="1400px" class="d-flex justify-space-between align-center">
            <v-app-bar-title style="max-width:1400px">
                <v-btn
                    variant="text" 
                    color="text" 
                    href="/"
                    size="xl"
                    style="display: flex; align-items: center; width: fit-content; padding: 0; margin: 0; text-transform: none;"
                    >
                    <strong>Pupperamma</strong>
                    <v-icon color="text" class="ml-2">mdi-dog</v-icon>
                </v-btn>
            </v-app-bar-title>

            <!-- Displays the >=sm screen appbar items -->
            <div class="d-none d-sm-flex hidden-sm-and-down" style="display: flex; flex-direction: row; align-items: center;">
                <v-btn solo-inverted :icon="theme.global.name.value === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'" @click="toggleTheme" />
                <v-btn class="d-none d-xs-none d-sm-flex" :prepend-icon="currentRoute === '/' ? 'mdi-heart' : 'mdi-home'" :to="currentRoute === '/' ? 'favorites' : '/'">
                    <template v-slot:default>
                        {{ currentRoute === '/' ? 'Faves' : 'Home' }}
                    </template>
                </v-btn>
                <v-divider vertical thickness="1"  opacity="100%"  height="80%" class="my-3 mx-2"></v-divider>
                <v-btn icon="mdi-logout" color="text" id="appbar-logout-icon" @click="showAuthDialog(true)"></v-btn>
            </div>

            <!-- Toggle mobile drawer only on <=sm screens (mobile drawer below) -->
            <div class="d-flex d-sm-none" style="display: flex; flex-direction: row; align-items: center;">
                <v-btn icon="mdi-menu" @click="toggleMobileDrawer"></v-btn>
            </div>

        </v-container>
    </v-app-bar>

    <!-- Mobile Drawer -->
    <v-navigation-drawer
        class="d-flex d-sm-none"
        v-model="mobileDrawer"
        disable-route-watcher
        location="right"
        app
        color="surface"
        clipped
        temporary
        width="200"
        >
        <v-list-item prepend-icon="mdi-home" to="/" title="Home" />
        <v-list-item prepend-icon="mdi-heart" to="/favorites" title="Favorites" />
        <v-divider class="my-1" />
        <v-list-item
            :prepend-icon="theme.global.name.value === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
            :title="theme.global.name.value === 'light' ? 'Dark Mode' : 'Light Mode'"
            slim
            @click="toggleTheme"
            /> 
        <v-list-item
            prepend-icon="mdi-logout"
            id="drawer-logout"
            color="primary"
            @click="showAuthDialog(true)"
            title="Log out"
            />
    </v-navigation-drawer>

    <!-- Second Toolbar-appbar -->
    <v-toolbar class="px-4" color="primary" style="position: sticky; top: 64px; z-index: 100;" flat>
        <v-container fluid max-width="1400px" class="d-flex justify-space-between align-center hidden-sm-and-down">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; height: fit-content;">
                <v-select
                    :value="distanceFrom"
                    :items="[100, 50, 25, 10, 5]"
                    flat
                    width="65"
                    variant="plain"
                    density="compact"
                    menu-icon="mdi-chevron-down"
                    style="margin-bottom: -14px;" 
                    />
                <div style="display: flex; flex-direction: row; align-items: center;">
                    &nbsp;mi from &nbsp; <b><strong>{{ currentLocation }}</strong></b><v-icon class="ml-1">mdi-map-marker-radius</v-icon>
                </div>
            </div>
            <v-spacer />
            <div class="text-h7 d-none d-sm-block">Hi, <strong>{{ appStore.session.user.email }}</strong></div>
        </v-container>

    </v-toolbar>

    <!-- Auth Dialog -->
    <AuthDialog :id="'appBar-logout'" :visible="authDialogVisible" @update:visible="authDialogVisible = $event" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';
import AuthDialog from '@/components/menu/AuthDialog.vue';


const appStore = useAppStore();
const router = useRouter();
const theme = useTheme();

const mobileDrawer = ref(false);
const currentLocation = ref('Los Angeles, CA');
const authDialogVisible = ref(false);
const distanceFrom = ref(100);
const currentRoute = computed(() => router.currentRoute.value.path);

const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

const toggleMobileDrawer = () => {
    mobileDrawer.value = !mobileDrawer.value;
}

const showAuthDialog = (isVisible) => {
    console.log('showAuthDialog: ', isVisible);
    authDialogVisible.value = isVisible;
}
</script>