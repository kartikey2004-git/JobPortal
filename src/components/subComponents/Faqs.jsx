import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

import faqs from "../../data/faqs.json";

const Faqs = () => {
  return (
    <motion.section
      className="w-full py-16 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          FAQs
        </h2>
        <p className="text-muted-foreground text-lg">
          Frequently Asked Questions
        </p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="max-w-4xl mx-auto divide-y divide-border rounded-xl bg-card shadow-soft p-6"
      >
        {Array.isArray(faqs) &&
          faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <AccordionItem value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base sm:text-lg font-medium py-6 hover:text-primary transition-colors duration-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base sm:text-lg pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
      </Accordion>
    </motion.section>
  );
};

export default Faqs;
