import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-paper group-[.toaster]:text-ink group-[.toaster]:border-hairline group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-dark-subtle dark:group-[.toaster]:text-dark-text-main dark:group-[.toaster]:border-dark-hairline font-sans rounded-none",
          description: "group-[.toast]:text-ink-muted dark:group-[.toast]:text-dark-text-muted font-mono text-xs",
          actionButton:
            "group-[.toast]:bg-ink group-[.toast]:text-paper font-mono text-xs rounded-none",
          cancelButton:
            "group-[.toast]:bg-paper-dim group-[.toast]:text-ink-muted font-mono text-xs rounded-none",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
