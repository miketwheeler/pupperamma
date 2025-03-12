<template>
    <v-footer height="40" app>
        <v-container fluid max-width="1400px" class="d-flex justify-space-between align-center py-0">
            <div class="d-flex ga-1">
                <a v-for="item in items"
                    :key="item.title"
                    :href="item.href"
                    :title="item.title"
                    class="d-inline-block mx-2 social-link"
                    rel="noopener noreferrer"
                    target="_blank"
                    >
                    <v-icon 
                        :color="theme.current.value.dark ? 'white' : 'black'" 
                        :icon="item.icon" 
                        size="24" 
                        />
                </a>
            </div>
            <div class="text-caption text-disabled">
                Michael Wheeler 2025
            </div>
        </v-container>
    </v-footer>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';

const theme = useTheme();


const items = [
    {
        title: "Mike's GitHub",
        icon: `mdi-github`,
        href: 'https://github.com/miketwheeler',
    },
    {
        title: "Mike's LinkedIn",
        icon: `mdi-linkedin`,
        href: 'https://www.linkedin.com/in/michaeltwheeler',
    },
]
</script>

<style scoped>
</style>
