import create from 'zustand';

export const useAuthStore = create((set) => ({
    auth: {
        username: '',
        password: '', // Include password here if needed
        active: false
    },
    setUsername: (name) => set((state) => ({ auth: { ...state.auth, username: name } })),
    setPassword: (password) => set((state) => ({ auth: { ...state.auth, password } })) // Add this line
}));
