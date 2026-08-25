import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import {
  Alert,
  Box,
  Typography,
  Card,
  Breadcrumbs,
  Button,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ServiceToggleRow from '../components/ServiceToggleRow';
import { DARK, DISABLED, PRIMARY_ORANGE, CARD_SHADOW } from '../../_lib/tokens';
import {
  SERVICE_TOGGLES,
  SERVICE_FEATURE_CODES,
  SERVICE_TOGGLE_LABEL,
  INITIAL_TOGGLE_STATE,
} from '../constant';
import {
  checkKillSwitches,
  getKillSwitchDetail,
  saveKillSwitch,
} from '../../../../api/nab/customer-touch';
import type { ApiResponse } from '../../../../api/nab/customer-touch';
import type { ServiceFeatureCode, ServiceToggleState } from '../type';

const QUERY_KEY = ['nab', 'customer-touch', 'service-killswitches'];

/** NAB 엔벨로프는 200으로도 error를 실어 보내므로 여기서 걸러낸다. */
const unwrap = <T,>(response: ApiResponse<T>, fallbackMessage: string): T | undefined => {
  if (response.error) throw new Error(response.error.message ?? fallbackMessage);
  return response.data;
};

/** 세 기능의 현재 on/off를 check API 한 번으로 조회한다. */
const fetchToggles = async (): Promise<ServiceToggleState> => {
  const response = await checkKillSwitches({ featureCodes: SERVICE_FEATURE_CODES });
  const enabled = unwrap(response, 'Kill-Switch 조회에 실패했습니다.')?.enabled ?? {};

  // true = 허용(ENABLED 또는 미등록), false = 차단(명시적 DISABLED)
  return SERVICE_FEATURE_CODES.reduce(
    (acc, code) => ({ ...acc, [code]: enabled[code] ?? true }),
    {} as ServiceToggleState,
  );
};

/**
 * 저장에 실을 featureName·description을 확보한다.
 *
 * save는 부분 수정이 아니라 전량 교체라, 두 값을 빼고 보내면 서버에 있던 설명이 null로 지워진다.
 * check 응답은 on/off 불리언뿐이라 여기서 변경된 기능만 detail로 원본을 읽어 그대로 되돌려 보낸다.
 * 미등록 기능이면(404) 화면 라벨로 새로 만든다.
 */
const fetchSaveMeta = async (code: ServiceFeatureCode) => {
  try {
    const response = await getKillSwitchDetail({ featureCode: code });
    const killSwitch = unwrap(response, '')?.killSwitch;

    if (killSwitch) {
      return {
        featureName: killSwitch.featureName ?? SERVICE_TOGGLE_LABEL[code],
        description: killSwitch.description ?? undefined,
      };
    }
  } catch {
    // 미등록 기능 — 아래 기본값으로 새로 등록한다
  }

  return { featureName: SERVICE_TOGGLE_LABEL[code], description: undefined };
};

function ServiceManagementViewInner() {
  const [toggles, setToggles] = useState<ServiceToggleState>(INITIAL_TOGGLE_STATE);
  const [savedMessage, setSavedMessage] = useState('');

  const { data: savedToggles, isError, error, refetch, isFetching } = useQuery(
    QUERY_KEY,
    fetchToggles,
  );

  // 조회된 현재 on/off 상태를 토글에 반영한다 (이후 조작은 로컬 상태로 관리).
  useEffect(() => {
    if (savedToggles) setToggles(savedToggles);
  }, [savedToggles]);

  const changedCodes = savedToggles
    ? SERVICE_FEATURE_CODES.filter((code) => toggles[code] !== savedToggles[code])
    : [];

  const {
    mutate: save,
    isLoading: isSaving,
    error: saveError,
    reset: resetSaveError,
  } = useMutation(
    /** save는 단건 저장이라 변경된 기능코드마다 순차로 호출한다. */
    async () => {
      for (const code of changedCodes) {
        // eslint-disable-next-line no-await-in-loop
        const { featureName, description } = await fetchSaveMeta(code);

        // eslint-disable-next-line no-await-in-loop
        const response = await saveKillSwitch({
          featureCode: code,
          featureName,
          state: toggles[code] ? 'ENABLED' : 'DISABLED',
          description,
        });

        unwrap(response, `${SERVICE_TOGGLE_LABEL[code]} 저장에 실패했습니다.`);
      }

      return changedCodes.length;
    },
    {
      onSuccess: (savedCount) => {
        setSavedMessage(`${savedCount}건의 서비스 설정을 저장했습니다.`);
        refetch();
      },
      // 일부만 저장된 채 실패했을 수 있으니 서버 상태를 다시 읽어 화면을 맞춘다.
      onError: () => {
        refetch();
      },
    },
  );

  const handleToggle = (key: ServiceFeatureCode, value: boolean) => {
    resetSaveError();
    setToggles((prev) => ({ ...prev, [key]: value }));
  };

  const isBusy = isFetching || isSaving;
  const errorMessage = isError
    ? ((error as Error)?.message ?? '서비스 상태를 불러오지 못했습니다.')
    : ((saveError as Error)?.message ?? '');

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>AI 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>고객 Plus AI 관리</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>서비스 관리</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          서비스 관리
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        {errorMessage && (
          <Alert
            severity="error"
            sx={{ borderRadius: 0 }}
            action={
              isError ? (
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  재시도
                </Button>
              ) : undefined
            }
          >
            {errorMessage}
          </Alert>
        )}

        {/* 스위치 목록 */}
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5, position: 'relative' }}>
          {isBusy && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.6)',
                zIndex: 1,
              }}
            >
              <CircularProgress size={24} sx={{ color: PRIMARY_ORANGE }} />
            </Box>
          )}

          {SERVICE_TOGGLES.map((item) => (
            <ServiceToggleRow
              key={item.key}
              label={item.label}
              helper={item.helper}
              checked={toggles[item.key]}
              disabled={isBusy || isError}
              onChange={(v) => handleToggle(item.key, v)}
            />
          ))}
        </Box>

        {/* 저장 버튼 — 변경된 항목이 있을 때만 활성화 */}
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            disabled={isBusy || isError || changedCodes.length === 0}
            onClick={() => save()}
            sx={{
              height: 48, px: 2, minWidth: 64, borderRadius: 2, bgcolor: PRIMARY_ORANGE, color: 'white',
              fontSize: 15, fontWeight: 400, boxShadow: 'none',
              '&:hover': { bgcolor: 'var(--nab-primary-hover)', boxShadow: 'none' },
            }}
          >
            {isSaving ? '저장 중…' : '저장'}
          </Button>
        </Box>
      </Card>

      <Snackbar
        open={savedMessage !== ''}
        autoHideDuration={3000}
        onClose={() => setSavedMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSavedMessage('')}>
          {savedMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function ServiceManagementView() {
  return (
    <NabThemeScope>
      <ServiceManagementViewInner />
    </NabThemeScope>
  );
}
