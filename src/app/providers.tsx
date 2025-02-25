'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import QueryProvider from '@/providers/QueryProvider';

const theme = extendTheme({
  colors: {
    primary: {
      main: "#2D3250", // Deep navy blue
      light: "#424769", // Lighter navy
      dark: "#1B1F31", // Darker navy
    },
    secondary: {
      main: "#F6B17A", // Warm orange
      light: "#FFD9B7", // Light peach
    },
    success: {
      main: "#4E9F3D", // Forest green
      light: "#D7E6D5", // Light sage
    },
    warning: {
      main: "#FF7E67", // Coral
      light: "#FFB4A2", // Light coral
    },
    error: {
      main: "#E94560", // Ruby red
      light: "#FFD5DD", // Light pink
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ChakraProvider>
  )
}
