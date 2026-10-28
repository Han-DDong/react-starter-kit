import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { GallerySection } from '@/features/examples/components/GallerySection'

const fruits = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'grape', label: '포도' },
]

const code = `<Input placeholder="이름" />
<Textarea placeholder="내용" />
<Select items={items} value={value} onValueChange={setValue}>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>{/* SelectItem ... */}</SelectContent>
</Select>
<Checkbox /> <Switch /> <RadioGroup>...</RadioGroup>`

export function InputsSection() {
  const [fruit, setFruit] = useState<string | null>('apple')

  return (
    <GallerySection code={code}>
      <div className="grid gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="gallery-input">이름</FieldLabel>
          <Input id="gallery-input" placeholder="홍길동" />
        </Field>

        <Field>
          <FieldLabel htmlFor="gallery-select">좋아하는 과일</FieldLabel>
          <Select items={fruits} value={fruit} onValueChange={setFruit}>
            <SelectTrigger id="gallery-select" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fruits.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="gallery-textarea">내용</FieldLabel>
          <Textarea id="gallery-textarea" placeholder="내용을 입력하세요" />
        </Field>

        <div className="flex items-center gap-2">
          <Checkbox id="gallery-check" />
          <Label htmlFor="gallery-check">약관에 동의합니다</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="gallery-switch" />
          <Label htmlFor="gallery-switch">알림 받기</Label>
        </div>

        <RadioGroup defaultValue="monthly" className="md:col-span-2">
          {[
            { value: 'monthly', label: '월간 결제' },
            { value: 'yearly', label: '연간 결제' },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={`gallery-radio-${value}`} />
              <Label htmlFor={`gallery-radio-${value}`}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </GallerySection>
  )
}
