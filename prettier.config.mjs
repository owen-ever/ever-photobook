// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  /**
   * @description 1줄의 최대 길이
   */
  printWidth: 120,
  /**
   * @description 여러 줄인 경우 후행 쉼표 사용 여부
   * es5: 제외
   * none: 없음
   * all: 포함
   */
  trailingComma: 'all',
  /**
   * @description 탭 너비 (공백 수)
   */
  tabWidth: 2,
  /**
   * @description 탭 대신 공백 사용
   * true: 탭
   * false: 공백
   */
  useTabs: false,
  /**
   * @description 세미콜론 사용 여부
   * true: 사용
   * false: 미사용
   */
  semi: true,
  /**
   * @description 따옴표 사용
   * true: 작은따옴표
   * false: 큰따옴표
   */
  singleQuote: true,
  /**
   * @description 객체나 배열의 괄호 사이에 공백 추가 여부
   * true: 추가
   * false: 미추가
   */
  bracketSpacing: true,
  /**
   * @description 여러 줄 요소의 닫는 괄호를 마지막 줄의 끝이 아닌 독립적인 줄에 위치시킬지 여부
   * true: 같은 줄
   * false: 다른 줄
   */
  bracketSameLine: true,
  /**
   * @description 파일 맨 위에 Prettier를 사용하여 포맷된 것임을 나타내는 특수 주석 삽입 여부
   */
  insertPragma: false,
  /**
   * @description markdown 텍스트 줄바꿈 처리 방식 지정
   * always: 지정된 printwidth(default 120자)를 초과하면 자동 줄바꿈
   * never: 모든 문장을 한 줄로 유지, 줄바꿈 없음
   * preserve: prettier가 줄바꿈을 제어하지 않음, 원래 작성 상태 유지
   */
  //
  proseWrap: 'preserve',
  /**
   * @description Vue 단일 파일 컴포넌트에서 <script>와 <style> 태그 내의 코드 들여쓰기 방식
   * as-needed: 필요한 경우에만 속성에 따옴표 사용
   * consistent: 1개라도 사용될 경우 모두 적용
   * preserve: 입력된 상태 유지
   */
  quoteProps: 'as-needed',
  /**
   * @description Vue 단일 파일 컴포넌트에서 <script>와 <style> 태그 내의 코드 들여쓰기 방식
   * true: 들여쓰기
   * false: 들여쓰기 안함
   */
  vueIndentScriptAndStyle: false,
  /**
   * @description 줄바꿈 처리 방식
   * lf: linux/macOS 스타일 (\n)
   * crlf: windows 스타일 (\r\n)
   * cr: 거의 사용되지 않음 (\r)
   * auto: 기존 파일 스타일 유지, 첫 번째 줄을 기준으로 통일
   */
  endOfLine: 'lf',
  /**
   * @description 포맷팅을 적용할 문자 위치
   * rangeStart: 시작 위치
   * rangeEnd: 끝 위치
   */
  rangeStart: 0,
  rangeEnd: Infinity,
  /**
   * @description 화살표 함수의 매개변수에 괄호 사용 여부
   * always: 항상 괄호 사용 -> (x) => x
   * avoid: 가능하면 괄호 생략 -> x => x
   */
  arrowParens: 'avoid',
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
