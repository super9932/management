import DocumentDetailDialog from './DocumentDetailDialog';
import type { UnderwritingManualRow } from '../type';

interface Props {
  open: boolean;
  row: UnderwritingManualRow | null;
  onClose: () => void;
}

/** 언더라이팅 매뉴얼 상세 — 공용 상세 팝업(COM_공통정의_003) */
export default function UnderwritingManualDetailDialog({ open, row, onClose }: Props) {
  return (
    <DocumentDetailDialog
      open={open}
      title="언더라이팅 매뉴얼 상세"
      row={row}
      onClose={onClose}
    />
  );
}
