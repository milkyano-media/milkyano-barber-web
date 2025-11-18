import type { GalleryItem } from "@/interfaces/GalleryInterface";

interface CarauselGalleryProps {
    items: GalleryItem[];
}

const CarauselGallery = ({ items }: CarauselGalleryProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 justify-center items-center gap-y-4 md:gap-10 max-w-screen-lg self-center mt-10">
            {items.map((item) => (
                <img
                    key={item.id}
                    src={item.imageBase64}
                    width={500}
                    height={500}
                    alt={item.title}
                    title={item.description}
                />
            ))}
        </div>
    );
};

export default CarauselGallery;
