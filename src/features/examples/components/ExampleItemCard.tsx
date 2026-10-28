import { Link } from 'react-router'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ExampleItem } from '@/features/examples/registry'

interface ExampleItemCardProps {
  item: ExampleItem
  to: string // 해당 예제(탭/섹션)로 바로 이동하는 주소
}

// 개별 예제 하나를 가리키는 카드. 카테고리 카드(ExampleCard)보다 작고 촘촘하다
export function ExampleItemCard({ item, to }: ExampleItemCardProps) {
  const { title, description, tags, icon: Icon } = item

  return (
    <Link
      to={to}
      className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
              <Icon className="size-5" />
            </span>
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        </CardHeader>
      </Card>
    </Link>
  )
}
