import DocumentDetailDialog from './DocumentDetailDialog';
import type { ConsumerProtectionManualRow } from '../type';

interface Props {
  open: boolean;
  row: ConsumerProtectionManualRow | null;
  onClose: () => void;
}

/** 소비자보호 문서 상세 — 공용 상세 팝업(COM_공통정의_003) */
export default function ConsumerProtectionManualDetailDialog({ open, row, onClose }: Props) {
  return (
    <DocumentDetailDialog
      open={open}
      title="소비자보호 문서 상세"
      row={row}
      onClose={onClose}
    />
  );
}
