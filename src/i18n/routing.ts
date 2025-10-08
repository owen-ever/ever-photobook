import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 지원되는 언어를 입력하세요 !
  locales: ['ko', 'en'],

  // 기본 언어 설정 > [locale]/:path 이외에 설정된 라우팅은 무조건 기본적용
  // path > test의 경우 ko/en 모두 적용 가능
  // path > zxcv의 경우 무조건 defaultLocale 적용
  defaultLocale: 'ko',
});
