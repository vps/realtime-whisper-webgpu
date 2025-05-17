import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const js = require('@eslint/js');

export default [
  {
    ignores: ['dist', '**/*.jsx'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        navigator: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        self: 'readonly',
        performance: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly',
      },
    },
    rules: js.configs.recommended.rules,
  },
];
