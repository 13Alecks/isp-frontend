import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@/shared/components/ui";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/predictions">
            <Button>Go to Predictions</Button>
          </Link>
        </div>
        
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Students</CardTitle>
              <CardDescription>Overall student count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">1,234</div>
              <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>At-Risk Students</CardTitle>
              <CardDescription>Students requiring intervention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">87</div>
              <p className="text-sm text-muted-foreground mt-2">7.1% of total students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Predictions Made</CardTitle>
              <CardDescription>Total predictions this semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">3,456</div>
              <p className="text-sm text-muted-foreground mt-2">+23% from last semester</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}