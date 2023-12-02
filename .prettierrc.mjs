/**
⁡⁣⁢⁣‍ * ​‌‍‌‍STEPS TO INSTALL THIS PRETIER CONFIG​
​ * Copy-paste this file into your project
 * install the tailwind plugin:
 *  npm i -D prettier prettier-plugin-tailwindcss
 * install the import-sort plugin:
 *  npm i -D @trivago/prettier-plugin-sort-imports
 * DONE!
 * 
 * Stuck?
 * import-sort docs: https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports
 * npm x tailwind articel: https://tailwindcss.com/blog/automatic-class-sorting-with-prettier
 * 
 * Changed the file contents but it won't adhere the new config?
 * Reload the window: CMD+SHIFT+P => then run "Reload Window"
 * 
 * Common prettier commands:
 * Format everything:
 * npx prettier . --write
 * Check if formatted:
 * npx prettier . --check
⁡ */

export default {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  pluginSearchDirs: false,

  importOrder: [
    "^next(.*)$",
    "^react(.*)$",
    "^@/utils/(.*)$",
    "^@/hooks/(.*)$",
    "^@/component(.*)$",
    "^@heroicons/(.*)$",
    "<THIRD_PARTY_MODULES>",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: false,
};