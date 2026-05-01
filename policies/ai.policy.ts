export const aiPolicy = {
  id: 'AI-001',
  rule: 'AI operations require auditable metadata',
  validate(ctx: any) {
    return !!ctx.auditTrail
  }
}
