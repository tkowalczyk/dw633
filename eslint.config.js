import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.wrangler/**', 'test-results/**'] },
  { ...js.configs.recommended, files: ['**/*.js'] },
  ...tseslint.configs.recommended,
)
