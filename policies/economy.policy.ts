export const economyPolicy = {
  id: 'ECO-001',
  rule: 'Transactions must be transparent and non-negative',
  validate(ctx: any) {
    return typeof ctx.amount !== 'number' || ctx.amount >= 0
  }
}
