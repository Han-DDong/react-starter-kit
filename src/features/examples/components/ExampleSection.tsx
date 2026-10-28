import { ExampleItemCard } from '@/features/examples/components/ExampleItemCard'
import { getItemLink, type ExampleEntry } from '@/features/examples/registry'

// 카테고리 하나를 "헤더 + 개별 예제 카드 그리드"로 보여준다
export function ExampleSection({ entry }: { entry: ExampleEntry }) {
  const { id, title, description, icon: Icon, items } = entry

  return (
    // scroll-mt: sticky 헤더에 제목이 가려지지 않도록 스크롤 위치를 띄운다
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 space-y-4"
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-1 size-6 shrink-0 text-primary" />
        <div>
          <h2
            id={`${id}-title`}
            className="text-xl font-semibold tracking-tight"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ExampleItemCard
            key={item.id}
            item={item}
            to={getItemLink(entry, item)}
          />
        ))}
      </div>
    </section>
  )
}
