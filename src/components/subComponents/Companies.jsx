import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import companies from "../../data/companies.json";

const Companies = () => {
  return (
    <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full py-10">
      <CarouselContent className="flex gap-5 sm:gap-20 items-center">
        {companies.map(({ name, id, path }) => {
          return (
            <CarouselItem className="basis-1/3 lg:basis-1/6" key={id}>
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default Companies;
