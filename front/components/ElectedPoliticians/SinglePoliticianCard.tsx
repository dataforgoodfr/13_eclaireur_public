import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from 'lucide-react';

type TElectedPolitician = {
  name: string;
  photosrc: string;
  fonction: string;
  email: string;
};

export default function ElectedPolician({ name, photosrc, fonction, email }: TElectedPolitician) {
  return (
    <Card className='text-center'>
      <CardHeader>
        <CardTitle className='capitalize'>
          {photosrc ? (
            <img src={photosrc} width='140' height='140' alt='' className='mx-auto' />
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
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
