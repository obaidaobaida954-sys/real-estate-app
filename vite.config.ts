import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    figmaAssetResolver(),
    react(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || id.includes("/react/")) return "vendor_react";
          if (id.includes("@supabase")) return "vendor_supabase";
          if (id.includes("lucide-react")) return "vendor_icons";
          if (id.includes("motion") || id.includes("framer-motion")) return "vendor_motion";
          if (id.includes("sonner")) return "vendor_toast";
          if (id.includes("@radix-ui") || id.includes("cmdk")) return "vendor_radix";
          if (id.includes("recharts") || id.includes("react-dnd")) return "vendor_charts";
          return "vendor_misc";
        }
      }
    }
  }
})
