"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyH1, TypographyH2, TypographyP, TypographyList, TypographyListItem } from '@/components/ui/typography';
import { 
  HelpCircle, 
  MessageSquare, 
  Zap, 
  Shield, 
  CreditCard, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category?: string;
}

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Sparkles,
    color: 'text-blue-500'
  },
  {
    id: 'features',
    title: 'Features & Usage',
    icon: Zap,
    color: 'text-purple-500'
  },
  {
    id: 'account',
    title: 'Account & Billing',
    icon: CreditCard,
    color: 'text-green-500'
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: Settings,
    color: 'text-orange-500'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    color: 'text-red-500'
  }
];

const faqs: FAQItem[] = [
  // Getting Started
  {
    question: 'Apa itu Rizki AI?',
    answer: 'Rizki AI adalah platform AI assistant yang menyediakan berbagai layanan khusus untuk membantu Anda dalam berbagai aspek kehidupan, mulai dari akademik, profesional, personal, hingga kreatif. Platform ini menawarkan berbagai asisten AI yang dapat membantu dengan tugas-tugas spesifik seperti pemrograman, kesehatan, keuangan, marketing, dan banyak lagi.',
    category: 'getting-started'
  },
  {
    question: 'Bagaimana cara memulai menggunakan Rizki AI?',
    answer: (
      <>
        Untuk memulai menggunakan Rizki AI:
        <TypographyList>
          <TypographyListItem>Daftar atau masuk ke akun Anda</TypographyListItem>
          <TypographyListItem>Jelajahi berbagai kategori layanan yang tersedia</TypographyListItem>
          <TypographyListItem>Pilih asisten AI yang sesuai dengan kebutuhan Anda</TypographyListItem>
          <TypographyListItem>Mulai berinteraksi dengan mengajukan pertanyaan atau memberikan instruksi</TypographyListItem>
        </TypographyList>
      </>
    ),
    category: 'getting-started'
  },
  {
    question: 'Apakah Rizki AI gratis?',
    answer: 'Rizki AI menawarkan berbagai paket layanan. Beberapa fitur mungkin tersedia secara gratis dengan batasan tertentu, sementara fitur premium memerlukan langganan. Silakan periksa halaman pricing untuk informasi lebih lanjut tentang paket yang tersedia.',
    category: 'getting-started'
  },
  
  // Features & Usage
  {
    question: 'Fitur apa saja yang tersedia di Rizki AI?',
    answer: (
      <>
        Rizki AI menawarkan berbagai kategori layanan:
        <TypographyList>
          <TypographyListItem><strong>Tech Hub:</strong> Programming Assistant, Technology Assistant</TypographyListItem>
          <TypographyListItem><strong>Personal:</strong> Teman Curhat, Health Assistant</TypographyListItem>
          <TypographyListItem><strong>Image AI:</strong> Image Analysis, Image Generator</TypographyListItem>
          <TypographyListItem><strong>Education:</strong> Academic Assistant, Science Assistant, Translation</TypographyListItem>
          <TypographyListItem><strong>Professional:</strong> Legal Assistant, Marketing Assistant, Finance Assistant, SEO Assistant</TypographyListItem>
          <TypographyListItem><strong>Video AI:</strong> Video Analysis, Video Generator</TypographyListItem>
        </TypographyList>
      </>
    ),
    category: 'features'
  },
  {
    question: 'Bagaimana cara menggunakan Image Generator?',
    answer: 'Untuk menggunakan Image Generator, kunjungi halaman Image Generator, masukkan deskripsi gambar yang ingin Anda buat, dan AI akan menghasilkan gambar sesuai dengan deskripsi Anda. Anda dapat memberikan detail sebanyak mungkin untuk hasil yang lebih baik.',
    category: 'features'
  },
  {
    question: 'Dapatkah saya menggunakan asisten AI untuk tugas akademik?',
    answer: 'Ya, Rizki AI menyediakan Academic Assistant yang dapat membantu Anda dengan metodologi penelitian, penulisan akademik, dan topik-topik ilmiah. Asisten ini dirancang untuk membantu proses belajar dan penelitian Anda.',
    category: 'features'
  },
  {
    question: 'Apakah saya bisa menggunakan voice input?',
    answer: 'Ya, beberapa asisten AI di Rizki AI mendukung voice input. Cari tombol mikrofon di antarmuka chat untuk mengaktifkan fitur voice recognition. Pastikan browser Anda mendukung Web Speech API.',
    category: 'features'
  },
  
  // Account & Billing
  {
    question: 'Bagaimana cara mengubah profil saya?',
    answer: 'Anda dapat mengubah profil Anda dengan mengunjungi halaman Profile. Di sana Anda dapat memperbarui informasi akun, preferensi, dan pengaturan lainnya.',
    category: 'account'
  },
  {
    question: 'Bagaimana cara membatalkan langganan?',
    answer: 'Untuk membatalkan langganan, kunjungi halaman Profile atau Settings, lalu pilih opsi Billing atau Subscription. Ikuti instruksi yang diberikan untuk membatalkan langganan Anda.',
    category: 'account'
  },
  {
    question: 'Metode pembayaran apa yang diterima?',
    answer: 'Rizki AI menerima berbagai metode pembayaran termasuk kartu kredit, debit, dan metode pembayaran digital lainnya. Informasi lengkap tersedia di halaman checkout saat berlangganan.',
    category: 'account'
  },
  
  // Technical Support
  {
    question: 'Apa yang harus saya lakukan jika mengalami masalah teknis?',
    answer: (
      <>
        Jika Anda mengalami masalah teknis:
        <TypographyList>
          <TypographyListItem>Periksa koneksi internet Anda</TypographyListItem>
          <TypographyListItem>Refresh halaman atau coba browser lain</TypographyListItem>
          <TypographyListItem>Hapus cache dan cookies browser</TypographyListItem>
          <TypographyListItem>Hubungi tim support melalui email atau halaman kontak</TypographyListItem>
        </TypographyList>
      </>
    ),
    category: 'technical'
  },
  {
    question: 'Browser apa yang didukung?',
    answer: 'Rizki AI mendukung browser modern seperti Chrome, Firefox, Safari, dan Edge versi terbaru. Untuk pengalaman terbaik, gunakan versi terbaru dari browser pilihan Anda.',
    category: 'technical'
  },
  {
    question: 'Apakah Rizki AI tersedia di mobile?',
    answer: 'Ya, Rizki AI dirancang responsif dan dapat diakses melalui perangkat mobile. Anda dapat menggunakan platform ini melalui browser mobile di smartphone atau tablet Anda.',
    category: 'technical'
  },
  
  // Privacy & Security
  {
    question: 'Bagaimana data saya dilindungi?',
    answer: 'Rizki AI mengambil privasi dan keamanan data Anda dengan serius. Kami menggunakan enkripsi untuk melindungi data Anda dan mengikuti praktik keamanan terbaik. Data Anda tidak dibagikan dengan pihak ketiga tanpa persetujuan Anda.',
    category: 'privacy'
  },
  {
    question: 'Apakah percakapan saya disimpan?',
    answer: 'Rizki AI dapat menyimpan riwayat percakapan untuk meningkatkan pengalaman Anda dan memungkinkan Anda mengakses percakapan sebelumnya. Anda dapat menghapus riwayat percakapan kapan saja melalui pengaturan akun.',
    category: 'privacy'
  },
  {
    question: 'Bagaimana cara menghapus akun saya?',
    answer: 'Untuk menghapus akun Anda, kunjungi halaman Profile atau Settings, lalu pilih opsi "Delete Account". Ikuti instruksi yang diberikan. Perhatikan bahwa tindakan ini tidak dapat dibatalkan dan semua data Anda akan dihapus secara permanen.',
    category: 'privacy'
  }
];

