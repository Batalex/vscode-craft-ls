import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended.map((c) => ({
        ...c,
        files: ['src/**/*.ts'],
    })),
    {
        ignores: ['dist/**', 'node_modules/**', '**/*.d.ts'],
    },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
);
