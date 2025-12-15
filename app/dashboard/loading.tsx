import { DashboardSkeleton } from "@/components/dashboard/loading-skeleton"
import { Navbar } from "@/components/navbar"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DashboardSkeleton />
      </div>
    </div>
  )
}

