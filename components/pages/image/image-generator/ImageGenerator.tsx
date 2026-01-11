import { Sparkles } from 'lucide-react';

export default function ImageGenerator() {
    // Feature disabled - under development
    return (
        <div className="flex flex-col min-h-screen bg-background items-center justify-center p-8">
            <div className="max-w-md w-full text-center space-y-4">
                <Sparkles className="w-16 h-16 text-muted-foreground mx-auto opacity-50" strokeWidth={1.5} />
                <h1 className="text-2xl font-bold text-foreground">Fitur Sedang Dalam Pengembangan</h1>
                <p className="text-muted-foreground">
                    Image Generator sedang dalam tahap pengembangan dan akan segera hadir.
                </p>
            </div>
        </div>
    );
}
