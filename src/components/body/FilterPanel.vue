<template>
    <v-select
        :items="['All', 'Dogs', 'Cats']"
        label="Breed"
        color="primary"
        variant="solo"
        class="my-1 opacity-100"
        multiple
        />
        
    <v-select
        :items="['Puppy', 'Young', 'Adult', 'Senior']"
        label="Age"
        color="primary"
        variant="solo"
        class="my-1 opacity-100"
        multiple
        />
</template>



<script setup lang="ts">

</script>


<style scoped>

</style>