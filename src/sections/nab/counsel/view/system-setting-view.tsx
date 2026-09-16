import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import { CARD_SHADOW, DARK, DISABLED } from '../../_lib/tokens';
import SystemSettingToggleRow from '../components/SystemSettingToggleRow';
import DocumentAlertDialog from '../components/DocumentAlertDialog';
import DocumentToast from '../components/DocumentToast';
import type { DocumentToastSeverity } from '../components/DocumentToast';
import {
  COUNSEL_SERVICE_SWITCH_CODE,
  COUNSEL_SERVICE_SWITCH_NAME,
  MAINTENANCE_CONFIRM,
  SYSTEM_SETTING_TEXT,
  SYSTEM_SETTING_TOASTS,
} from '../constant';
import {
  getCounselKillSwitchDetail,
  saveCounselKillSwitch,
} from '../../../../api/nab/counsel-backoffice';
import { toApiErrorMessage } from '../../../../api/nab/_lib/error';
import { useAuthContext } from 'src/auth/hooks';

/**
 * 시스템 설정 (DAS_시스템설정_001).
 *
 * 상담AI 서비스 전체 점검 스위치 하나를 켜고 끈다.
 * 저장 값은 점검수행여부(ispcAcmpYn)라 화면 토글과 방향이 같다 — ON = 'Y'.
 */

/** 저장돼 있는 점검수행여부 → 화면 점검모드 토글 */
const toMaintenanceOn = (ispcAcmpYn: string): boolean => ispcAcmpYn === 'Y';

function SystemSettingViewInner() {
  /**
   * 화면 토글 = 서버에 저장된 값.
   * 저장 버튼이 따로 없고 토글 조작이 곧 저장이라(DAS_시스템설정_001 1-A),
   * 저장이 끝나기 전까지는 값을 바꾸지 않는다 — 취소하면 그대로 남아야 한다.
   */
  const [maintenanceOn, setMaintenanceOn] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; severity: DocumentToastSeverity }>({
    message: '',
    severity: 'success',
  });

  // 쓰기 API 는 작업자 사번을 요청 본문 emnb 필드로 받는다
  const { user } = useAuthContext();
  const effectiveUser = user;
  const emnb = effectiveUser?.emnb ?? '';

  const { data, isFetching, isError, error, refetch } = useQuery(
    ['nab', 'counsel-backoffice', 'killswitch-detail', COUNSEL_SERVICE_SWITCH_CODE],
    async () => {
      const response = await getCounselKillSwitchDetail({
        ftreIspcCode: COUNSEL_SERVICE_SWITCH_CODE,
      });

      if (response.error) {
        throw new Error(response.error.message ?? SYSTEM_SETTING_TOASTS.loadFail);
      }

      return response.data?.killSwitch ?? null;
    },
  );

  // 서버 값이 도착하면 화면과 기준값을 함께 맞춘다
  useEffect(() => {
    if (data) {
      setMaintenanceOn(toMaintenanceOn(data.ispcAcmpYn));
    }
  }, [data]);

  const saveMutation = useMutation(
    async (nextOn: boolean) => {
      const response = await saveCounselKillSwitch({
        ftreIspcCode: COUNSEL_SERVICE_SWITCH_CODE,
        // 코드명은 필수값이라 저장돼 있던 이름을 그대로 다시 보낸다
        ftreIspcCodeNm: data?.ftreIspcCodeNm ?? COUNSEL_SERVICE_SWITCH_NAME,
        ispcAcmpYn: nextOn ? 'Y' : 'N',
      }, emnb);

      if (response.error) {
        throw new Error(response.error.message ?? SYSTEM_SETTING_TOASTS.saveFail);
      }

      return nextOn;
    },
    {
      onSuccess: (nextOn) => {
        setMaintenanceOn(nextOn);
        setToast({
          message: nextOn
            ? SYSTEM_SETTING_TOASTS.maintenanceOn
            : SYSTEM_SETTING_TOASTS.maintenanceOff,
          severity: 'success',
        });
        refetch();
      },
      // 저장에 실패하면 서버 상태를 다시 읽어 화면을 되돌린다
      onError: (saveError) => {
        setToast({
          message: toApiErrorMessage(saveError, SYSTEM_SETTING_TOASTS.saveFail),
          severity: 'error',
        });
        refetch();
      },
    },
  );

  const isBusy = isFetching || saveMutation.isLoading;

  /**
   * 토글 조작 = 저장 (1-A).
   * ON 으로 바꿀 때만 확인 팝업을 띄우고, OFF 는 별도 얼럿 없이 바로 처리해 서비스가 정상 운영된다.
   * 화면 값은 저장이 성공해야 바뀐다 — 팝업에서 취소하면 ON 으로 넘어가지 않는다.
   */
  const handleToggle = (nextOn: boolean) => {
    if (nextOn) {
      setConfirmOpen(true);
      return;
    }

    saveMutation.mutate(false);
  };

  /** 적용 (2-A) — 팝업을 닫고 점검모드로 전환한다 */
  const handleConfirm = () => {
    setConfirmOpen(false);
    saveMutation.mutate(true);
  };

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>FP 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>상담 Plus AI</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>시스템 설정</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          시스템 설정
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        {isError && (
          <Alert
            severity="error"
            sx={{ borderRadius: 0 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                재시도
              </Button>
            }
          >
            {toApiErrorMessage(error, SYSTEM_SETTING_TOASTS.loadFail)}
          </Alert>
        )}

        <Box sx={{ p: 2.5, position: 'relative' }}>
          <SystemSettingToggleRow
            label={SYSTEM_SETTING_TEXT.toggleLabel}
            helper={SYSTEM_SETTING_TEXT.toggleHelper}
            checked={maintenanceOn}
            disabled={isBusy || isError}
            onChange={handleToggle}
          />
        </Box>
      </Card>

      {/* 점검모드 전환 확인 (2-A) */}
      <DocumentAlertDialog
        open={confirmOpen}
        title={MAINTENANCE_CONFIRM.title}
        message={MAINTENANCE_CONFIRM.message}
        confirmLabel={MAINTENANCE_CONFIRM.confirmLabel}
        cancelLabel={MAINTENANCE_CONFIRM.cancelLabel}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      />

      <DocumentToast
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, message: '' }))}
      />
    </>
  );
}

export default function SystemSettingView() {
  return (
    <NabThemeScope>
      <SystemSettingViewInner />
    </NabThemeScope>
  );
}
