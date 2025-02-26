import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function page() {
  return (
    <div className="mx-auto max-w-screen-lg w-full p-6">
      <h1 className="text-3xl font-bold">Foire Aux Questions - FAQ</h1>
      <Accordion type="single" collapsible className="my-12">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1 ?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Question 2 ?</AccordionTrigger>
          <AccordionContent>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium reiciendis excepturi unde incidunt, rem harum saepe dicta eius facere iusto inventore repudiandae deserunt ratione iure, labore deleniti. Dicta, aperiam. Non optio nihil odit repudiandae quis!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Question 3 ?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quisquam commodi iste ullam aperiam unde iure tempore quasi reiciendis? Sed illo voluptates at similique. Nemo, maxime qui?
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Question 4 ?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur cumque nisi maxime, numquam tempora est dolorum perspiciatis doloremque asperiores, at rem blanditiis placeat qui eos molestias. Eius harum officia soluta, nisi similique consequuntur minus et cum distinctio impedit vel aperiam quae laudantium odio blanditiis commodi. Placeat numquam cum, sunt, provident tempore harum distinctio quo eius at modi itaque voluptatum, possimus repudiandae quos fugiat dicta delectus!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Question 5 ?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur commodi illum libero totam maiores, dolorem exercitationem praesentium atque officiis. Dolores consequatur fugit, magnam similique cumque velit molestiae a excepturi expedita est.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>Question 6 ?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus iure porro corrupti!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>Question 7?</AccordionTrigger>
          <AccordionContent>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam nemo sint accusamus veritatis fuga eius debitis doloribus odio, nulla, ipsum omnis quam dolore totam natus voluptatibus at voluptatum! Eos, non. Omnis necessitatibus placeat, illum ipsam molestiae ut. Sunt doloribus labore enim porro voluptatum praesentium obcaecati in, possimus corporis sint iste. In, molestiae.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>Question 8 ?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde optio maxime blanditiis excepturi odio quidem. Cumque eius quisquam quasi officiis inventore obcaecati temporibus atque!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger>Question 9 ?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  )
}
