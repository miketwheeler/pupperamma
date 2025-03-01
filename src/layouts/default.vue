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

onMounted(() => {
  if (appStore.isAuthExpired && router.currentRoute.value.path !== '/login') {
    router.replace('/login');
  }
});

</script>
