import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Box, Button, Dialog, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DARK, DISABLED, DIVIDER, FIELD_SX, POPUP_BG, SECONDARY } from '../../_lib/tokens';
import {
  deleteStipulation,
  getStipulationDetail,
} from '../../../../api/nab/counsel-backoffice';
import { DOCUMENT_ALERTS, DOCUMENT_DETAIL_TOASTS, TERMS_STATUS_LABEL } from '../constant';
import { isRestrictedWorkTime } from '../lib/document-attachment';
import DocumentAlertDialog from './DocumentAlertDialog';
import DocumentToast from './DocumentToast';
import type { DocumentToastSeverity } from './DocumentToast';
import type { DocumentRow } from '../type';
import { useAuthContext } from 'src/auth/hooks';

interface Props {
  open: boolean;
  row: DocumentRow | null;
  onClose: () => void;
}

/** 이 팝업이 띄우는 안내 모달 */
type AlertKey = 'delete' | 'restricted';

const ALERT_PRESET = {
  delete: DOCUMENT_ALERTS.detailDeleteConfirm,
  restricted: DOCUMENT_ALERTS.restrictedTime,
} as const;

/** API 일시(yyyy-MM-dd[ HH:mm:ss]) → 화면 표기(YYYY.MM.DD). 값이 없으면 '-' */
const toDisplayDate = (value: string | null | undefined): string =>
  value ? value.trim().split(' ')[0].replace(/-/g, '.') : '-';

/** 본문 카드 — 연회색 팝업 배경 위에 얹히는 흰 카드 */
const sectionSx = {
  bgcolor: 'var(--nab-surface)',
  borderRadius: 4,
  p: 2.5,
} as const;

/** 항목 라벨 — 카드 안 값 위에 붙는 회색 문구 */
const labelSx = { fontSize: 14, color: SECONDARY } as const;

/** 보종코드·문서명처럼 강조되는 값 */
const strongValueSx = { fontSize: 16, color: DARK } as const;

/** 등록 정보처럼 보조로 읽는 값 */
const valueSx = { fontSize: 14, color: DARK } as const;

/** 카드 안 열 — 마지막 열을 뺀 나머지 오른쪽에 점선 구분선을 둔다 */
const columnSx = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  borderRight: `1px dashed ${DIVIDER}`,
} as const;

const lastColumnSx = { ...columnSx, borderRight: 'none' } as const;

/** 약관 상세는 모든 입력칸이 읽기 전용이라 점선 테두리로 표시한다 */
const readOnlyFieldSx = {
  ...FIELD_SX,
  flex: 1,
  '& .MuiOutlinedInput-root': {
    ...FIELD_SX['& .MuiOutlinedInput-root'],
    '& fieldset': { borderStyle: 'dashed', borderColor: 'var(--nab-border)' },
    '&:hover fieldset': { borderStyle: 'dashed', borderColor: 'var(--nab-border)' },
  },
} as const;

/** 하단 액션 버튼 공통 — 높이 36 / radius 8 / 좌우 12 */
const actionButtonSx = {
  height: 36,
  minWidth: 64,
  px: 1.5,
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 400,
} as const;

/** 목록 API가 CSV 파일명을 내려주지 않던 시절의 폴백 — 확장자만 바꿔 쓴다 */
const toCsvName = (pdfName: string): string => pdfName.replace(/\.pdf$/i, '.csv');

/**
 * 판매기간을 '시작 ~ 종료' 한 줄로 합친다.
 * 목록 데이터는 시작일에 물결(2008.04.01~)이 붙어 오기도 해서 붙여 쓰면 물결이 두 번 나온다.
 */
const formatSalePeriod = (start: string, end: string): string =>
  `${start.replace(/~\s*$/, '').trim()} ~ ${end.replace(/^\s*~/, '').trim()}`;

