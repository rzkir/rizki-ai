import * as React from "react"
import { cn } from "@/lib/utils"

const TypographyH1 = React.forwardRef<
    HTMLHeadingElement,
    React.ComponentProps<"h1">
>(({ className, ...props }, ref) => (
    <h1
        ref={ref}
        className={cn(
            "scroll-m-20 text-3xl font-bold tracking-tight leading-tight lg:text-4xl mb-4",
            className
        )}
        {...props}
    />
))
TypographyH1.displayName = "TypographyH1"

const TypographyH2 = React.forwardRef<
    HTMLHeadingElement,
    React.ComponentProps<"h2">
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn(
            "scroll-m-20 text-2xl font-semibold tracking-tight leading-tight mt-6 mb-3 first:mt-0",
            className
        )}
        {...props}
    />
))
TypographyH2.displayName = "TypographyH2"

const TypographyH3 = React.forwardRef<
    HTMLHeadingElement,
    React.ComponentProps<"h3">
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "scroll-m-20 text-xl font-semibold tracking-tight leading-snug mt-5 mb-2",
            className
        )}
        {...props}
    />
))
TypographyH3.displayName = "TypographyH3"

const TypographyH4 = React.forwardRef<
    HTMLHeadingElement,
    React.ComponentProps<"h4">
>(({ className, ...props }, ref) => (
    <h4
        ref={ref}
        className={cn(
            "scroll-m-20 text-lg font-semibold tracking-tight leading-snug mt-4 mb-2",
            className
        )}
        {...props}
    />
))
TypographyH4.displayName = "TypographyH4"

const TypographyP = React.forwardRef<
    HTMLParagraphElement,
    React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-base leading-relaxed not-first:mt-4 text-foreground/90", className)}
        {...props}
    />
))
TypographyP.displayName = "TypographyP"

const TypographyBlockquote = React.forwardRef<
    HTMLQuoteElement,
    React.ComponentProps<"blockquote">
>(({ className, ...props }, ref) => (
    <blockquote
        ref={ref}
        className={cn(
            "mt-4 mb-4 pl-4 italic text-foreground/80 leading-relaxed bg-muted/30 rounded-r-md py-2",
            className
        )}
        {...props}
    />
))
TypographyBlockquote.displayName = "TypographyBlockquote"

const TypographyList = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("my-3 ml-5 list-disc space-y-2 text-base leading-relaxed text-foreground/90", className)}
        {...props}
    />
))
TypographyList.displayName = "TypographyList"

const TypographyOrderedList = React.forwardRef<
    HTMLOListElement,
    React.ComponentProps<"ol">
>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn("my-3 ml-5 list-decimal space-y-2 text-base leading-relaxed text-foreground/90", className)}
        {...props}
    />
))
TypographyOrderedList.displayName = "TypographyOrderedList"

const TypographyListItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("leading-relaxed", className)} {...props} />
))
TypographyListItem.displayName = "TypographyListItem"

const TypographyCode = React.forwardRef<
    HTMLElement,
    React.ComponentProps<"code">
>(({ className, ...props }, ref) => (
    <code
        ref={ref}
        className={cn(
            "relative rounded-md bg-muted/80 px-1.5 py-0.5 font-mono text-sm font-medium text-foreground",
            className
        )}
        {...props}
    />
))
TypographyCode.displayName = "TypographyCode"

const TypographyLead = React.forwardRef<
    HTMLParagraphElement,
    React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-xl text-muted-foreground", className)}
        {...props}
    />
))
TypographyLead.displayName = "TypographyLead"

const TypographyLarge = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
    />
))
TypographyLarge.displayName = "TypographyLarge"

const TypographySmall = React.forwardRef<
    HTMLElement,
    React.ComponentProps<"small">
>(({ className, ...props }, ref) => (
    <small
        ref={ref}
        className={cn("text-sm font-medium leading-none", className)}
        {...props}
    />
))
TypographySmall.displayName = "TypographySmall"

const TypographyMuted = React.forwardRef<
    HTMLParagraphElement,
    React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
TypographyMuted.displayName = "TypographyMuted"

export {
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyP,
    TypographyBlockquote,
    TypographyList,
    TypographyOrderedList,
    TypographyListItem,
    TypographyCode,
    TypographyLead,
    TypographyLarge,
    TypographySmall,
    TypographyMuted,
}

