import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GpaCardsProps {
  currentGpa: number
  optimisticGpa: number
  pessimisticGpa: number
}

export function GpaCards({ currentGpa, optimisticGpa, pessimisticGpa }: GpaCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Current Semester</CardDescription>
          <CardTitle className="text-3xl font-bold">GPA: {currentGpa.toFixed(2)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Predicted Optimistic</CardDescription>
          <CardTitle className="text-3xl font-bold text-emerald-600">GPA: {optimisticGpa.toFixed(2)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Predicted Pessimistic</CardDescription>
          <CardTitle className="text-3xl font-bold text-amber-600">GPA: {pessimisticGpa.toFixed(2)}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
