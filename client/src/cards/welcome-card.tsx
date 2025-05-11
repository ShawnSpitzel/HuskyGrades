import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WelcomeCardProps {
  name: string
}

export function WelcomeCard({ name }: WelcomeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back, {name}!</CardTitle>
        <CardDescription>Track your academic progress and plan for success this semester.</CardDescription>
      </CardHeader>
    </Card>
  )
}
