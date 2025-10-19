import { Calendar, Eye } from "lucide-react"

interface AnnouncementDetailProps {
  title: string
  date: string
  seenCount: number
  content: string
}

export function AnnouncementDetail({ title, date, seenCount, content }: AnnouncementDetailProps) {
  return (
    <div className="w-full px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">{title}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 pb-6 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Seen by {seenCount}</span>
        </div>
      </div>

      <p className="text-sm sm:text-base leading-relaxed text-foreground/90">{content}</p>
    </div>
  )
}
