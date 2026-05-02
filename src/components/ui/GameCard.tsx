export interface GameCardProps {
  title: string;
  price: string;
  image: string;
  subtitle?: string;
}

export default function GameCard({ title, price, image, subtitle = "Base Game" }: GameCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col">
      <div className="aspect-video rounded-md bg-epic-gray overflow-hidden relative mb-3">
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 z-10" />
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex flex-col">
        <span className="text-[#a1a1a1] text-[11px] font-medium tracking-wide mb-1.5">{subtitle}</span>
        <h3 className="font-semibold text-[14px] text-[#f5f5f5] line-clamp-2 leading-snug">{title}</h3>
        <p className="mt-2 text-[#f5f5f5] text-[14px]">Free</p>
      </div>
    </div>
  );
}
