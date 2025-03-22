import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store/store.js'
import { fetchBrands } from './redux/slices/scenariosSlice'
import App from './App.jsx'

store.dispatch(fetchBrands())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
