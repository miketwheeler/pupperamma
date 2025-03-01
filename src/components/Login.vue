<template>
    <v-container>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div class="text-h4 my-5"> Looks like you need to log in!</div>
            <v-card width="500">
                <v-card-title>
                    <div style="display: flex; justify-content: space-between;">
                        <div>Login</div>
                        <v-spacer />
                    </div>   
                </v-card-title>
                <v-card-text>
                    <v-form ref="formModel" lazy-validation v-model="valid" @submit.prevent="onSubmit">
                        <v-row>
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
                        Login
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { showSnackbar } from '@/services/snackbar';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';

const appState = useAppStore();
const router = useRouter();

const valid = ref(false);
const name = ref('');
const email = ref('');
const isLoading = ref(false);
const isAuthExpired = computed(() => appState !== null && appState.isAuthExpired)

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

    try {
        res = await appState.login(name.value, email.value);

        if(!res) throw new ErrorEvent('Login failed');

        router.replace("/");

        console.log("Login successful");

        message = 'Login successful!' + ` Welcome back, ${appState.session.user.name} 🤗`; 
        color = 'success';
    } catch (error: any) {
        message = 'Error logging in';
        color = 'error';
        console.error("Error during authentication:", error);
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

// Close the dialog
const closeDialog = () => {
    resetFormModel();
};
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>