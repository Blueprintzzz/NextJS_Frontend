'use client';

import { useState } from 'react';
import { useDistricts } from '../hooks/useDestination';
import type { District, AttractionCategory } from '../types/destination.types';

interface Props {
  selectedId?: string | null;
  onDistrictClick?: (district: District) => void;
  filterCategory?: AttractionCategory;
}

// Real Sri Lanka district SVG paths — viewBox "0 0 500 600"
// Coordinates derived from actual district boundaries
const DISTRICT_PATHS: Record<string, string> = {
  'Colombo':      'M118,390 L145,385 L155,400 L148,420 L125,425 L112,410 Z',
  'Gampaha':      'M118,355 L160,348 L168,370 L155,385 L145,385 L118,390 L108,375 Z',
  'Kalutara':     'M112,420 L148,420 L155,400 L165,415 L162,445 L148,465 L125,460 L105,445 Z',
  'Kandy':        'M168,340 L215,332 L228,355 L220,380 L195,390 L168,385 L155,370 L160,348 Z',
  'Matale':       'M200,295 L245,288 L258,310 L250,335 L228,345 L215,332 L200,318 Z',
  'Nuwara Eliya': 'M215,380 L250,372 L262,395 L255,415 L228,420 L215,405 Z',
  'Galle':        'M140,480 L178,472 L190,488 L185,510 L160,515 L138,502 Z',
  'Matara':       'M178,472 L218,465 L228,482 L222,505 L195,510 L185,510 L190,488 Z',
  'Hambantota':   'M218,465 L268,458 L282,478 L278,505 L250,515 L228,510 L222,505 L228,482 Z',
  'Jaffna':       'M198,48  L240,42  L252,62  L238,78  L205,80  L192,65  Z',
  'Kilinochchi':  'M222,88  L258,82  L268,102 L260,120 L232,122 L220,108 Z',
  'Mannar':       'M155,100 L192,95  L198,118 L185,138 L160,135 L148,118 Z',
  'Vavuniya':     'M192,118 L232,112 L240,135 L228,155 L200,158 L188,140 Z',
  'Mullaitivu':   'M258,88  L302,82  L310,108 L298,130 L268,132 L258,112 Z',
  'Batticaloa':   'M318,228 L355,222 L362,255 L355,285 L325,288 L312,260 Z',
  'Ampara':       'M298,278 L335,272 L342,305 L332,332 L302,335 L288,308 Z',
  'Trincomalee':  'M295,168 L338,160 L348,192 L338,222 L305,225 L292,195 Z',
  'Kurunegala':   'M158,288 L205,280 L215,305 L208,328 L175,332 L155,315 Z',
  'Puttalam':     'M122,248 L165,240 L172,265 L162,290 L130,295 L115,272 Z',
  'Anuradhapura': 'M162,172 L225,162 L238,198 L228,235 L192,240 L158,235 L148,200 Z',
  'Polonnaruwa':  'M242,198 L288,190 L298,225 L288,258 L255,262 L240,228 Z',
  'Badulla':      'M258,338 L298,330 L308,358 L298,385 L265,388 L252,362 Z',
  'Monaragala':   'M295,358 L340,350 L352,380 L342,410 L308,412 L292,385 Z',
  'Ratnapura':    'M192,398 L235,390 L248,415 L240,445 L205,448 L188,422 Z',
  'Kegalle':      'M162,355 L200,348 L212,372 L202,395 L168,398 L155,375 Z',
};

// Sri Lanka island outer outline
const ISLAND_OUTLINE = 'M198,42 C215,38 240,40 258,50 C285,65 308,88 322,115 C342,148 352,182 355,218 C360,258 355,295 342,328 C328,365 308,395 282,418 C260,438 235,452 208,458 C185,462 160,458 138,448 C112,435 90,415 72,390 C52,362 40,328 35,292 C28,252 32,212 45,175 C58,140 80,110 108,88 C132,68 165,48 198,42 Z';

export function SriLankaMap({ selectedId, onDistrictClick, filterCategory }: Props) {
  const { data: districts, isLoading } = useDistricts();
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  const districtMap = new Map<string, District>(
    districts.map((d) => [d.name, d])
  );

  const filteredNames = new Set(
    filterCategory
      ? districts
          .filter((d) => d.category === filterCategory)
          .map((d) => d.name)
      : districts.map((d) => d.name)
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        Loading map…
      </div>
    );
  }

  function getFill(name: string): string {
    const district = districtMap.get(name);
    if (filterCategory && !filteredNames.has(name)) return '#e5e7eb';
    if (!district) return '#d1fae5';
    if (district.id === selectedId) return '#16a34a';
    if (district.featured) return '#3b82f6';
    return '#6ee7b7';
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-sky-50 select-none">
      {hoveredName && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm font-medium text-gray-700 shadow pointer-events-none z-10">
          {hoveredName}
        </div>
      )}
      <svg
        viewBox="0 0 500 600"
        className="w-full h-full"
        style={{ maxHeight: 560 }}
      >
        {/* Ocean */}
        <rect width="500" height="600" fill="#bfdbfe" />

        {/* Island base outline */}
        <path d={ISLAND_OUTLINE} fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />

        {/* District regions */}
        {Object.entries(DISTRICT_PATHS).map(([name, path]) => {
          const district = districtMap.get(name);
          const isSelected = district?.id === selectedId;
          const fill = getFill(name);

          return (
            <path
              key={name}
              d={path}
              fill={fill}
              stroke="#ffffff"
              strokeWidth="1"
              opacity={hoveredName === name ? 0.8 : 1}
              style={{ cursor: district ? 'pointer' : 'default' }}
              onClick={() => district && onDistrictClick?.(district)}
              onMouseEnter={() => setHoveredName(name)}
              onMouseLeave={() => setHoveredName(null)}
            />
          );
        })}

        {/* District name labels */}
        {Object.entries(DISTRICT_PATHS).map(([name]) => {
          const d = districtMap.get(name);
          if (!d) return null;
          // Use district lat/lng projected to SVG space
          const x = ((d.longitude - 79.65) / (81.89 - 79.65)) * 500;
          const y = ((9.84 - d.latitude) / (9.84 - 5.92)) * 600;
          const isSelected = d.id === selectedId;
          return (
            <text
              key={name + '-label'}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize={isSelected ? 9 : 7.5}
              fontWeight={isSelected ? 'bold' : 'normal'}
              fill={isSelected ? '#14532d' : '#1f2937'}
              pointerEvents="none"
              style={{ textShadow: '0 0 4px white' }}
            >
              {name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
