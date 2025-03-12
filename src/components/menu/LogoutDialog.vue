<template>
    <v-dialog 
        :model-value="props.visible"
        :id="props.id"
        @update:model-value="updateDialogVisibility" 
        scrim="rgba(0, 0, 0, 0.9)"
        max-width="300"
        opacity="20"
        >
        <v-card>
            <v-card-title>
                <div style="display: flex; justify-content: space-between;">
                    <div>Log out</div>
                    <v-spacer />
                    <v-btn icon @click="closeDialog" variant="text" size="sm">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>   
            </v-card-title>
            <v-card-text>
                <v-form ref="formModel" lazy-validation v-model="valid" @submit.prevent="onSubmit">
                    <v-row>
                        <v-col cols="12" gap="2" text-center justify-center>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center; text-align: center;">
                                <div class="text-h6 text-center">Are you sure you want to log out?</div>
                            </div>
                        </v-col>
                    </v-row>                 
                </v-form>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    color="primary" 
                    type="submit"
                    variant="flat"
                    @click="onSubmit"
                    >
                    Logout
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { showSnackbar } from '@/services/snackbar';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';


const appState = useAppStore();
const router = useRouter();

const props = defineProps({ visible: Boolean, id: String });
const emit = defineEmits(['update:visible']);

const valid = ref(false);
const isLoading = ref(false);
const isAuthExpired = computed(() => appState !== null && appState.isAuthExpired)


// submitForm
const onSubmit = async () => {
    isLoading.value = true;
    let message, color, res;

    // Log out - if already logged-in
    if(!isAuthExpired.value) {
        try {
            res = await appState.logout();

            if(!res) throw new ErrorEvent('Logout failed');

            else {
                router.replace("/login");
                console.log("Logout successful");
    
                message = "Sign off successful, 👋 later bro!";
                color = "secondary";
            }
        } catch (error: any) {
            console.log("Logout unsuccessful", error);
            message = "There was an error logging you out, please try again!";
            color = "error";
        };

        showSnackbar(message, color);
    }
    
    isLoading.value = false;
    closeDialog();
};

// Update dialog visibility
const updateDialogVisibility = (value: boolean) => {
    emit('update:visible', value);
};
// Close the dialog
const closeDialog = () => {
    updateDialogVisibility(false);
};
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>