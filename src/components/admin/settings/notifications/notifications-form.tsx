import { z } from 'zod'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    error: (iss) =>
      iss.input === undefined
        ? 'Please select a notification type.'
        : undefined,
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

export function NotificationsForm() {
  const [type, setType] = useState<NotificationsFormValues['type']>('all')
  const [settings, setSettings] = useState({
    mobile: false,
    communication_emails: defaultValues.communication_emails ?? false,
    social_emails: defaultValues.social_emails ?? false,
    marketing_emails: defaultValues.marketing_emails ?? false,
    security_emails: defaultValues.security_emails ?? true,
  })

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = notificationsFormSchema.safeParse({ type, ...settings })
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Check your notification settings.')
      return
    }
    toast.success('Notification preferences updated')
  }

  return (
    <form onSubmit={onSubmit} className='space-y-8'>
      <fieldset className='space-y-3'>
        <legend className='text-sm font-medium'>Notify me about...</legend>
        {([
          ['all', 'All new messages'],
          ['mentions', 'Direct messages and mentions'],
          ['none', 'Nothing'],
        ] as const).map(([value, label]) => (
          <label key={value} className='flex items-center gap-3 text-sm'>
            <input
              type='radio'
              name='notification-type'
              value={value}
              checked={type === value}
              onChange={() => setType(value)}
              className='size-4 accent-primary'
            />
            {label}
          </label>
        ))}
      </fieldset>
      <fieldset className='space-y-4'>
        <legend className='text-lg font-medium'>Email Notifications</legend>
        {([
          ['communication_emails', 'Communication emails', 'Receive emails about your account activity.'],
          ['marketing_emails', 'Marketing emails', 'Receive emails about new products, features, and more.'],
          ['social_emails', 'Social emails', 'Receive emails for friend requests, follows, and more.'],
          ['security_emails', 'Security emails', 'Receive emails about your account activity and security.'],
        ] as const).map(([key, label, description]) => (
          <label key={key} className='flex items-center justify-between gap-4 rounded-md border p-4'>
            <span>
              <span className='block text-sm font-medium'>{label}</span>
              <span className='block text-sm text-muted-foreground'>{description}</span>
            </span>
            <input
              type='checkbox'
              checked={settings[key]}
              disabled={key === 'security_emails'}
              onChange={(event) => setSettings((current) => ({ ...current, [key]: event.target.checked }))}
              className='size-4 accent-primary'
            />
          </label>
        ))}
      </fieldset>
      <label className='flex items-start gap-3 text-sm'>
        <input
          type='checkbox'
          checked={settings.mobile}
          onChange={(event) => setSettings((current) => ({ ...current, mobile: event.target.checked }))}
          className='mt-0.5 size-4 accent-primary'
        />
        <span>
          Use different settings for my mobile devices
          <span className='block text-muted-foreground'>Manage mobile notification preferences separately.</span>
        </span>
      </label>
        <Button type='submit'>Update notifications</Button>
    </form>
  )
}
