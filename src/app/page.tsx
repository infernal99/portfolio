import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Path } from "@/components/sections/path";
import { Work } from "@/components/sections/work";
import { Stack } from "@/components/sections/stack";
import { Now } from "@/components/sections/now";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/json-ld";

export default function Page() {
  return (
    <>
      <JsonLd />
      <Hero />
      <Manifesto />
      <Path />
      <Work />
      <Stack />
      <Now />
      <Contact />
    </>
  );
}
