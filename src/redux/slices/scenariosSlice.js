import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    scenarios: [],
    brands: [],
    loading: false,
    error: null,
    selectedScenario: null,
};

export const fetchScenarios = createAsyncThunk(
    'scenarios/fetchScenarios',
    async () => {
        const response = await axios.get('http://localhost:3001/scenarios');
        return response.data;
    }
);

export const fetchBrands = createAsyncThunk(
    'scenarios/fetchBrands',
    async () => {
        const response = await axios.get('http://localhost:3001/brands');
        return response.data;
    }
);

export const addScenario = createAsyncThunk(
    'scenarios/addScenario',
    async (scenario) => {
        const response = await axios.post('http://localhost:3001/scenarios', scenario);
        return response.data;
    }
);

export const updateScenario = createAsyncThunk(
    'scenarios/updateScenario',
    async (scenario, { rejectWithValue }) => {
        try {
            //console.log("Updating scenario with ID:", scenario.id);
            //console.log("Update payload:", scenario);
            const response = await axios.put(`http://localhost:3001/scenarios/${scenario.id}`, scenario);
            //console.log("Update response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating scenario:", error);
            return rejectWithValue(error.message);
        }
    }
);

const scenariosSlice = createSlice({
    name: 'scenarios',
    initialState,
    reducers: {
        setSelectedScenario: (state, action) => {
            //console.log("Setting selected scenario:", action.payload);
            state.selectedScenario = action.payload;
        },
        clearSelectedScenario: (state) => {
            //console.log("Clearing selected scenario");
            state.selectedScenario = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchScenarios.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchScenarios.fulfilled, (state, action) => {
                state.loading = false;
                state.scenarios = action.payload;
            })
            .addCase(fetchScenarios.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addScenario.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addScenario.fulfilled, (state, action) => {
                state.loading = false;
                state.scenarios.push(action.payload);
            })
            .addCase(addScenario.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateScenario.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateScenario.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.scenarios.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.scenarios[index] = action.payload;
                }
                state.selectedScenario = null;
            })
            .addCase(updateScenario.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload;
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setSelectedScenario, clearSelectedScenario } = scenariosSlice.actions;
export default scenariosSlice.reducer;