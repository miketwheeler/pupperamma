<template>
    <!-- <AuthDialog :id="'top-level-auth-invoked'" @update:visible="authDialogVisible" /> -->

    <v-container height="calc(100% - 40px)" fluid max-width="1400px">
        <v-row class="fill-height">
            <v-col cols="12" xs="12" sm="4" md="3">
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

            <v-col cols="12"xs="12" sm="8" md="9" class="d-flex flex-column">
                
                <AppliedFilters />
                <CardGrid page="home" />

            </v-col>

        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useAppStore } from '@/stores/app';
// import AuthDialog from '@/components/menu/AuthDialog.vue';
import FilterPanel from '@/components/body/FilterPanel.vue';
import CardGrid from '@/components/body/CardGrid.vue';
import AppliedFilters from '@/components/body/AppliedFilters.vue';


const appStore = useAppStore();
const authDialogVisible = ref(false);
// const isAuthExpired = computed(() => appStore.isAuthExpired);


// const showAuthDialog = (isVisible) => {
//     authDialogVisible.value = isVisible;
// }

// onMounted(() => {
//     if (isAuthExpired.value){
//         console.log('isAuthExpired in default.vue: ', isAuthExpired.value);
//         showAuthDialog(true);
//     };

// });

// watch(isAuthExpired, (newValue) => {
//     if (newValue) {
//         console.log('isAuthExpired in default.vue: ', newValue);
//         showAuthDialog(true);
//     };
// });
</script>
