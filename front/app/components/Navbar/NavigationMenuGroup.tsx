import React from 'react';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '#components/ui/navigation-menu';

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={`${className} block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`}
            {...props}
          >
            <div className='text-base font-bold leading-none text-primary'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';

type MenuProps = { title: string; href: string; description: string };

type NavigationMenuGroupProps = {
  title: string;
  menus: MenuProps[];
};

export function NavigationMenuGroup({ title, menus }: NavigationMenuGroupProps) {
  return (
    <NavigationMenuItem className='w-full'>
      <NavigationMenuTrigger className='flex w-full items-center gap-1 text-base font-medium text-primary hover:text-primary/80'>
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='w-[450px] gap-3 p-4'>
          {menus.map((menu) => (
            <ListItem key={menu.title} title={menu.title} href={menu.href}>
              {menu.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
