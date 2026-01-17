export const LoadingDots = () => (
    <div className="flex gap-1.5 items-center py-2">
        {[0, 200, 400].map((delay) => (
            <span
                key={delay}
                className="w-2 h-2 rounded-full bg-foreground/60 opacity-40"
                style={{
                    animation: 'dotPulse 1.4s ease-in-out infinite',
                    animationDelay: `${delay}ms`
                }}
            />
        ))}
        <style jsx>{`
            @keyframes dotPulse {
                0%, 80%, 100% {
                    opacity: 0.4;
                    transform: scale(1);
                }
                40% {
                    opacity: 1;
                    transform: scale(1.2);
                }
            }
        `}</style>
    </div>
);
