import { Trophy, HeartHandshake, Crown, ArrowUpRight } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { cn } from '@/lib/utils'

import leaderboardData from '@/helper/dummy/data.json'

const donations = leaderboardData.leaderboard.donations

const prizePool = leaderboardData.leaderboard.prizePool

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
})

const rankStyles: Record<number, string> = {
    1: 'from-amber-400/90 via-yellow-300/80 to-amber-500/90 ring-amber-400/40',
    2: 'from-slate-300/80 via-slate-200/70 to-slate-400/80 ring-slate-300/30',
    3: 'from-amber-600/90 via-amber-700/80 to-amber-800/90 ring-amber-600/40',
}

export default function Leaderboard() {
    const sorted = [...donations].sort((a, b) => b.amount - a.amount)
    const [first, second, third] = sorted
    const rest = sorted.slice(3) // Peringkat 4 ke bawah (top 3 hanya di podium)

    return (
        <section className="py-10 relative overflow-hidden">
            <div className="container mx-auto px-4 relative space-y-10">
                {/* Header */}
                <div className="text-center space-y-3">
                    <Badge className="bg-primary/10 text-primary border-primary/30 gap-1.5 px-3 py-1">
                        <HeartHandshake className="h-3.5 w-3.5" />
                        Dukungan Komunitas
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Leaderboard Donasi
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                        Setiap donasi membuat platform ini terus berkembang. Peringkat donatur (data dummy).
                    </p>
                </div>

                {/* Stats strip */}
                <div className="flex flex-wrap justify-center gap-3">
                    <Card className="border-border/80 bg-card/80 backdrop-blur-sm shadow-sm flex flex-row">
                        <CardContent className="flex items-center gap-3 px-4 py-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                <Trophy className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Prize Bulan Ini</p>
                                <p className="font-semibold tabular-nums">{currency.format(prizePool.monthly)}</p>
                            </div>
                        </CardContent>

                        <div className="border-r border-border/80"></div>

                        <CardContent className="flex items-center gap-3 px-4 py-3">
                            <div className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Tersedia</p>
                                <p className="font-semibold tabular-nums">{currency.format(prizePool.totalAvailable)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Podium — 2nd, 1st, 3rd */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto items-end">
                    {[second, first, third].map((person, i) => {
                        if (!person) return <div key={i} />
                        const rank = i === 1 ? 1 : i === 0 ? 2 : 3
                        const isFirst = rank === 1
                        const heights = ['h-28 sm:h-32', 'h-36 sm:h-40', 'h-28 sm:h-32']

                        return (
                            <div
                                key={person.name}
                                className={cn(
                                    'relative flex flex-col items-center rounded-2xl border overflow-hidden transition-all',
                                    'bg-linear-to-b',
                                    rankStyles[rank],
                                    'ring-2',
                                    heights[i],
                                    isFirst && 'shadow-lg shadow-amber-500/20 -translate-y-1'
                                )}
                            >
                                <div className="absolute inset-0 bg-white/5" />
                                <div className="relative flex flex-col items-center justify-end flex-1 w-full pt-3 pb-4 px-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold mb-2">
                                        {isFirst ? <Crown className="h-3.5 w-3.5" /> : rank}
                                    </span>
                                    <Avatar className="h-12 w-12 ring-2 ring-white/30 mb-2">
                                        <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
                                            {person.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-white font-semibold text-sm truncate w-full text-center px-1">
                                        {person.name}
                                    </p>
                                    <p className="text-white/90 text-xs font-mono font-semibold">
                                        {currency.format(person.amount)}
                                    </p>
                                    <p className="text-white/70 text-[10px] truncate w-full text-center px-1 mt-0.5">
                                        {person.message}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <p className="text-center text-xs text-muted-foreground">Top 3 Donatur • Juara Bulan Ini</p>

                {/* Rank list — table (peringkat 4 ke bawah, top 3 hanya di podium) — styling tadi */}
                <div className="bg-slate-900/70 border border-white/10 rounded-3xl shadow-2xl overflow-hidden container mx-auto">
                    <div className="px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Daily Competition</p>
                            <h3 className="text-xl font-semibold text-white">Climb the leaderboard & klaim rewards</h3>
                            <p className="text-sm text-muted-foreground">Peringkat 4 ke bawah (dummy data)</p>
                        </div>
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                            Peringkat 4 ke bawah
                        </Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow className="border-white/5">
                                    <TableHead className="text-white/70 pl-5">No</TableHead>
                                    <TableHead className="text-white/70">Donatur</TableHead>
                                    <TableHead className="text-white/70">Pesan</TableHead>
                                    <TableHead className="text-white/70 text-right">Nominal</TableHead>
                                    <TableHead className="text-white/70 text-right pr-5">Waktu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rest.map((item, idx) => (
                                    <TableRow key={item.name} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="text-white/80 pl-6">{idx + 4}</TableCell>
                                        <TableCell className="text-white flex items-center gap-3">
                                            <Avatar className="h-8 w-8 bg-white/10">
                                                <AvatarFallback className="text-white bg-white/10">
                                                    {item.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{item.name}</span>
                                        </TableCell>
                                        <TableCell className="text-white/70">{item.message}</TableCell>
                                        <TableCell className="text-right font-semibold text-emerald-300">
                                            {currency.format(item.amount)}
                                        </TableCell>
                                        <TableCell className="text-right text-white/60 flex items-center justify-end gap-2 pr-5">
                                            {item.time}
                                            <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </section>
    )
}
