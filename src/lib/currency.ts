/** Fixed euro conversion rate (Bulgaria joined the euro area on 1 January 2026). */
export const BGN_PER_EUR = 1.95583;

export const bgnToEur = (bgn: number): number => Math.round((bgn / BGN_PER_EUR) * 100) / 100;
