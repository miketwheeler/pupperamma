<template>
  <v-main>
    <Appbar />
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script lang="ts" setup>
  import Appbar from '@/components/Appbar.vue';


</script>
