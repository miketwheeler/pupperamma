import { reactive } from 'vue';

export const snackbarState = reactive({
    visible: false,
    text: '',
    color: 'white',
});

// trigger fn
export const showSnackbar = (message: string, color: string) => {
    snackbarState.visible = true;
    snackbarState.text = message;
    snackbarState.color = color;
    
    // persist display for 3 secs
    setTimeout(() => {
        snackbarState.visible = false;
    }, 3000);
};