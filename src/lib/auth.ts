import cookie from 'react-cookies';

export async function getUserRole() {
  if (typeof window !== 'undefined') {
    // console.log('클라이언트 사이드');
    const token = cookie.load('token');

    return token?.role || [];
  } else {
    // console.log('서버 사이드');
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get('token')?.value;

      if (!tokenCookie) {
        // 서버 사이드에서 토큰이 없으면 클라이언트 토큰 사용
        if (typeof document !== 'undefined') {
          const clientToken = cookie.load('token');
          return clientToken?.role || [];
        }
        return [];
      }

      const token = JSON.parse(tokenCookie || '{}');

      return token?.role || [];
    } catch (error) {
      console.error('서버 사이드 토큰 처리 오류:', error);
      return [];
    }
  }
}
