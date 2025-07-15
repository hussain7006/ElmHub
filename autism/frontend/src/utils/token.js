import useAuthStore from "../store/authStore";

export const getAccessToken = () => {
    const { token } = useAuthStore.getState();
    return token;
};

export const getTokenFromStore = () => {
    const { token } = useAuthStore.getState();
    return token;
};
