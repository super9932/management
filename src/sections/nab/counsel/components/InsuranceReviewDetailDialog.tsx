import DocumentDetailDialog from './DocumentDetailDialog';
import type { InsuranceReviewRow } from '../type';

interface Props {
  open: boolean;
  row: InsuranceReviewRow | null;
  onClose: () => void;
}

/** 보험심사 문서 상세 — 공용 상세 팝업(COM_공통정의_003) */
export default function InsuranceReviewDetailDialog({ open, row, onClose }: Props) {
  return (
    <DocumentDetailDialog
      open={open}
      title="보험심사 문서 상세"
      row={row}
      onClose={onClose}
    />
  );
}
