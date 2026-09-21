import { useState } from 'react';
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
import { CARD_SHADOW, DARK, DISABLED, SECONDARY } from '../../_lib/tokens';
import DocumentFilter from '../components/DocumentFilter';
import UnderwritingManualTable from '../components/UnderwritingManualTable';
import UnderwritingManualDetailDialog from '../components/UnderwritingManualDetailDialog';
import DocumentRegisterDialog from '../components/DocumentRegisterDialog';
import DocumentPagination from '../components/DocumentPagination';
import {
  MANUAL_ADMIN_TYPE,
  MANUAL_OPERATION_FILTER_OPTIONS,
} from '../constant';
import { useManualDocuments } from '../hooks/use-manual-documents';
import { DOCUMENT_ALERTS, DOCUMENT_DETAIL_TOASTS } from '../constant';
import { isRestrictedWorkTime } from '../lib/document-attachment';
import DocumentAlertDialog from '../components/DocumentAlertDialog';
import DocumentToast from '../components/DocumentToast';
import type { DocumentToastSeverity } from '../components/DocumentToast';
import type { UnderwritingManualRow } from '../type';

function UnderwritingManualViewInner() {
  const {
    fromDate, setFromDate,
    toDate, setToDate,
    classFilter, setClassFilter, classFilterOptions,
    operationFilter, setOperationFilter,
    searchType, setSearchType,
    searchText, setSearchText,
    handleSearch,
    rows, total, totalPages,
    isError, error, refetch,
    page, setPage,
    pageSize, handlePageSizeChange,
    sort, handleSortChange,
    selectedIds, handleToggle, handleToggleAll, hasSelection,
    deleteSelected, isDeleting,
  } = useManualDocuments(MANUAL_ADMIN_TYPE.underwriting);
  const [detailRow, setDetailRow] = useState<UnderwritingManualRow | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<'delete' | 'restricted' | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: DocumentToastSeverity }>({
    message: '',
    severity: 'success',
  });

  /** 선택 삭제 — 작업 제한 시간을 먼저 확인하고 확인 모달을 띄운다 */
  const handleDeleteSelected = async () => {
    setDeleteAlert(null);

    try {
      await deleteSelected();
      setToast({ message: DOCUMENT_DETAIL_TOASTS.deleteSuccess, severity: 'success' });
    } catch (error) {
      setToast({
        message: (error as Error)?.message || DOCUMENT_DETAIL_TOASTS.deleteFail,
        severity: 'error',
      });
    }
  };

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>FP 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>상담 Plus AI</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>언더라이팅 문서</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          언더라이팅 문서
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        <DocumentFilter
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          operationFilter={operationFilter}
          onOperationFilterChange={setOperationFilter}
          searchType={searchType}
          onSearchTypeChange={setSearchType}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearch={handleSearch}
          operationFilterOptions={MANUAL_OPERATION_FILTER_OPTIONS}
          singleRow
          showClassFilter
          classFilterOptions={classFilterOptions}
          classFilter={classFilter}
          onClassFilterChange={setClassFilter}
          showSearchType={false}
        />
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
            {error?.message ?? '문서 목록을 불러오지 못했습니다.'}
          </Alert>
        )}

        <Box sx={{ position: 'relative' }}>
          <UnderwritingManualTable
            rows={rows}
            total={total}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            onDocumentClick={setDetailRow}
            sortBy={sort.sortBy}
            sortDir={sort.sortDir}
            onSortChange={handleSortChange}
          />
        </Box>

        {/* 페이지네이션(중앙) + 액션(우측) */}
        <Box sx={{ position: 'relative' }}>
          <DocumentPagination page={page} totalPages={totalPages} onChange={setPage} />
          <Box
            sx={{
              position: 'absolute', right: 20, top: 0, bottom: 0,
              display: 'flex', alignItems: 'center', gap: 1,
            }}
          >
            <Button
              variant="outlined"
              disabled={!hasSelection || isDeleting}
              onClick={() => setDeleteAlert(isRestrictedWorkTime() ? 'restricted' : 'delete')}
              sx={{
                height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 400,
                color: DARK, borderColor: 'var(--nab-border-strong)',
                '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
                '&.Mui-disabled': { color: DISABLED, borderColor: 'var(--nab-border)' },
              }}
            >
              {isDeleting ? '삭제 중…' : '선택 삭제'}
            </Button>
            <Button
              variant="contained"
              onClick={() => setRegisterOpen(true)}
              sx={{
                height: 40, px: 2, borderRadius: 2, fontSize: 15, fontWeight: 400,
                bgcolor: 'rgba(140,149,157,0.16)', color: DARK, boxShadow: 'none',
                '&:hover': { bgcolor: 'rgba(140,149,157,0.28)', boxShadow: 'none' },
              }}
            >
              문서 등록
            </Button>
          </Box>
        </Box>
      </Card>

      <UnderwritingManualDetailDialog
        open={detailRow !== null}
        row={detailRow}
        onClose={() => setDetailRow(null)}
      />

      <DocumentRegisterDialog
        open={registerOpen}
        adminType={MANUAL_ADMIN_TYPE.underwriting}
        title="언더라이팅 문서 등록"
        onClose={() => setRegisterOpen(false)}
      />

      {/* 선택 삭제 확인 / 작업 가능 시간 안내 */}
      <DocumentAlertDialog
        open={deleteAlert !== null}
        title={deleteAlert === 'delete' ? DOCUMENT_ALERTS.detailDeleteConfirm.title : DOCUMENT_ALERTS.restrictedTime.title}
        message={deleteAlert === 'delete' ? DOCUMENT_ALERTS.detailDeleteConfirm.message : DOCUMENT_ALERTS.restrictedTime.message}
        confirmLabel={deleteAlert === 'delete' ? DOCUMENT_ALERTS.detailDeleteConfirm.confirmLabel : DOCUMENT_ALERTS.restrictedTime.confirmLabel}
        cancelLabel={deleteAlert === 'delete' ? DOCUMENT_ALERTS.detailDeleteConfirm.cancelLabel : undefined}
        danger={deleteAlert === 'delete'}
        onConfirm={deleteAlert === 'delete' ? handleDeleteSelected : () => setDeleteAlert(null)}
        onClose={() => setDeleteAlert(null)}
      />

      <DocumentToast
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, message: '' }))}
      />
    </>
  );
}

export default function UnderwritingManualView() {
  return (
    <NabThemeScope>
      <UnderwritingManualViewInner />
    </NabThemeScope>
  );
}
