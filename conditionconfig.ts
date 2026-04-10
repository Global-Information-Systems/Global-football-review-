import { defineConfig } from 'vite';

// @ts-ignore
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  console.log(mode, isSsrBuild, isPreview);
  if (command === 'serve') {
    return {
      // dev specific config
    }
  } else {
    // command === 'build'
    return {
      // build specific config
    }
  }
})
