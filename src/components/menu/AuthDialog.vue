<template>
    <v-dialog 
        :model-value="props.visible"
        :id="props.dialogId"
        @update:model-value="updateDialogVisibility" 
        max-width="300"
        scrim="rgba(0, 0, 0, 1)"
        >
        <v-card>
            <v-card-title>
                <div style="display: flex; justify-content: space-between;">
                    <div v-if="!isLoggedIn">Login</div>
                    <v-spacer />
                    <v-btn icon @click="closeDialog" variant="text" size="sm">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>   
            </v-card-title>
            <v-card-text>
                <v-form ref="formModel" lazy-validation v-model="valid" @submit.prevent="onSubmit">
                    <v-row v-if="!isLoggedIn">
                        <v-col cols="12" gap="2">
                            <v-text-field
                                v-model="name"
                                :readonly="isLoading"
                                name="name"
                                label="Name"
                                :rules="nameRules"
                                outlined 
                                required
                                validate-on="blur"
                                />
                            <v-text-field
                                v-model="email"
                                :readonly="isLoading"
                                name="email"
                                label="Email"
                                type="email"
                                :rules="emailRules"
                                outlined 
                                required
                                validate-on="blur"
                                />
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col cols="12" gap="2" text-center justify-center>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center; text-align: center;">
                                <div class="text-h6 text-center">Are you sure you want to log out?</div>
                                <!-- <v-btn @click="handleLogout()" color="secondary">
                                    Log Out
                                </v-btn> -->
                            </div>
                        </v-col>
                    </v-row>                 
                </v-form>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    color="secondary" 
                    type="submit"
                    variant="flat"
                    @click="onSubmit"
                    >
                    {{ !isLoggedIn ? 'Login' : 'Logout' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { showSnackbar } from '@/services/snackbar';
import { useAppStore } from '@/stores/app';

const appState = useAppStore();
const props = defineProps({ visible: Boolean, dialogId: String });
const emit = defineEmits(['update:visible']);

const valid = ref(false);
const name = ref('');
const email = ref('');
const isLoading = ref(false);
const isLoggedIn = computed(() => appState !== null && appState.session.user && appState.session.loggedIn)

// validation rules
const nameRules = [
    (value: string) => !!value || 'Name is required',
    (value: string) => (value && value.length >= 3) || 'Name must be at least 3 characters',
];
const emailRules = [
    (value: string) => !!value || 'Email is required',
    (value: string) => (value && value.length >= 8) || 'Email must be at least 8 characters',
    (value: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value) || 'Invalid email format';
    }
];

// submitForm
const onSubmit = async () => {
    isLoading.value = true;
    let message, color, res;

    // early rtn if somehow invalid form
    if(!valid.value) {
        message = 'Please fill in all required fields';
        color = 'error';
        showSnackbar(message, color);
        return;
    }
    // Log out - if already logged-in
    if(isLoggedIn.value) {
        try {
            res = await appState.logout();

            if(!res) throw new ErrorEvent('Logout failed');

            console.log("Logout successful");

            message = "Sign off successful, 👋 later bro!";
            color = "secondary";
        } catch (error: any) {
            console.log("Logout unsuccessful", error);
            message = "There was an error logging you out, please try again!";
            color = "error";
        };
    }
    // Log In
    else {
        try {
            res = await appState.login(name.value, email.value);

            if(!res) throw new ErrorEvent('Login failed');

            console.log("Login successful");

            message = 'Login successful!' + ` Welcome back, ${appState.session.user.name} 🤗`; 
            color = 'success';
        } catch (error: any) {
            message = 'Error logging in';
            color = 'error';
            console.error("Error during authentication:", error);
        }
    }
    
    showSnackbar(message, color);
    resetFormModel();
    isLoading.value = false;
    closeDialog();
};

// Reset the working model
const resetFormModel = () => {
    name.value = '';
    email.value = '';
};

// Update dialog visibility
const updateDialogVisibility = (value: boolean) => {
    emit('update:visible', value);
};
// Close the dialog
const closeDialog = () => {
    resetFormModel();
    updateDialogVisibility(false);
};

onMounted(() => {
    if (isLoggedIn.value) {
        const user = appState.session.user;
        console.log("User from login dialog: ", user.name, user.email);
    }
});

// Watch for dialog visibility changes (on close in any way - scrim/bg click aways)
watch(() => props.visible, (newVal) => {
    if (!newVal) {
        resetFormModel();
    }
});
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>