interface SidebarHeaderProps {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
}

interface SidebarProps {
    /** Header configuration */
    header: SidebarHeaderProps;
    /** Content to render inside the sidebar */
    children: React.ReactNode;
    /** Mobile sheet open state */
    open?: boolean;
    /** Callback when mobile sheet open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Additional className for the sidebar container */
    className?: string;
    /** Mobile trigger icon */
    mobileIcon?: LucideIcon;
    /** Badge count for mobile trigger */
    mobileBadge?: number;
}
