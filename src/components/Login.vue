<template>
    <v-container>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div class="text-h4 my-5"> Looks like you need to log in!</div>
            <v-card width="400">

                <v-card-title>
                    <div style="display: flex; justify-content: space-between;">
                        <div>Login</div>
                        <v-spacer />
                    </div>   
                </v-card-title>

                <!-- login form -->
                <v-card-text>
                    <v-form ref="formModel" v-model="valid" lazy-validation @submit.prevent="onSubmit">
                        <v-row>
                            <v-col cols="12" gap="2">
                                <v-text-field
                                    v-model="name"
                                    :readonly="isLoading"
                                    :rules="nameRules"
                                    validate-on="blur"
                                    name="name"
                                    label="Name"
                                    outlined 
                                    required
                                    @keyup.enter="validateFormThenSubmit"
                                    />
                                <v-text-field
                                    v-model="email"
                                    :readonly="isLoading"
                                    :rules="emailRules"
                                    validate-on="input lazy"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    outlined 
                                    required
                                    @keyup.enter="validateFormThenSubmit"
                                    />
                            </v-col>
                        </v-row>              
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn 
                        color="primary" 
                        :loading="isLoading"
                        :disabled="isLoading || !valid"
                        :variant="(isLoading || !valid) ? 'tonal' : 'flat'"
                        type="submit"
                        @click="validateFormThenSubmit"
                        >
                        Login
                    </v-btn>
                </v-card-actions>

            </v-card>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showSnackbar } from '@/services/snackbar';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';
import { type VForm } from 'vuetify/components'


const appState = useAppStore();
const router = useRouter();

const formModel = ref<VForm | null>(null);
const valid = ref(false);
const name = ref('');
const email = ref('');
const isLoading = ref(false);


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

const validateFormThenSubmit = async () => {
    if (!formModel.value) return;
    const { valid } = await formModel.value.validate();
    if (valid) onSubmit();
}

// submitForm
const onSubmit = async () => {
    // check the form model actually has values
    if(!formModel.value) return;

    isLoading.value = true;
    let message, color, res;

    try {
        res = await appState.login(name.value, email.value);

        if(!res) throw new ErrorEvent('Login failed');

        router.replace("/");

        message = 'Login successful!' + ` Welcome back, ${appState.session.user.name} 🤗`; 
        color = 'success';
    } catch (error: any) {
        message = error.message || 'Error logging in';
        color = 'error';
    }
    
    showSnackbar(message, color);
    resetFormModel();
    isLoading.value = false;
};

// Reset the working model
const resetFormModel = () => {
    name.value = '';
    email.value = '';
};
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>