export default function InsuranceTermsDetailDialog({ open, row, onClose }: Props) {
  const [alert, setAlert] = useState<AlertKey | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: DocumentToastSeverity }>({
    message: '',
    severity: 'success',
  });
  // 쓰기 API 는 작업자 사번을 요청 본문 emnb 필드로 받는다
  const { user } = useAuthContext();
  const effectiveUser = user;
  const emnb = effectiveUser?.emnb ?? '';

  const queryClient = useQueryClient();

  // 팝업이 열릴 때 상세를 조회한다. 목록에 없는 다운로드 URL·등록자 사번이 여기서 온다.
  const {
    data: detail,
  } = useQuery(
    ['nab', 'counsel-backoffice', 'stipulation-detail', row?.id],
    async () => {
      const response = await getStipulationDetail({ nabCuslIsrnStplDcmtId: row!.id });

      if (response.error) {
        throw new Error(response.error.message ?? '문서 상세 조회에 실패했습니다.');
      }

      return response.data ?? null;
    },
    { enabled: open && row !== null },
  );

  /** 문서 삭제 — 소프트삭제(다건 API를 1건으로 호출) */
  const deleteMutation = useMutation(
    async () => {
      if (!row) {
        throw new Error(DOCUMENT_DETAIL_TOASTS.deleteFail);
      }

      const response = await deleteStipulation({ nabCuslIsrnStplDcmtIdList: [row.id] }, emnb);

      if (response.error) {
        throw new Error(response.error.message ?? DOCUMENT_DETAIL_TOASTS.deleteFail);
      }

      // 색인 삭제에 실패한 문서는 failedList 로 돌아오고 목록에 그대로 남는다
      if (response.data?.failedList?.includes(row.id)) {
        throw new Error(DOCUMENT_DETAIL_TOASTS.deleteFail);
      }
    },
    {
      onSuccess: () => {
        setToast({ message: DOCUMENT_DETAIL_TOASTS.deleteSuccess, severity: 'success' });
        queryClient.invalidateQueries(['nab', 'counsel-backoffice', 'stipulation-list']);
        onClose();
      },
      onError: (error) => {
        setToast({
          message: (error as Error)?.message || DOCUMENT_DETAIL_TOASTS.deleteFail,
          severity: 'error',
        });
      },
    },
  );

  /** 다운로드 URL 은 조회 시점에 발급되는 만료형 주소라 저장하지 않는다 */
  const pdfUrl = detail?.pdfDcmtUrlPathNm ?? '';
  const csvUrl = detail?.csvDcmtUrlPathNm ?? '';
  const canDownload = pdfUrl !== '' || csvUrl !== '';

  /** 문서 다운로드 — 약관은 PDF·CSV 두 파일이라 둘 다 내려받는다 */
  const handleDownload = () => {
    if (!canDownload) {
      return;
    }

    onClose();
    [pdfUrl, csvUrl].filter(Boolean).forEach((url, index) => {
      // 연속 호출이 팝업 차단에 걸리지 않도록 두 번째는 살짝 늦춘다
      window.setTimeout(() => window.open(url, '_blank', 'noopener'), index * 300);
    });
  };

  const handleAlertConfirm = () => {
    if (alert === 'delete') {
      setAlert(null);
      deleteMutation.mutate();
      return;
    }
    setAlert(null);
  };

  if (!row) {
    return (
      <DocumentToast
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, message: '' }))}
      />
    );
  }

  // 상세가 오면 그 값을, 아직이면 목록 값을 보여준다
  const productCodes = detail ? detail.isrnKindCodeList.join(', ') : row.productCodes;
  const salePeriod = detail
    ? `${toDisplayDate(detail.saleStarDate)} ~ ${toDisplayDate(detail.saleEndDate)}`
    : formatSalePeriod(row.salePeriodStart, row.salePeriodEnd);
  const pdfName = detail?.pdfDcmtFileNm ?? row.documentName;
  const csvName = detail?.csvDcmtFileNm ?? row.csvDocumentName ?? toCsvName(row.documentName);
  const registrant = detail ? `${detail.rgsrNm}(${detail.rgsrEmnb})` : row.registrantName;
  const registrantDept = detail?.rgstOrgnNm ?? row.registrantDept;
  const registeredAt = detail ? toDisplayDate(detail.rgstDttm) : row.registeredAt;
  const operationStatus = detail ? TERMS_STATUS_LABEL[detail.status] : row.operationStatus;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: 720,
            maxWidth: 720,
            // 헤더·본문이 같은 연회색 위에 놓이고, 하단 액션만 흰색으로 떨어진다.
            bgcolor: POPUP_BG,
            boxShadow: '-40px 40px 80px -8px rgba(0,0,0,0.24)',
          },
        }}
      >
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 3, pr: 1.5, py: 3 }}>
          <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 700, color: DARK }}>보험약관 문서 상세</Typography>
          <IconButton size="small" onClick={onClose} sx={{ width: 28, height: 28 }}>
            <CloseIcon sx={{ fontSize: 18, color: SECONDARY }} />
          </IconButton>
        </Box>

        {/* 본문 — 화면이 낮을 때만 스크롤한다 */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            px: 3,
            pb: 3,
            maxHeight: 'min(640px, calc(100vh - 220px))',
            overflow: 'auto',
          }}
        >
          {/* 문서번호 / 운영상태 — 둘 다 조회 전용 */}
          <Box sx={{ ...sectionSx, display: 'flex', gap: 2 }}>
            <TextField
              label="문서번호"
              value={row.no.toLocaleString()}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={readOnlyFieldSx}
            />
            <TextField
              label="운영상태"
              value={operationStatus}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={readOnlyFieldSx}
            />
          </Box>

          {/* 보종코드 / 판매기간 */}
          <Box sx={sectionSx}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={columnSx}>
                <Typography sx={labelSx}>보종코드</Typography>
                <Typography sx={strongValueSx}>{productCodes}</Typography>
              </Box>
              <Box sx={lastColumnSx}>
                <Typography sx={labelSx}>판매기간</Typography>
                <Typography sx={strongValueSx}>{salePeriod}</Typography>
              </Box>
            </Box>
          </Box>

          {/* PDF / CSV 문서명 */}
          <Box sx={{ ...sectionSx, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={labelSx}>PDF 문서명</Typography>
              <Typography sx={strongValueSx}>{pdfName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={labelSx}>CSV 문서명</Typography>
              <Typography sx={strongValueSx}>{csvName}</Typography>
            </Box>
          </Box>

          {/* 등록 정보 */}
          <Box sx={sectionSx}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={columnSx}>
                <Typography sx={labelSx}>등록자</Typography>
                <Typography sx={valueSx}>{registrant}</Typography>
              </Box>
              <Box sx={columnSx}>
                <Typography sx={labelSx}>등록자 소속</Typography>
                <Typography sx={valueSx}>{registrantDept}</Typography>
              </Box>
              <Box sx={lastColumnSx}>
                <Typography sx={labelSx}>등록일자</Typography>
                <Typography sx={valueSx}>{registeredAt}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 하단 액션 — 약관 문서는 수정 없이 삭제·다운로드만 제공한다 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: 3,
            bgcolor: 'var(--nab-surface)',
            borderTop: `1px solid ${DIVIDER}`,
          }}
        >
          <Button
            variant="text"
            disabled={deleteMutation.isLoading}
            onClick={() => setAlert(isRestrictedWorkTime() ? 'restricted' : 'delete')}
            sx={{
              ...actionButtonSx,
              color: 'var(--nab-label-red-fg)',
              bgcolor: 'var(--nab-label-red-bg)',
              '&:hover': { bgcolor: 'var(--nab-label-red-bg)' },
            }}
          >
            {deleteMutation.isLoading ? '삭제 중…' : '문서 삭제'}
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            disabled={!canDownload || deleteMutation.isLoading}
            onClick={handleDownload}
            sx={{
              ...actionButtonSx,
              color: DARK,
              '&.Mui-disabled': { color: DISABLED, borderColor: 'var(--nab-border)' },
              borderColor: 'var(--nab-border-strong)',
              '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
            }}
          >
            문서 다운로드
          </Button>
        </Box>
      </Dialog>

      {/* 문서삭제 확인 / 작업 가능 시간 안내 */}
      <DocumentAlertDialog
        open={alert !== null}
        title={alert ? ALERT_PRESET[alert].title : ''}
        message={alert ? ALERT_PRESET[alert].message : ''}
        confirmLabel={alert ? ALERT_PRESET[alert].confirmLabel : ''}
        cancelLabel={alert === 'delete' ? ALERT_PRESET.delete.cancelLabel : undefined}
        danger={alert === 'delete'}
        onConfirm={handleAlertConfirm}
        onClose={() => setAlert(null)}
      />

      <DocumentToast
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, message: '' }))}
      />
    </>
  );
}
