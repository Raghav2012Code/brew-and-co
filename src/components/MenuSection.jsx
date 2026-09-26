import React, { useState, useMemo, useCallback } from 'react';
import { Search, X, Heart, Filter } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES, DIETARY_FILTERS } from '../data/menuData';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

export const MenuSection = () => {
  const { favorites } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const toggleFilter = useCallback((filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  }, []);

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const hasSearch = q.length > 0;
    const hasFilters = selectedFilters.length > 0;

    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Search keyword filter
      if (hasSearch) {
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchNotes = item.tastingNotes?.some((n) => n.toLowerCase().includes(q));
        const matchOrigin = item.roastOrigin?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchNotes && !matchOrigin) return false;
      }

      // Dietary flags
      if (hasFilters) {
        const matchesAll = selectedFilters.every((f) => item.tags?.includes(f));
        if (!matchesAll) return false;
      }

      // Saved favorites with Set lookup
      if (showOnlyFavorites && !favoritesSet.has(item.id)) {
        return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, selectedFilters, showOnlyFavorites, favoritesSet]);

  return (
    <section id="menu" className="border-b border-hairline dark:border-dark-hairline bg-paper dark:bg-dark-canvas py-12 sm:py-20 scroll-mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-hairline dark:border-dark-hairline pb-6 text-left">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-vermillion block mb-1">
              Cafe Menu
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink dark:text-dark-text-main tracking-tight">
              Drinks & Pastries
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" aria-hidden="true" />
            <input
              type="text"
              id="roster-search"
              aria-label="Search coffee menu by name, origin, or flavor notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, tea, or pastries..."
              className="w-full bg-surface dark:bg-dark-card border border-hairline-strong dark:border-dark-hairline-strong text-ink dark:text-dark-text-main placeholder:text-ink-faint text-sm rounded-lg pl-10 pr-9 py-2.5 focus:border-ink dark:focus:border-dark-text-main transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink dark:hover:text-dark-text-main"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs with Touch Momentum & Edge Indicators */}
        <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0">
          <div 
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth touch-pan-x" 
            role="tablist" 
            aria-label="Menu categories"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Category ${cat.name}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-[color,background-color,border-color,opacity,transform] cursor-pointer ${
                    isActive
                      ? 'bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas shadow-sm'
                      : 'bg-surface dark:bg-dark-card text-ink-muted dark:text-dark-text-muted hover:text-ink dark:hover:text-dark-text-main border border-hairline-strong dark:border-dark-hairline-strong'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Dietary Tags & Favorites Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-ink-faint hidden sm:flex items-center gap-1 font-medium">
              <Filter className="w-3 h-3" aria-hidden="true" />
              Filter:
            </span>
            {DIETARY_FILTERS.map((f) => {
              const isSelected = selectedFilters.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFilter(f.id)}
                  aria-pressed={isSelected}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium border active:scale-95 transition-[color,background-color,border-color,opacity,transform] ${
                    isSelected
                      ? 'border-ink dark:border-dark-text-main bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas'
                      : 'border-hairline-strong dark:border-dark-hairline-strong bg-paper dark:bg-dark-canvas text-ink-muted dark:text-dark-text-muted hover:border-ink'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {favorites.length > 0 && (
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              aria-pressed={showOnlyFavorites}
              className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border active:scale-95 transition-[color,background-color,border-color,opacity,transform] ${
                showOnlyFavorites
                  ? 'border-vermillion bg-vermillion text-paper'
                  : 'border-hairline-strong dark:border-dark-hairline-strong bg-paper dark:bg-dark-canvas text-ink-muted dark:text-dark-text-muted'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} aria-hidden="true" />
              <span>Favorites ({favorites.length})</span>
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-hairline dark:border-dark-hairline p-8 sm:p-12 text-center bg-surface dark:bg-dark-card space-y-3">
            <h3 className="font-serif text-xl font-bold text-ink dark:text-dark-text-main">No items match your search</h3>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-dark-text-muted max-w-sm mx-auto">
              Try searching with different terms or clear your dietary filters to view the full menu.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedFilters([]);
                setSearchQuery('');
                setShowOnlyFavorites(false);
              }}
              className="mt-2 min-h-[40px] px-4 py-2 rounded-lg bg-ink dark:bg-dark-text-main text-paper dark:text-dark-canvas text-xs font-semibold cursor-pointer active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
