import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

interface InsightCardProps {
  title: string
  description: string
}

const InsightCard = ({ title, description }: InsightCardProps) => {
  return (
    <Card className="rounded-sm">
      <CardHeader className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default InsightCard
