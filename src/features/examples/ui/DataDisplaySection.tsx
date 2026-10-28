import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GallerySection } from '@/features/examples/components/GallerySection'

const code = `<Badge variant="secondary">New</Badge>
<Tabs defaultValue="a">
  <TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList>
  <TabsContent value="a">...</TabsContent>
</Tabs>
<Accordion><AccordionItem value="1">...</AccordionItem></Accordion>`

const rows = [
  { name: '홍길동', role: '개발자', status: '활성' },
  { name: '김영희', role: '디자이너', status: '휴가' },
]

export function DataDisplaySection() {
  return (
    <GallerySection code={code}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>default</Badge>
          <Badge variant="secondary">secondary</Badge>
          <Badge variant="outline">outline</Badge>
          <Badge variant="destructive">destructive</Badge>
          <Avatar>
            <AvatarFallback>홍</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>김</AvatarFallback>
          </Avatar>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>카드 제목</CardTitle>
            <CardDescription>
              카드는 관련 정보를 묶어 보여줍니다.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 테이블이 좁은 화면에서 넘치지 않도록 가로 스크롤을 허용한다 */}
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ name, role, status }) => (
                <TableRow key={name}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>{role}</TableCell>
                  <TableCell>{status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="detail">상세</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-3 text-sm">
            개요 탭의 내용입니다.
          </TabsContent>
          <TabsContent value="detail" className="pt-3 text-sm">
            상세 탭의 내용입니다.
          </TabsContent>
        </Tabs>

        <Accordion>
          <AccordionItem value="q1">
            <AccordionTrigger>다크 모드는 어떻게 동작하나요?</AccordionTrigger>
            <AccordionContent>
              {'<html>'} 의 dark 클래스에 따라 CSS 변수가 바뀝니다.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>컴포넌트를 수정해도 되나요?</AccordionTrigger>
            <AccordionContent>
              shadcn/ui 는 소스 코드를 가져오는 방식이라 자유롭게 수정할 수
              있습니다.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </GallerySection>
  )
}
