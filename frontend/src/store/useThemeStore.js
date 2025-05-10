// This is a function provided by Zustand. It's used to create a new global store.
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("Calligo-theme") || "autumn",
    setTheme: (theme) => {
        localStorage.setItem("Calligo-theme", theme); // It saves the theme to localStorage so that it persists across page reloads.
        set({ theme })
    },
}))

/*
Zustand is a general state management library for React.
create((set) => ({...})) -> This is how Zustand creates a store. The create function takes a callback with one argument: set. or Create a zustand store and here how it should be behave. When i want to update the state, I will use this set function.
set -> set is a function provided by Zustand. It is function you pass to "create". You use it to update the state of the store. Think of it like a useState, but globally available.
useThemeStore -> This is the name of the store. You can use this name to access the store in your components. It's a custom hook that you can use in your components to access and update the theme state.
theme -> a state value
setTheme -> an action to update that value. This is a function that you can call to update the theme state. It takes a theme argument and calls set({ theme }) to update the state.

By reloading the page, the theme will be reset to the default value. To persist the theme across page reloads, you can use localStorage or sessionStorage to save the theme value and retrieve it when the app loads. I am using zustand
*/