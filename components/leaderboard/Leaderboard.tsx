import { Trophy, HeartHandshake, Timer, ArrowUpRight } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const donations = [
    { name: 'Prashant Deepak', amount: 8900100, message: 'Untuk inovasi AI yang lebih baik', time: '2 menit lalu' },
    { name: 'Towshif Rakib', amount: 6500100, message: 'Keep pushing forward!', time: '12 menit lalu' },
    { name: 'Rohit Katariya', amount: 5800100, message: 'Bangun ekosistem yang kuat', time: '30 menit lalu' },
    { name: 'Miles Esther', amount: 2000000, message: 'Semangat terus tim!', time: '1 jam lalu' },
    { name: 'Aulia Tech', amount: 1500000, message: 'Keep building great tools!', time: '2 jam lalu' },
    { name: 'Creative Labs', amount: 1200000, message: 'Terima kasih atas inspirasinya', time: '3 jam lalu' },
    { name: 'Fajar Studio', amount: 950000, message: 'Sukses selalu!', time: '5 jam lalu' },
    { name: 'Harapan Digital', amount: 750000, message: 'Bantu scaling produk', time: '6 jam lalu' },
    { name: 'Intan Syifa', amount: 420000, message: 'Terima kasih bantuannya', time: '8 jam lalu' },
]

const prizePool = {
    monthly: 10000000,
    endsIn: '3 hari lagi',
    totalAvailable: 25000000,
}

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
})

const podiumStyles = [
    'from-emerald-600/90 via-emerald-500/80 to-emerald-400/70',
    'from-amber-500/95 via-amber-400/90 to-yellow-300/80',
    'from-teal-500/80 via-teal-400/75 to-cyan-300/70',
]

export default function Leaderboard() {
    const sorted = [...donations].sort((a, b) => b.amount - a.amount)
    const [first, second, third] = sorted

    return (
        <section className="py-20 sm:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-950 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,204,113,0.08),transparent_50%)]" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative space-y-10">
                <div className="text-center space-y-3">
                    <Badge className="bg-primary/10 text-primary border-primary/30 gap-2">
                        <HeartHandshake className="h-4 w-4" />
                        Dukungan Komunitas
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow">
                        Leaderboard Donasi
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Setiap donasi membuat platform ini terus berkembang. Berikut peringkat donatur dengan data dummy.
                    </p>
                </div>

                <div className="mx-auto max-w-md mb-28">
                    <Card className="bg-linear-to-r from-slate-800/80 via-slate-800/60 to-slate-800/80 border border-white/10 shadow-2xl">
                        <CardContent className="flex items-center justify-center gap-6 p-6 sm:p-8">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/20 border border-amber-300/40">
                                    <Trophy className="h-6 w-6 text-amber-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-amber-200/80">Monthly Prize Pool</p>
                                    <p className="text-2xl font-semibold text-white">{currency.format(prizePool.monthly)}</p>
                                    <p className="text-xs text-muted-foreground">Total rewards up for grabs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {[second, first, third].map((person, idx) => {
                        if (!person) return null
                        const isChampion = idx === 1
                        const rank = isChampion ? 1 : idx === 0 ? 2 : 3
                        const gradient = podiumStyles[isChampion ? 1 : idx === 0 ? 0 : 2]

                        return (
                            <div
                                key={person.name}
                                className={`relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl ${isChampion ? 'scale-105 lg:scale-110 -translate-y-10 z-10' : 'scale-100'} transition-transform`}
                            >
                                <div className={`absolute inset-0 bg-linear-to-b ${gradient} opacity-80`} />
                                <div className="relative p-6 sm:p-8 flex flex-col items-center text-center gap-4">
                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/20 font-semibold">{rank}</span>
                                        <span>{isChampion ? 'Juara Bulan Ini' : 'Top Donatur'}</span>
                                    </div>
                                    <Avatar className="h-16 w-16 ring-4 ring-white/20 shadow-lg">
                                        <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
                                            {person.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1 text-white">
                                        <p className="text-lg font-semibold">{person.name}</p>
                                        <p className="text-2xl font-bold tracking-tight">{currency.format(person.amount)}</p>
                                        <p className="text-sm text-white/80">{person.message}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="bg-slate-900/70 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Daily Competition</p>
                            <h3 className="text-xl font-semibold text-white">Climb the leaderboard & klaim rewards</h3>
                            <p className="text-sm text-muted-foreground">10 donor terakhir (dummy data)</p>
                        </div>
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                            Last 10 Donors
                        </Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow className="border-white/5">
                                    <TableHead className="text-white/70">#</TableHead>
                                    <TableHead className="text-white/70">Donatur</TableHead>
                                    <TableHead className="text-white/70">Pesan</TableHead>
                                    <TableHead className="text-white/70 text-right">Nominal</TableHead>
                                    <TableHead className="text-white/70 text-right">Waktu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sorted.map((item, idx) => (
                                    <TableRow key={item.name} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="text-white/80">{idx + 1}</TableCell>
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
                                        <TableCell className="text-right text-white/60 flex items-center justify-end gap-2">
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
