"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, FolderIcon, ChartBarIcon, ListIcon } from "lucide-react"
import { Link } from "react-router-dom"

const cardContent = [
  { cardHeading: "Categories", cardContent: "4", icon: <ListIcon />, link: "/admin/categories", imgSrc: "" },
  { cardHeading: "Products", cardContent: "14", icon: <FolderIcon />, link: "/admin/products", imgSrc: "" },
  { cardHeading: "Advertisements", cardContent: "3", icon: <ChartBarIcon />, link: "/admin/advertisements", imgSrc: "" },
  // { cardHeading: "", cardContent: "", icon: "", link: "" },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {
        cardContent.map((card, index) => {
          return (
            <Card key={index} className="@container/card flex flex-row justify-around items-center">
            <CardHeader>
              <CardDescription>{card.cardHeading}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.cardContent}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="scale-300 opacity-15">
                {card.icon}
              </div>
            </CardFooter>
            <Link to={card.link}>
              <CardAction>
                  <Badge variant="outline">
                    <TrendingUpIcon
                    />
                  </Badge>
                </CardAction>
            </Link>
          </Card>
          )
        })
      }
    </div>
  )
}
