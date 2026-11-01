import Hero from '@/components/home/Hero';
import ToolGrid from '@/components/home/ToolGrid';
import PrivacySection from '@/components/home/PrivacySection';
import FeatureHighlights from '@/components/home/FeatureHighlights';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ToolGrid />
      <PrivacySection />
      <FeatureHighlights />
    </>
  );
}
