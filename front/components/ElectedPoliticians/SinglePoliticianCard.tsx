import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ElectedPolitician } from '@/utils/types';
import { User } from 'lucide-react';

export default function ElectedPolician({ name, photoSrc, fonction, email }: ElectedPolitician) {
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
