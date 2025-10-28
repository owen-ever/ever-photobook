import fs from 'fs';
import path from 'path';

/**
 * 지원되는 이미지 파일 확장자 목록
 */
const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp', '.gif'];

/**
 * 파일이 이미지 파일인지 확인합니다.
 * @param filename - 파일명
 * @returns boolean
 */
function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
}

/**
 * 파일명을 날짜순으로 정렬합니다.
 * @param filenames - 파일명 배열
 * @returns 정렬된 파일명 배열
 */
function sortByDate(filenames: string[]): string[] {
  return filenames.sort((a, b) => {
    // 날짜 형식 추출 (YYYY-MM-DD-XXX 형식)
    const dateA = a.match(/^(\d{4}-\d{2}-\d{2})/);
    const dateB = b.match(/^(\d{4}-\d{2}-\d{2})/);

    if (dateA && dateB) {
      return dateA[1].localeCompare(dateB[1]);
    }

    // 날짜 형식이 없으면 파일명으로 정렬
    return a.localeCompare(b);
  });
}

/**
 * /public/images 폴더의 모든 이미지 파일을 읽어옵니다.
 * @returns 이미지 파일 경로 배열
 */
export function getAllImageFiles(): string[] {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');

    // 디렉토리가 존재하는지 확인
    if (!fs.existsSync(imagesDir)) {
      console.warn('Images directory not found:', imagesDir);
      return [];
    }

    // 디렉토리의 모든 파일 읽기
    const files = fs.readdirSync(imagesDir);

    // 이미지 파일만 필터링
    const imageFiles = files.filter(isImageFile);

    // 날짜순으로 정렬
    const sortedFiles = sortByDate(imageFiles);

    // /images/ 경로로 변환
    const imagePaths = sortedFiles.map(file => `/images/${file}`);

    console.log(`Found ${imagePaths.length} image files:`, imagePaths.slice(0, 5), '...');

    return imagePaths;
  } catch (error) {
    console.error('Error reading image files:', error);
    return [];
  }
}

/**
 * 특정 날짜 범위의 이미지 파일을 가져옵니다.
 * @param startDate - 시작 날짜 (YYYY-MM-DD)
 * @param endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns 필터링된 이미지 파일 경로 배열
 */
export function getImageFilesByDateRange(startDate: string, endDate: string): string[] {
  const allImages = getAllImageFiles();

  return allImages.filter(imagePath => {
    const filename = path.basename(imagePath);
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);

    if (!dateMatch) return false;

    const fileDate = dateMatch[1];
    return fileDate >= startDate && fileDate <= endDate;
  });
}

/**
 * 최근 N개의 이미지 파일을 가져옵니다.
 * @param count - 가져올 이미지 개수
 * @returns 최근 이미지 파일 경로 배열
 */
export function getRecentImageFiles(count: number = 10): string[] {
  const allImages = getAllImageFiles();
  return allImages.slice(-count);
}
