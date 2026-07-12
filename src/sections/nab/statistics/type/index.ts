export interface StatRow {
  date: string;
  /** STAT_GROUPS.length × metrics.length 길이의 셀 값 */
  cells: string[];
}
