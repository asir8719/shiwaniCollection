import { z } from 'zod'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabaseClient'

const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? 'Please select an email to display.'
        : undefined,
  }),
  phone: z
    .string()
    .min(1, 'Mobile number is required.')
    .regex(indianPhoneRegex, 'Please enter a valid 10-digit Indian mobile number.'),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.url('Please enter a valid URL.'),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: [
    { value: 'https://shadcn.com' },
    { value: 'http://twitter.com/shadcn' },
  ],
}

export function ProfileForm() {
  const [username, setUsername] = useState(defaultValues.username ?? '')
  const [email, setEmail] = useState(defaultValues.email ?? '')
  const [bio, setBio] = useState(defaultValues.bio ?? '')
  const [phone, setPhone] = useState(defaultValues.phone ?? '')
  const [urls, setUrls] = useState(
    defaultValues.urls?.map(({ value }) => value) ?? []
  )

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = profileFormSchema.safeParse({
      username,
      email,
      bio,
      phone,
      urls: urls.map((value) => ({ value })),
    })

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Please check your profile details.')
      return
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        username: username.trim(),
        full_name: username.trim(),
        mobile: phone.trim(),
        bio: bio.trim(),
        urls: urls,
      }
    })

    if (authError) {
      toast.error(`Failed to update profile: ${authError.message}`)
      return
    }

    toast.success('Profile updated')
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <label className='block space-y-2 text-sm font-medium' htmlFor='profile-username'>
        Username
        <Input
          id='profile-username'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          minLength={2}
          maxLength={30}
          required
        />
        <span className='block font-normal text-muted-foreground'>
          This is your public display name. You can only change it once every 30 days.
        </span>
      </label>
      <label className='block space-y-2 text-sm font-medium' htmlFor='profile-email'>
        Email
        <Input
          id='profile-email'
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <span className='block font-normal text-muted-foreground'>
          Use a verified email address for account messages.
        </span>
      </label>
      <label className='block space-y-2 text-sm font-medium' htmlFor='profile-phone'>
        Phone Number
        <Input
          id='profile-phone'
          type='tel'
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
        <span className='block font-normal text-muted-foreground'>
          Use a valid phone number for receiving customer call.
        </span>
      </label>
      <label className='block space-y-2 text-sm font-medium' htmlFor='profile-bio'>
        Bio
        <textarea
          id='profile-bio'
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          className='min-h-24 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
          maxLength={160}
          required
        />
        <span className='block font-normal text-muted-foreground'>
          Tell people a little about yourself (4 to 160 characters).
        </span>
      </label>
      <fieldset className='space-y-2'>
        <legend className='text-sm font-medium'>Website and social links</legend>
        <p className='text-sm text-muted-foreground'>Add links to your website, blog, or social profiles.</p>
        {urls.map((url, index) => (
          <Input
            key={index}
            aria-label={`Profile URL ${index + 1}`}
            type='url'
            value={url}
            onChange={(event) => {
              setUrls((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))
            }}
          />
        ))}
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => setUrls((current) => [...current, ''])}
        >
          Add URL
        </Button>
      </fieldset>
        <Button type='submit'>Update profile</Button>
    </form>
  )
}
