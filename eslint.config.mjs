import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      '*.config.mjs',
      '*.md',
      '*.mdx',
      '*.json',
      '*.yaml',
      '*.yml',
      '*.toml',
      '*.lockb',
      '*.lock',
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      // 기본 규칙
      'no-console': ['warn', { allow: ['error', 'log'] }],
      'no-unused-vars': 'warn',
      'prefer-const': 'off',
      'object-shorthand': ['error', 'always'],

      // typescript 규칙
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',

      // prettier 규칙
      'prettier/prettier': 'error',

      'react-hooks/exhaustive-deps': 'off',
    },
  },
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@next/next/recommended',
    'plugin:prettier/recommended',
  ),
];

export default eslintConfig;
