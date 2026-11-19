import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqs from "./data/faqs.json";

const Faqs = () => (
  <section className="py-12 sm:py-14 lg:py-16">
    <div className="section-shell">
      <div className="mb-4 sm:mb-8">
        <h2 className="font-sans heading-lg">FAQs</h2>
        <p className="mt-2 body-text">Frequently asked questions.</p>
      </div>

      <Accordion type="single" collapsible className="border-y border-border/50">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-sm sm:text-base">{faq.question}</AccordionTrigger>
            <AccordionContent className="body-text">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default Faqs;
