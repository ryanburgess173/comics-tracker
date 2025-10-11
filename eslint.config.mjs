// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import security from 'eslint-plugin-security';
import securityNode from 'eslint-plugin-security-node';

export default tseslint.config(
  // Base recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  security.configs.recommended,

  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.js',
      '**/*.d.ts',
      '!jest.config.js',
      'eslint.config.mjs',
      '**/.git/**',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/*.sqlite',
      '**/*.db',
    ],
  },

  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      'security-node': securityNode,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',

      // Security rules from eslint-plugin-security
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',

      // Security rules from eslint-plugin-security-node
      'security-node/detect-crlf': 'error',
      'security-node/detect-absence-of-name-option-in-exrpress-session':
        'error', // Note: typo in plugin name (exrpress)
      'security-node/detect-buffer-unsafe-allocation': 'error',
      'security-node/detect-insecure-randomness': 'error',
      'security-node/detect-runinthiscontext-method-in-nodes-vm': 'error',
      'security-node/detect-security-misconfiguration-cookie': 'warn', // Note: typo in plugin name (missconfiguration)
      'security-node/detect-unhandled-async-errors': 'error',
      'security-node/detect-unhandled-event-errors': 'error',
      'security-node/detect-child-process': 'warn',
      'security-node/detect-dangerous-redirects': 'error',
      'security-node/detect-eval-with-expr': 'error',
      'security-node/detect-improper-exception-handling': 'warn',
      'security-node/detect-non-literal-require-calls': 'warn',
      'security-node/detect-sql-injection': 'error',
      'security-node/detect-nosql-injection': 'error',
      'security-node/disable-ssl-across-node-server': 'error',
    },
  },

  // Prettier config (must be last to override other configs)
  prettier
);
