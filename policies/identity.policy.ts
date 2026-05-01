export const identityPolicy = {
  id: 'ID-001',
  rule: 'User must have identity + wallet',
  validate(ctx: any) {
    return ctx.user && ctx.wallet
  }
}
