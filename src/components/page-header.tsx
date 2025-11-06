import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('grid gap-1', className)}>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
