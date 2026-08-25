import DocumentDetailDialog from './DocumentDetailDialog';
import type { InsuranceCommonRow } from '../type';

interface Props {
  open: boolean;
  row: InsuranceCommonRow | null;
  onClose: () => void;
}

/** 보험공통 문서 상세 — 공용 상세 팝업(COM_공통정의_003) */
export default function InsuranceCommonDetailDialog({ open, row, onClose }: Props) {
  return (
    <DocumentDetailDialog
      open={open}
      title="보험공통 문서 상세"
      row={row}
      onClose={onClose}
    />
  );
}
