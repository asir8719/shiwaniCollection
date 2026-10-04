import { z } from 'zod'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const [selectedItems, setSelectedItems] = useState(defaultValues.items ?? [])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = displayFormSchema.safeParse({ items: selectedItems })
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Select at least one item.')
      return
    }
    toast.success('Display preferences updated')
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <fieldset className='space-y-4'>
        <legend className='text-base font-medium'>Sidebar</legend>
        <p className='text-sm text-muted-foreground'>Select the items you want to display in the sidebar.</p>
        {items.map((item) => (
          <label key={item.id} className='flex items-center gap-3 text-sm'>
            <input
              type='checkbox'
              checked={selectedItems.includes(item.id)}
              onChange={(event) => {
                setSelectedItems((current) => event.target.checked
                  ? [...current, item.id]
                  : current.filter((value) => value !== item.id))
              }}
              className='size-4 accent-primary'
            />
            {item.label}
          </label>
        ))}
      </fieldset>
        <Button type='submit'>Update display</Button>
    </form>
  )
}
