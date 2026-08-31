import React, { memo } from 'react';
import { Heart, Plus, Sliders } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductCard = memo(({ item }) => {
  const { setCustomizerItem, addToCart, favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.includes(item.id);

  const handleAction = () => {
    if (item.customizable) {
      setCustomizerItem(item);
    } else {
      addToCart(item, {
        size: { id: 'standard', name: 'Standard' },
        temp: item.defaultTemp || 'hot',
      });
    }
  };

  return (
    <div className="group rounded-xl border border-[#E8E4DC] dark:border-[#262420] bg-[#FBF9F5] dark:bg-[#161513] hover:border-[#1A1816] dark:hover:border-[#EAE6DF] p-4 flex flex-col justify-between text-left transition-all hover:shadow-md relative">
      <div>
        {/* Specimen Photo */}
        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#E8E4DC] dark:bg-[#1A1816] mb-3.5">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Popular or Specialty Badge */}
          {item.isPopular ? (
            <span className="absolute top-2.5 left-2.5 bg-[#C84B31] text-[#FBF9F5] text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
              Popular
            </span>
          ) : null}

          {/* Favorite Button (44x44px touch hitbox) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Save ${item.name} to favorites`}
            className="absolute top-2 right-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-[#FBF9F5]/90 dark:bg-[#161513]/90 text-[#666056] dark:text-[#A09A8E] hover:text-[#C84B31] dark:hover:text-[#C84B31] active:scale-90 shadow-sm transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#C84B31] text-[#C84B31]' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* Title & Price */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1816] dark:text-[#EAE6DF] group-hover:text-[#C84B31] transition-colors leading-snug">
            {item.name}
          </h3>
          <span className="font-semibold text-sm sm:text-base text-[#1A1816] dark:text-[#EAE6DF] shrink-0">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Origin / Subtitle */}
        {item.roastOrigin ? (
          <p className="text-[11px] sm:text-xs text-[#888276] dark:text-[#888276] mb-1.5 font-medium truncate">
            {item.roastOrigin}
          </p>
        ) : null}

        {/* Short Description */}
        <p className="text-xs text-[#555047] dark:text-[#A09A8E] line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Flavor Notes */}
        {item.tastingNotes && item.tastingNotes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {item.tastingNotes.map((note) => (
              <span
                key={note}
                className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-[#F3EFE6] dark:bg-[#1C1B18] text-[#666056] dark:text-[#A09A8E] border border-[#E8E4DC] dark:border-[#262420]"
              >
                {note}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 border-t border-[#E8E4DC] dark:border-[#262420]">
        <button
          onClick={handleAction}
          aria-label={item.customizable ? `Customize options and order ${item.name}` : `Add ${item.name} to order bag`}
          className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1B18] hover:bg-[#1A1816] dark:hover:bg-[#EAE6DF] hover:text-[#FBF9F5] dark:hover:text-[#11100F] text-[#1A1816] dark:text-[#EAE6DF] border border-[#E0DACB] dark:border-[#302D27] text-xs font-semibold tracking-wide active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {item.customizable ? (
            <>
              <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Customize</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
