'use client'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { formSchema, type TformSchema } from 'utils/types'
import MessageToPoliticians from './MessageToPoliticians'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type TInterpellateForm = {
  to: string[]
  missingData: unknown
}
export default function InterpellateForm({
  to = ['olivier.pretre@gmx.fr'],
  missingData,
}: TInterpellateForm) {
  const formMessage = MessageToPoliticians
  const {
    formState: { isSubmitting },
    setError,
  } = useForm()

  const form = useForm<TformSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      to: to[0],
      object:
        'Transparence des données publiques – Publication des investissements et marchés publics',
      message: formMessage,
    },
  })

  const onSubmit = async (data: TformSchema) => {
    const response = await fetch('/api/interpellate', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    if (!response.ok) {
      alert('Submitting form failed!')
      return
    }

    if (responseData.errors) {
      const errors = responseData.errors

      if (errors.firstname) {
        setError('firstname', {
          type: 'server',
          message: errors.firstname,
        })
      } else if (errors.lastname) {
        setError('lastname', {
          type: 'server',
          message: errors.lastname,
        })
      } else if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email,
        })
      } else {
        alert('Something went wrong!')
      }
    }
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap gap-4 justify-center items-start"
      >
        <fieldset className="basis-1/4">
          <legend className="mb-4">Vos coordonnées</legend>
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre adresse e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <fieldset className="basis-2/3">
          <legend className="mb-4">Votre message</legend>
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>À</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre adresse e-mail"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="object"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objet</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre nom" disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="simulatedTextArea">
            <div className="simulatedLabel">Votre message</div>
            <div
              id="simulatedTextAreaContent"
              dangerouslySetInnerHTML={{ __html: formMessage }}
            ></div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox id="terms" checked={true} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Recevoir une copie du message par e-mail
            </label>
          </div>
        </fieldset>

        <div className="my-12 min-w-full flex justify-center gap-4">
          <Link
            href="/"
            className={buttonVariants({
              variant: 'outline',
              className: 'min-w-[200] bg-black text-white',
            })}
          >
            <ChevronLeft /> Revenir
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={buttonVariants({
              variant: 'outline',
              className: 'min-w-[200] bg-black text-white',
            })}
          >
            Envoyer mon message <ChevronRight />
          </Button>
        </div>
      </form>
    </Form>
  )
}
