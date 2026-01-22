"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { User, ShoppingBag, Star, Settings, LogOut, Mail, Calendar } from "lucide-react"

import { useState } from "react"

import { useAuth } from "@/utils/context/AuthContext"

import { formatDate } from "@/lib/format-date"

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile")

    const { user, loading, logout, deleteAccount } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const handleLogout = async () => {
        await logout()
    }

    const handleDeleteAccount = async () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            await deleteAccount()
        }
    }

    const transactions = [
        {
            id: "TXN-001",
            product: "E-Commerce Dashboard Template",
            amount: "$39.20",
            date: "2025-01-08",
            status: "completed",
        },
        {
            id: "TXN-002",
            product: "SaaS Landing Page Kit",
            amount: "$18.85",
            date: "2025-01-05",
            status: "completed",
        },
        {
            id: "TXN-003",
            product: "Authentication System",
            amount: "$79.00",
            date: "2025-01-01",
            status: "completed",
        },
    ]

    const messages = [
        {
            id: "MSG-001",
            sender: "Support Team",
            subject: "Your Purchase Receipt",
            preview: "Thank you for purchasing E-Commerce Dashboard Template...",
            date: "2025-01-08",
            unread: false,
        },
        {
            id: "MSG-002",
            sender: "Developer Support",
            subject: "Getting Started with Your Template",
            preview: "We're here to help! Check out our documentation...",
            date: "2025-01-06",
            unread: true,
        },
        {
            id: "MSG-003",
            sender: "Notifications",
            subject: "New Product Available in Your Category",
            preview: "Check out our latest AI/ML components...",
            date: "2025-01-02",
            unread: false,
        },
    ]

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8">
                        <Avatar className="w-24 h-24 border-2 border-border">
                            <AvatarImage src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} />
                            <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{user.displayName || "User"}</h1>
                            <p className="text-muted-foreground mb-4">{user.role === "admins" ? "Administrator" : "Developer & Tech Enthusiast"}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                {user.createdAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Joined {formatDate(user.createdAt, "MMM d, yyyy")}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button variant="outline" className="w-full md:w-auto bg-transparent" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">12</p>
                                <p className="text-sm text-muted-foreground">Products Purchased</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">$487</p>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">8</p>
                                <p className="text-sm text-muted-foreground">Ratings Given</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline">Purchases</span>
                        </TabsTrigger>
                        <TabsTrigger value="reviews" className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span className="hidden sm:inline">Reviews</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={user.displayName || ""}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={user.email || ""}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Provider</label>
                                        <input
                                            type="text"
                                            defaultValue={user.provider || "email"}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <Button>Save Changes</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Purchase History</CardTitle>
                                <CardDescription>Your recent transactions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {transactions.map((txn) => (
                                        <div key={txn.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-semibold">{txn.product}</p>
                                                <p className="text-sm text-muted-foreground">{txn.id}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{txn.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-lg">{txn.amount}</p>
                                                <Badge variant="secondary" className="mt-2">
                                                    {txn.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reviews Tab */}
                    <TabsContent value="reviews" className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Reviews</h1>
                            <p className="text-sm text-muted-foreground mb-4">Your recent reviews</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {messages.map((message) => (
                                    <div key={message.id} className="p-4 border border-border rounded-lg">
                                        <h2 className="text-lg font-bold">{message.sender}</h2>
                                        <p className="text-sm text-muted-foreground">{message.subject}</p>
                                        <p className="text-sm text-muted-foreground">{message.preview}</p>
                                        <p className="text-sm text-muted-foreground">{message.date}</p>
                                        <Badge variant="secondary" className="mt-2">
                                            {message.unread ? "Unread" : "Read"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Manage your account settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive updates about new products</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold">Marketing Emails</p>
                                            <p className="text-sm text-muted-foreground">Get special offers and discounts</p>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold">Two-Factor Authentication</p>
                                            <p className="text-sm text-muted-foreground">Enhanced security for your account</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border">
                                    <p className="font-semibold mb-4">Danger Zone</p>
                                    <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
