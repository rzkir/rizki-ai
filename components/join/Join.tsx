
import Link from 'next/link';

import {
    ArrowRight,
    Rocket,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';

export default function Join() {
    return (
        <section className="py-20 sm:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                        <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
                            <Rocket className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Ready to Transform Your Workflow?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of users who are already leveraging AI to boost their productivity and creativity
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-base px-8 py-6 h-auto group" asChild>
                                <Link href="/tech-hub">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto" asChild>
                                <Link href="/login">
                                    Sign In Now
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
