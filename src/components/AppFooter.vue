<template>
    <v-footer height="40" app>
        <a v-for="item in items"
            :key="item.title"
            :href="item.href"
            :title="item.title"
            style="color: white;"
            class="d-inline-block mx-2 social-link"
            rel="noopener noreferrer"
            target="_blank"
            >
            <v-icon :icon="item.icon" size="24" />
        </a>
        <div class="text-caption text-disabled" style="position: absolute; right: 16px;">
            Michael Wheeler 2025
        </div>
    </v-footer>
</template>

<script setup lang="ts">
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
