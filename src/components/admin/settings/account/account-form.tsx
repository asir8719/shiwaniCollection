import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

export function AccountForm() {
  const [name, setName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [language, setLanguage] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success('Account settings updated')
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <label className='block space-y-2 text-sm font-medium' htmlFor='account-name'>
        Name
        <Input
          id='account-name'
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder='Your name'
          minLength={2}
          maxLength={30}
          required
        />
        <span className='block font-normal text-muted-foreground'>
          This is the name that will be displayed on your profile and in emails.
        </span>
      </label>
      <label className='block space-y-2 text-sm font-medium' htmlFor='account-dob'>
        Date of birth
        <Input
          id='account-dob'
          type='date'
          value={dateOfBirth}
          onChange={(event) => setDateOfBirth(event.target.value)}
          required
        />
        <span className='block font-normal text-muted-foreground'>
          Your date of birth is used to calculate your age.
        </span>
      </label>
      <label className='block space-y-2 text-sm font-medium' htmlFor='account-language'>
        Language
        <select
          id='account-language'
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className='h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
          required
        >
          <option value='' disabled>Select language</option>
          {languages.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className='block font-normal text-muted-foreground'>
          This is the language that will be used in the dashboard.
        </span>
      </label>
        <Button type='submit'>Update account</Button>
    </form>
  )
}
