import fs from 'fs'
import path from 'path'

function scan(dir: string) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const full = path.join(dir, file)

    if (fs.statSync(full).isDirectory()) {
      scan(full)
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8')

      if (
        content.includes('wallet') &&
        !content.includes('constitutionalGuard')
      ) {
        console.error(`❌ Missing guard in ${full}`)
        process.exit(1)
      }
    }
  }
}

scan('./src')
console.log('✅ Guard usage OK')
