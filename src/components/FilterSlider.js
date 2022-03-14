import React from "react";
import Image from "react-bootstrap/Image";
import { Swiper, SwiperSlide } from "swiper/react";
import { IMAGE_FILTERS } from "../utils/utils";
import "swiper/swiper.min.css";

const FilterSlider = ({ image, image_filter, handleClick }) => {
  return (
    <>
      <p>Current filter: #{image_filter}</p>
      <p>Swipe to choose a filter.</p>
      <Swiper
        className="text-center"
        // slidesPerView={3}
        breakpoints={{
          200: { slidesPerView: 2.5 },
          480: { slidesPerView: 3.3 },
          768: { slidesPerView: 2.5 },
          1200: { slidesPerView: 3.5 },
        }}
        spaceBetween={10}
        freeMode={true}
        style={{ marginLeft: "-10px", marginRight: "-10px" }} // Inline styles needed for the library
      >
        {image &&
          IMAGE_FILTERS.map((imageFilter) => (
            <SwiperSlide key={imageFilter.value}>
              <div>
                <figure
                  onClick={() => handleClick(imageFilter.value)}
                  className={imageFilter.value}
                >
                  <Image className="w-100" src={image} />
                </figure>
                #{imageFilter.value}
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
};

export default FilterSlider;
