import React, { memo } from 'react';
import { Heart, Plus, Sliders } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const ProductCard: React.FC<{ item: any }> = memo(({ item }) => {
  const { setCustomizerItem, addToCart, favorites, toggleFavorite } = useStore();
  const isFavorite = Array.isArray(favorites) ? favorites.includes(item.id) : false;

  const handleAction = () => {
    if (item.customizable) {
      setCustomizerItem(item);
    } else {
      addToCart(item, {
        size: { id: 'standard', name: 'Standard' },
        temp: item.defaultTemp || 'hot',
      });
      toast.success(`Added 1× ${item.name} to bag!`);
    }
  };

  return (
    <div className="group border border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-card hover:border-ink dark:hover:border-dark-text-main p-4 flex flex-col justify-between text-left transition-all relative">
      <div>
        {/* Specimen Photo */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-dim dark:bg-dark-subtle mb-3.5 border border-hairline dark:border-dark-hairline">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Popular Badge */}
          {item.isPopular ? (
            <Badge
              variant="editorial"
              className="absolute top-2.5 left-2.5 font-bold"
            >
              Popular
            </Badge>
          ) : null}

          {/* Favorite Button (44x44px touch hitbox) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Save ${item.name} to favorites`}
            className="absolute top-2 right-2 min-h-[40px] min-w-[40px] flex items-center justify-center bg-paper/90 dark:bg-dark-subtle/90 text-ink-muted dark:text-dark-text-muted hover:text-vermillion dark:hover:text-dark-vermillion active:scale-90 transition-all cursor-pointer border border-hairline/60 dark:border-dark-hairline/60"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-vermillion text-vermillion dark:fill-dark-vermillion dark:text-dark-vermillion' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* Title & Price */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-serif font-bold text-base sm:text-lg text-ink dark:text-dark-text-main group-hover:text-vermillion dark:group-hover:text-dark-vermillion transition-colors leading-snug">
            {item.name}
          </h3>
          <span className="font-mono font-semibold text-sm sm:text-base text-ink dark:text-dark-text-main shrink-0">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Origin / Subtitle */}
        {item.roastOrigin ? (
          <p className="text-[11px] sm:text-xs text-ink-muted dark:text-dark-text-muted mb-1.5 font-mono truncate">
            {item.roastOrigin}
          </p>
        ) : null}

        {/* Short Description */}
        <p className="text-xs text-ink-muted dark:text-dark-text-muted line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Flavor Notes */}
        {item.tastingNotes && item.tastingNotes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {item.tastingNotes.map((note: string) => (
              <Badge
                key={note}
                variant="secondary"
                className="text-[10px]"
              >
                {note}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 border-t border-hairline dark:border-dark-hairline">
        <Button
          onClick={handleAction}
          variant="outline"
          size="default"
          className="w-full justify-center"
          aria-label={item.customizable ? `Customize options and order ${item.name}` : `Add ${item.name} to order bag`}
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
        </Button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
