import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
import ViteInspector from 'vite-plugin-inspect';
import { presetUno, transformerCompileClass } from 'unocss';
import UnoCSS from 'unocss/vite';
import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
import presetTypography from '@unocss/preset-typography';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CommonWeb',
      formats: ['es'],
      fileName: 'index',
    },
  },
  plugins: [
    dts(),
    UnoCSS({
      mode: 'shadow-dom',
      transformers: [
        transformerCompileClass(),
      ],
      presets: [
        presetAttributify(),
        presetUno(),
        presetIcons({
          extraProperties: {
            'display': 'inline-block',
            'vertical-align': 'middle',
          },
        }),
        presetTypography(),
      ],
      inspector: false,
    }),
    ViteInspector(),
  ]
})