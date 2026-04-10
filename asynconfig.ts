import { defineConfig } from 'vite';

// @ts-ignore
export default defineConfig(async ({ command, mode }) => {
  // @ts-ignore
  const data = await asyncFunction()
  console.log(command, mode, data);
  return {
    // vite config
  }
})
