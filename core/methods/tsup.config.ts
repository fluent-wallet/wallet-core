import { defineConfig } from 'tsup';


export default defineConfig({
  entry: ['src/index.ts', 'src/allMethods.ts'],
  splitting: false,
  treeshake: true,
  clean: true,
})

