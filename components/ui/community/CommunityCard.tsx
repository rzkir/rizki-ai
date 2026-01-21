"use client";

import { Quote } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Testimonial {
    id: number;
    text: string;
    name: string;
    title: string;
    avatar?: string;
    initials: string;
}

interface CommunityCardProps {
    testimonial: Testimonial;
}

export default function CommunityCard({ testimonial }: CommunityCardProps) {
    return (
        <Card className="h-full border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group p-0">
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="mb-2 sm:mb-3 md:mb-4">
                    <div className="inline-flex p-1 sm:p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary">
                        <Quote className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground mb-3 sm:mb-4 md:mb-5 lg:mb-6 grow leading-relaxed text-xs sm:text-sm md:text-base">
                    {testimonial.text}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 border-2 border-primary/20">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[10px] sm:text-xs md:text-sm">
                            {testimonial.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate text-xs sm:text-sm md:text-base">
                            {testimonial.name}
                        </p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">
                            {testimonial.title}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
