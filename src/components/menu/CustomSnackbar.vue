<template>
    <v-snackbar v-model="snackbarState.visible" :color="snackbarState.color" timeout="3000">
        {{ snackbarState.text }}
    </v-snackbar>
</template>

<script>
import { snackbarState } from "@/services/snackbar";

export default {
    name: "CustomSnackbar",
    setup() {
        return {
            snackbarState,
        };
    },
};
</script>