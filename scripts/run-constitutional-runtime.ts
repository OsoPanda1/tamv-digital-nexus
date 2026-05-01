import { runConstitutionalGuard } from '../src/lib/isabella/constitutionalGuard'
import { ConstitutionEngine } from '../src/lib/constitutionEngine'

async function main() {
  const engine = new ConstitutionEngine({
    mode: process.env.TAMV_CONSTITUTION_MODE || 'strict'
  })

  const result = await runConstitutionalGuard({
    engine,
    scope: 'full-system'
  })

  if (!result.valid) {
    console.error(JSON.stringify(result.violations, null, 2))
    process.exit(1)
  }

  console.log('✅ Constitutional Runtime OK')
}

main()
