/** 現在時刻を取得 */
export const getCurrentTime = (): number => {
  return performance.now() ?? Date.now();
}