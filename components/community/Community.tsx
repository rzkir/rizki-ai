"use client";

import { Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import CommunityCard, { type Testimonial } from '@/components/ui/community/CommunityCard';

import testimonialsData from '@/helper/dummy/data.json';

const testimonials: Testimonial[] = testimonialsData.testimonials;

export default function Community() {
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-10 relative overflow-hidden">
            <div className="relative z-10">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    {/* Rating Badge */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-foreground text-background border-0 shadow-lg">
                            <Star className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                            <span className="whitespace-nowrap">Rated 4/5 by over 1 Lakh users</span>
                        </Badge>
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
                        Words of praise from others about our presence
                    </h2>
                </div>

                {/* Marquee Rows */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Top Row - Scroll Left to Right */}
                    <div className="relative overflow-hidden">
                        {/* Left Overlay */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-24 lg:w-32 bg-linear-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
                        {/* Right Overlay */}
                        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-24 lg:w-32 bg-linear-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
                        <div className="flex animate-marquee-left">
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <div
                                    key={`top-${index}-${testimonial.id}`}
                                    className="shrink-0 w-[240px] sm:w-[320px] md:w-[380px] lg:w-[450px] mx-1.5 sm:mx-2 md:mx-3"
                                >
                                    <CommunityCard testimonial={testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Row - Scroll Right to Left */}
                    <div className="relative overflow-hidden">
                        {/* Left Overlay */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-24 lg:w-32 bg-linear-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
                        {/* Right Overlay */}
                        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-24 lg:w-32 bg-linear-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
                        <div className="flex animate-marquee-right">
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <div
                                    key={`bottom-${index}-${testimonial.id}`}
                                    className="shrink-0 w-[240px] sm:w-[320px] md:w-[380px] lg:w-[450px] mx-1.5 sm:mx-2 md:mx-3"
                                >
                                    <CommunityCard testimonial={testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
