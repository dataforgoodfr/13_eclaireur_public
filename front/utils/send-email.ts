import { FormData } from '@/components/ContactForm'

export async function sendEmail(data: FormData) {
//   console.log(data)

  const apiEndpoint = `api/email`

  const sendMailRes = fetch(apiEndpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => {
        return res
    })
    .catch((err) => {
      alert(err)
    })
}