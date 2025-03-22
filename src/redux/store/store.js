// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import scenariosReducer from '../slices/scenariosSlice';

const store = configureStore({
    reducer: {
        scenarios: scenariosReducer,
    },
});

export default store;