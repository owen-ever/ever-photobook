// 타입 정의를 위해 import 타입만 가져옵니다
import type { Message } from 'react-intl';

declare global {
  interface IntlMessages extends Message {
    [key: string]: string | Record<string, unknown>;
  }
}
