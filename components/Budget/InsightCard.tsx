import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface InsightCardProps {
  title: string
  description: string
}

const InsightCard = ({ title, description }: InsightCardProps) => {
  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default InsightCard
