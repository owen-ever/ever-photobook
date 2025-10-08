# 프로덕션 스테이지
FROM node:21-alpine

WORKDIR /app

# 프로덕션 환경 설정
ENV NODE_ENV=production
ENV PORT=3000

# 필요한 파일만 복사
COPY ./package.json ./
COPY ./bun.lock ./
COPY ./next.config.ts ./
COPY ./public ./public
COPY ./.next ./.next

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행 (.next/standalone 위치의 server.js 실행)
CMD ["node", "server.js"]