export default function Help() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFaqs = selectedCategory
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <TypographyH1>Pusat Bantuan</TypographyH1>
          <TypographyP className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan Anda dan pelajari cara menggunakan Rizki AI dengan lebih efektif
          </TypographyP>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, label: 'Dokumentasi', href: '/blog' },
            { icon: MessageSquare, label: 'Kontak Support', href: 'mailto:hello@rizkiai.com' },
            { icon: Sparkles, label: 'Fitur', href: '/' },
            { icon: Settings, label: 'Pengaturan', href: '/profile' }
          ].map((item, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <item.icon className="w-8 h-8 text-primary mb-2" />
                <TypographyP className="text-sm font-medium">{item.label}</TypographyP>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <TypographyH2 className="mb-4">Kategori Pertanyaan</TypographyH2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors",
                !selectedCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted"
              )}
            >
              Semua
            </button>
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg border transition-colors flex items-center gap-2",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted"
                  )}
                >
                  <Icon className={cn("w-4 h-4", selectedCategory === category.id ? "text-primary-foreground" : category.color)} />
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <TypographyH2 className="mb-6">Pertanyaan yang Sering Diajukan</TypographyH2>
          {filteredFaqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            const category = faqCategories.find(cat => cat.id === faq.category);
            const Icon = category?.icon || HelpCircle;

            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn("p-2 rounded-lg bg-muted", category?.color || "text-primary")}>
                        <Icon className={cn("w-4 h-4", category?.color || "text-primary")} />
                      </div>
                      <CardTitle className="text-left">{faq.question}</CardTitle>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                {isOpen && (
                  <CardContent>
                    <div className="pl-11">
                      {typeof faq.answer === 'string' ? (
                        <TypographyP>{faq.answer}</TypographyP>
                      ) : (
                        faq.answer
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <TypographyH2>Tidak menemukan jawaban yang Anda cari?</TypographyH2>
            <TypographyP className="text-muted-foreground mt-2 mb-6">
              Tim support kami siap membantu Anda. Hubungi kami melalui email atau media sosial.
            </TypographyP>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:hello@rizkiai.com"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Kirim Email
              </a>
              <a
                href="/blog"
                className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Baca Dokumentasi
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
