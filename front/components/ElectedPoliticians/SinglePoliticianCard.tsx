import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

type ElectedPoliticianProps = {
  name: string;
  photoSrc?: string;
  fonction: string;
  email: string;
};

export default function ElectedPolician({
  name,
  photoSrc,
  fonction,
  email,
}: ElectedPoliticianProps) {
  return (
    <Card className='text-center'>
      <CardHeader>
        <CardTitle className='capitalize'>
          {photoSrc ? (
            <img src={photoSrc} width='140' height='140' alt='' className='mx-auto' />
          ) : (
            <User size={140} className='mx-auto' />
          )}
          <h3 className='mt-4'>{name}</h3>
        </CardTitle>
        <CardDescription>{fonction}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{email}</p>
      </CardContent>
    </Card>
  );
}
