<template>
  <v-main>
    <Appbar />
    <CustomSnackbar />
    <!-- <AuthDialog :id="'top-level-auth-invoked'" @update:visible="authDialogVisible" /> -->
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script setup>
import Appbar from '@/components/Appbar.vue';
import CustomSnackbar from '@/components/menu/CustomSnackbar.vue';
import AuthDialog from '@/components/menu/AuthDialog.vue';
import { ref, onMounted, watch, computed } from 'vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const authDialogVisible = ref(false);
const isLoggedIn = computed(() => appStore.session.loggedIn);

// const showAuthDialog = (isVisible) => {
//     authDialogVisible.value = isVisible;
// }

// onMounted(() => {
//     if (!isLoggedIn.value) {
//         showAuthDialog(true);
//     }
// });
</script>
