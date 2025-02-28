import image1 from "@/assets/our-works/1.png";
import image2 from "@/assets/our-works/2.png";
import image3 from "@/assets/our-works/3.png";
import image4 from "@/assets/our-works/4.png";
import image5 from "@/assets/our-works/5.png";
import image6 from "@/assets/our-works/6.png";
import image7 from "@/assets/our-works/7.png";
import image8 from "@/assets/our-works/8.png";
import image9 from "@/assets/our-works/9.png";
import image10 from "@/assets/our-works/10.png";
import image11 from "@/assets/our-works/11.png";
import image12 from "@/assets/our-works/12.png";

const CarauselGallery = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 justify-center items-center gap-y-4 md:gap-10 max-w-screen-lg self-center mt-10">
      <img src={image1} width={500} height={500} alt="" />
      <img src={image2} width={500} height={500} alt="" />
      <img src={image3} width={500} height={500} alt="" />
      <img src={image4} width={500} height={500} alt="" />
      <img src={image5} width={500} height={500} alt="" />
      <img src={image6} width={500} height={500} alt="" />
      <img src={image7} width={500} height={500} alt="" />
      <img src={image8} width={500} height={500} alt="" />
      <img src={image9} width={500} height={500} alt="" />
      <img src={image10} width={500} height={500} alt="" />
      <img src={image11} width={500} height={500} alt="" />
      <img src={image12} width={500} height={500} alt="" />
    </div>
  );
};

export default CarauselGallery;
