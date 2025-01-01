import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import App from './App'
import './index.css'

// Define the theme configuration
const theme = extendTheme({
    styles: {
        global: {
            'html, body': {
                minHeight: '100vh',
                margin: 0,
                padding: 0,
                bg: 'gray.50',
                color: 'gray.800',
            }
        }
    },
    colors: {
        brand: {
            50: '#e6f5ff',
            100: '#b3e0ff',
            200: '#80ccff',
            300: '#4db8ff',
            400: '#1aa3ff',
            500: '#0088e6',
            600: '#006bb3',
            700: '#004d80',
            800: '#00304d',
            900: '#00121a',
        },
    },
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'medium',
            },
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: 'lg',
                    overflow: 'hidden',
                }
            }
        }
    }
})

// Create root element
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

// Create root and render app
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme} resetCSS>
            <App />
        </ChakraProvider>
    </React.StrictMode>
) 