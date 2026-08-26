import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Tooltip } from '@mui/material';

/**
 * 컬럼 폭을 넘는 값을 '...' 으로 줄이고, 마우스를 올리면 전체 내용을 보여준다.
 *
 * 테이블은 table-layout:auto 라 셀 내용이 길면 컬럼이 늘어난다.
 * 안쪽 박스에 px 단위 maxWidth 를 걸어야 컬럼 폭이 고정되고 말줄임이 걸린다.
 */

interface Props {
  /** 표시할 값 */
  text: string;
  /** 내용 영역 최대 폭(px) — 컬럼 폭에서 셀 좌우 여백을 뺀 값 */
  maxWidth: number;
  align?: 'left' | 'center';
}

export default function EllipsisText({ text, maxWidth, align = 'left' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [truncated, setTruncated] = useState(false);

  // 실제로 잘린 칸에만 툴팁을 붙인다 — 다 보이는 값까지 툴팁이 뜨면 방해가 된다
  useLayoutEffect(() => {
    const el = ref.current;

    setTruncated(el ? el.scrollWidth > el.clientWidth : false);
  }, [text, maxWidth]);

  return (
    <Tooltip
      title={text}
      placement="top"
      enterDelay={300}
      disableHoverListener={!truncated}
      disableFocusListener={!truncated}
      disableTouchListener={!truncated}
      componentsProps={{
        tooltip: {
          sx: {
            maxWidth: 480,
            fontSize: 13,
            lineHeight: '20px',
            // 원문 줄바꿈을 살려서 보여준다
            whiteSpace: 'pre-wrap',
          },
        },
      }}
    >
      <Box
        ref={ref}
        sx={{
          maxWidth,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          // 셀보다 좁아졌을 때도 가운데 정렬을 유지한다
          mx: align === 'center' ? 'auto' : 0,
        }}
      >
        {text}
      </Box>
    </Tooltip>
  );
}
