import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Award, DollarSign, TrendingUp, Users } from "lucide-react";
import { getAllArtists } from "@/lib/data";

export default async function Home() {
  const featuredArtists = await getAllArtists();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/20 to-background py-20 md:py-32">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Compare Artists Like Never Before
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
            Discover and compare artists based on net worth, fame, early income,
            and career milestones. Make data-driven insights about your favorite
            artists.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/compare">Start Comparing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Comprehensive Artist Metrics
            </h2>
            <p className="mt-4 text-muted-foreground">
              Compare artists across multiple dimensions to get the full picture
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="space-y-1">
                <DollarSign className="h-8 w-8 text-primary" />
                <CardTitle>Net Worth</CardTitle>
                <CardDescription>
                  Compare artists' financial success and wealth accumulation
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <Users className="h-8 w-8 text-primary" />
                <CardTitle>Fame & Reach</CardTitle>
                <CardDescription>
                  Analyze social media following and global influence
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <TrendingUp className="h-8 w-8 text-primary" />
                <CardTitle>Career Growth</CardTitle>
                <CardDescription>
                  Track career trajectory and key milestones
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <Award className="h-8 w-8 text-primary" />
                <CardTitle>Awards & Recognition</CardTitle>
                <CardDescription>
                  Compare accolades and industry recognition
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
