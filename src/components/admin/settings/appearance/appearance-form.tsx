import { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const fonts = [
  { label: 'Inter', value: "'Inter Variable', sans-serif" },
  { label: 'System', value: 'system-ui, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
]

export function AppearanceForm() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    localStorage.getItem('admin-theme') === 'dark' ? 'dark' : 'light'
  )
  const [font, setFont] = useState(() =>
    localStorage.getItem('admin-font') ?? fonts[0].value
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.fontFamily = font
    localStorage.setItem('admin-theme', theme)
    localStorage.setItem('admin-font', font)
  }, [font, theme])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success('Appearance preferences updated')
  }

  return (
    <form onSubmit={onSubmit} className='max-w-md space-y-6'>
      <label className='block space-y-2 text-sm font-medium' htmlFor='appearance-theme'>
        Theme
        <select
          id='appearance-theme'
          value={theme}
          onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
          className='h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
        >
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
        </select>
        <span className='block font-normal text-muted-foreground'>Select the dashboard theme.</span>
      </label>
      <label className='block space-y-2 text-sm font-medium' htmlFor='appearance-font'>
        Font
        <select
          id='appearance-font'
          value={font}
          onChange={(event) => setFont(event.target.value)}
          className='h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
        >
          {fonts.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
        <span className='block font-normal text-muted-foreground'>Set the font used throughout the dashboard.</span>
      </label>
        <Button type='submit'>Update preferences</Button>
    </form>
  )
}
