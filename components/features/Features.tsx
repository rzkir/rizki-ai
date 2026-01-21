import featuresData from '@/helper/dummy/data.json';

import FeaturesCard, { type Feature } from '@/components/ui/features/FeaturesCard';

export default function Features() {
    const features: Feature[] = featuresData.features;

    return (
        <section className="py-6">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Everything You Need, <span className="text-primary">All in One Place</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our comprehensive suite of AI-powered tools designed to enhance your productivity and creativity
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <FeaturesCard key={index} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    )
}
