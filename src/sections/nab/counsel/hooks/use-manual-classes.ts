import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { getManualClsfList } from '../../../../api/nab/counsel-backoffice';
import type {
  AdminTypeCode,
  ManualClassCode,
  ManualClsfItem,
} from '../../../../api/nab/counsel-backoffice';
import { MANUAL_CLASS_BY_ADMIN_TYPE, MANUAL_CLASS_LABEL } from '../constant';

/**
 * 매뉴얼 분류 목록 (매뉴얼분류전체목록조회).
 *
 * 세 매뉴얼 화면이 같은 목록을 쓰고 관리주체(nabCuslAdmrTypeCode)로만 갈라진다.
 * 원장이 서버 enum 이라 세션 중에 바뀌지 않으므로 한 번만 받아 캐시를 공유한다.
 */

const QUERY_KEY = ['nab', 'counsel-backoffice', 'manual-clsf-list'] as const;

/** 전체 필터 옵션의 첫 항목 — 코드 없이 전건 조회를 뜻한다 */
export const ALL_CLASS_LABEL = '전체';

/**
 * 응답이 오기 전·실패했을 때 쓸 값.
 * 분류 셀렉트가 빈 채로 뜨면 조회·등록을 아예 못 하므로 하드코딩본으로 버틴다.
 */
const fallbackItems = (): ManualClsfItem[] =>
  (Object.keys(MANUAL_CLASS_BY_ADMIN_TYPE) as AdminTypeCode[]).flatMap((adminType) =>
    MANUAL_CLASS_BY_ADMIN_TYPE[adminType].map((code) => ({
      manlClsfCode: code,
      manlClsfNm: MANUAL_CLASS_LABEL[code],
      nabCuslAdmrTypeCode: adminType,
    })),
  );

export interface ManualClasses {
  /** 이 관리주체의 분류 코드 (서버 정의 순서). adminType 을 안 주면 전체 */
  codes: ManualClassCode[];
  /** 코드 → 표시명. 목록에 없는 코드는 원문 그대로 돌려준다 */
  label: (code: string) => string;
  /** 조회 필터 셀렉트 옵션 — '전체' + 표시명 */
  filterOptions: string[];
  /** 표시명 → 코드. '전체'(또는 모르는 값)면 undefined 라 요청에서 빠진다 */
  toCode: (label: string) => ManualClassCode | undefined;
  /** 아직 응답 전이면 true — 이때도 codes·label 은 하드코딩본으로 채워져 있다 */
  isLoading: boolean;
}

/** adminType 을 주면 그 화면의 분류만, 안 주면 전체를 돌려준다 */
export function useManualClasses(adminType?: AdminTypeCode): ManualClasses {
  const { data, isLoading } = useQuery(
    QUERY_KEY,
    async () => {
      const response = await getManualClsfList();

      if (response.error) {
        throw new Error(response.error.message ?? '분류 목록을 불러오지 못했습니다.');
      }

      return response.data?.manlClsfList ?? [];
    },
    {
      // 서버 enum 이라 갱신할 일이 없다 — 화면을 옮겨 다녀도 다시 받지 않는다
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: 1,
    },
  );

  return useMemo(() => {
    const items = data?.length ? data : fallbackItems();
    const scoped = adminType
      ? items.filter((item) => item.nabCuslAdmrTypeCode === adminType)
      : items;

    const labelByCode = new Map(items.map((item) => [item.manlClsfCode as string, item.manlClsfNm]));
    const codeByLabel = new Map(scoped.map((item) => [item.manlClsfNm, item.manlClsfCode]));

    return {
      codes: scoped.map((item) => item.manlClsfCode),
      label: (code: string) => labelByCode.get(code) ?? code,
      filterOptions: [ALL_CLASS_LABEL, ...scoped.map((item) => item.manlClsfNm)],
      toCode: (label: string) => codeByLabel.get(label),
      isLoading,
    };
  }, [data, adminType, isLoading]);
}
