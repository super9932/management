import type { ComponentProps } from 'react';
import UnderwritingManualTable from './UnderwritingManualTable';
import { CONSUMER_PROTECTION_MANAGING_DEPT } from '../constant';

type Props = Omit<ComponentProps<typeof UnderwritingManualTable>, 'managingDept'>;

/** 소비자보호 문서 표 — 언더라이팅 문서 표와 컬럼이 같고 관리 부서 표기만 다르다 */
export default function ConsumerProtectionManualTable(props: Props) {
  return <UnderwritingManualTable {...props} managingDept={CONSUMER_PROTECTION_MANAGING_DEPT} />;
}
