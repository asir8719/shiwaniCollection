import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ||
    localStorage.getItem('admin-theme') === 'dark'
      ? 'dark'
      : 'light'
  )

  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('admin-theme', theme)
  }, [theme])

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      className='scale-95 rounded-full'
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun aria-hidden='true' /> : <Moon aria-hidden='true' />}
    </Button>
  )
}
