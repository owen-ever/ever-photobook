import AnniversaryGallery from '@/components/AnniversaryGallery';

const TestPage = () => {
  const demoImages = ['/images/01.png', '/images/02.png', '/images/03.png', '/images/04.jpg'];
  return (
    <AnniversaryGallery
      anniversaryDate="2024-10-28"
      images={demoImages}
      autoScrollIntervalMs={1500}
      doubleSpeedFactor={0.5}
    />
  );
};

export default TestPage;
