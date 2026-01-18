import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
    Image as ImageIcon,
    BookOpen,
    Briefcase,
    Heart,
    ArrowRight,
    Video,
    CheckCircle2,
    Code,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Features() {
    const features = [
        {
            title: "Tech Hub",
            description: "Programming assistance & technology insights powered by AI",
            icon: Code,
            url: "/tech-hub",
            color: "from-blue-500 to-cyan-500",
            items: ["Code Generation", "Tech Solutions", "Debugging Help"]
        },
        {
            title: "Personal",
            description: "Your AI companion for health & emotional support",
            icon: Heart,
            url: "/personal",
            color: "from-pink-500 to-rose-500",
            items: ["Health Advice", "Emotional Support", "Wellness Tips"]
        },
        {
            title: "Image AI",
            description: "Generate & analyze images with advanced AI technology",
            icon: ImageIcon,
            url: "/image",
            color: "from-purple-500 to-pink-500",
            items: ["Image Generation", "Image Analysis", "Visual AI"]
        },
        {
            title: "Education",
            description: "Academic support, science insights & translation services",
            icon: BookOpen,
            url: "/edu",
            color: "from-indigo-500 to-purple-500",
            items: ["Academia", "Science", "Translation"]
        },
        {
            title: "Professional",
            description: "Boost your business with AI-powered professional tools",
            icon: Briefcase,
            url: "/pro",
            color: "from-emerald-500 to-teal-500",
            items: ["Legal", "Marketing", "Finance", "SEO"]
        },
        {
            title: "Video AI",
            description: "Create and analyze videos with cutting-edge AI",
            icon: Video,
            url: "/video",
            color: "from-orange-500 to-red-500",
            items: ["Video Generation", "Video Analysis", "Content Creation"]
        },
    ];
    return (
        <section className="py-20 sm:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Everything You Need, <span className="text-primary">All in One Place</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our comprehensive suite of AI-powered tools designed to enhance your productivity and creativity
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            <CardHeader>
                                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4 w-fit`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                                <CardDescription className="text-base">{feature.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 mb-6">
                                    {feature.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-primary mr-2 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="outline" className="w-full group/btn" asChild>
                                    <Link href={feature.url}>
                                        Explore {feature.title}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
