import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // output: 'standalone',
  serverExternalPackages: ['gray-matter'], // 서버 전용으로만 쓰는 패키지 명시 (안전)
  eslint: {
    ignoreDuringBuilds: true, // CI/CD 환경에서 ESLint 검사 무시
  },
  // 외부 스크립트 허용 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://*.cloudflare.com;",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
