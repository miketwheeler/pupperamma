<template>
  <v-main>
    <Appbar />
    <CustomSnackbar />
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script setup>
import Appbar from '@/components/Appbar.vue';
import CustomSnackbar from '@/components/menu/CustomSnackbar.vue';
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';

const appStore = useAppStore();
const router = useRouter();

// ensure auth'd if not redirect to login
onMounted(() => {
  if (appStore.isAuthExpired && router.currentRoute.value.path !== '/login') {
    router.replace('/login');
  }
});

// watch for auth expiration
watch([
  () => appStore.isAuthExpired,
  () => appStore.filterState, 
], async (newValue, oldValue) => {
  if (newValue && router.currentRoute.value.path !== '/login') {
    router.replace('/login');
  }
});
</script>
