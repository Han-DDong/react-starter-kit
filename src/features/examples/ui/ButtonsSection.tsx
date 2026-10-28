import { Mail } from 'lucide-react'
import { GallerySection } from '@/features/examples/components/GallerySection'
import { Button } from '@/components/ui/button'

const variants = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
] as const

const code = `<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
<Button disabled>Disabled</Button>`

export function ButtonsSection() {
  return (
    <GallerySection code={code}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">xs</Button>
          <Button size="sm">sm</Button>
          <Button size="default">default</Button>
          <Button size="lg">lg</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            <Mail data-icon="inline-start" />
            아이콘 버튼
          </Button>
          <Button size="icon" variant="outline" aria-label="메일">
            <Mail />
          </Button>
          <Button disabled>비활성</Button>
        </div>
      </div>
    </GallerySection>
  )
}
