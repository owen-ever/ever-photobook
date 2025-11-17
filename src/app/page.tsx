import AnniversaryGallery from '@/components/AnniversaryGallery/index';
import { getAllImageFiles } from '@/lib/images';

const TestPage = () => {
  // 최근 20개 이미지만 사용 (너무 많으면 성능 이슈가 있을 수 있음)
  const demoImages = getAllImageFiles();

  // 이미지가 없으면 기본 메시지 표시
  if (demoImages.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">이미지를 찾을 수 없습니다</h1>
          <p className="text-gray-600">/public/images 폴더에 이미지 파일을 추가해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <AnniversaryGallery
      anniversaryDate="2023-10-28"
      images={demoImages}
      autoScrollIntervalMs={1500}
      doubleSpeedFactor={0.5}
    />
  );
};

export default TestPage;
