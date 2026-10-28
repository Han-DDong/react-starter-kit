import { Link } from 'react-router'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { categoryLink, type ExampleEntry } from '@/features/examples/registry'

// 예제 하나를 소개하는 카드. 카드 전체가 링크라서 클릭 영역이 넓다
export function ExampleCard({ example }: { example: ExampleEntry }) {
  const { title, description, tags, icon: Icon } = example

  return (
    <Link
      to={categoryLink(example)}
      className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <Icon className="mb-2 size-6 text-primary" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <ul className="flex flex-wrap gap-1.5 pt-2">
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
