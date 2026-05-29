import React, { useState, useCallback, useRef, useEffect } from 'react'
import { tonightPicks } from './data/tonight.js'
import {
  domains, topics, figures, works, venues,
  getWorksByFigure, getWorksAtVenue, getSeeAlsoNearby,
  getVenueInterests, getRelatedVenues,
} from './data/content.js'

// ── Venue color palette (module-level so all components can use it) ───────
const venueColors = {
  moma:                { bg: '#1a56db', text: '#ffffff' },
  met:                 { bg: '#d97706', text: '#ffffff' },
  guggenheim:          { bg: '#db2777', text: '#ffffff' },
  whitney:             { bg: '#059669', text: '#ffffff' },
  brooklyn:            { bg: '#7c3aed', text: '#ffffff' },
  cooper_hewitt:       { bg: '#ea580c', text: '#ffffff' },
  village_vanguard:    { bg: '#0369a1', text: '#ffffff' },
  blue_note:           { bg: '#854d0e', text: '#ffffff' },
  birdland:            { bg: '#9d174d', text: '#ffffff' },
  jazz_lincoln_center: { bg: '#15803d', text: '#ffffff' },
  smalls:              { bg: '#b45309', text: '#ffffff' },
  carnegie_hall:       { bg: '#854d0e', text: '#ffffff' },
  david_geffen_hall:   { bg: '#0369a1', text: '#ffffff' },
  met_opera_house:     { bg: '#9d174d', text: '#ffffff' },
  alice_tully_hall:    { bg: '#15803d', text: '#ffffff' },
  miller_theatre:      { bg: '#7e22ce', text: '#ffffff' },
  bargemusic:          { bg: '#15803d', text: '#ffffff' },
  ninety_second_st_y:  { bg: '#d97706', text: '#ffffff' },
  merkin_hall:         { bg: '#7c3aed', text: '#ffffff' },
  yankee_stadium:      { bg: '#0c1a2e', text: '#ffffff' },
  msg:                 { bg: '#1a1a1a', text: '#f59e0b' },
  citi_field:          { bg: '#003087', text: '#ffffff' },
  arthur_ashe_stadium: { bg: '#003580', text: '#ffffff' },
  barclays_center:     { bg: '#2d2d2d', text: '#d4a843' },
  // Architecture venues
  chrysler_building:   { bg: '#0369a1', text: '#ffffff' },
  empire_state:        { bg: '#1d4ed8', text: '#ffffff' },
  rockefeller_center:  { bg: '#1e40af', text: '#ffffff' },
  woolworth_building:  { bg: '#166534', text: '#ffffff' },
  grand_central_terminal: { bg: '#92400e', text: '#ffffff' },
  nypl_schwarzman:     { bg: '#854d0e', text: '#ffffff' },
  flatiron_building:   { bg: '#15803d', text: '#ffffff' },
  st_patricks:         { bg: '#166534', text: '#ffffff' },
  trinity_church_nyc:  { bg: '#14532d', text: '#ffffff' },
  brooklyn_bridge_arch: { bg: '#78350f', text: '#ffffff' },
  seagram_building:    { bg: '#44403c', text: '#ffffff' },
  lever_house:         { bg: '#374151', text: '#ffffff' },
  un_headquarters:     { bg: '#1e3a5f', text: '#ffffff' },
  one_wtc:             { bg: '#1e40af', text: '#ffffff' },
  high_line:           { bg: '#15803d', text: '#ffffff' },
  // Theater venues
  shubert_theatre:         { bg: '#9d174d', text: '#ffffff' },
  st_james_theatre:        { bg: '#1e40af', text: '#ffffff' },
  majestic_theatre:        { bg: '#065f46', text: '#ffffff' },
  richard_rodgers_theatre: { bg: '#7c3aed', text: '#ffffff' },
  imperial_theatre:        { bg: '#b45309', text: '#ffffff' },
  public_theater:          { bg: '#dc2626', text: '#ffffff' },
  delacorte_theater:       { bg: '#0369a1', text: '#ffffff' },
  // History venues
  federal_hall:            { bg: '#a16207', text: '#ffffff' },
  fraunces_tavern:         { bg: '#92400e', text: '#ffffff' },
  african_burial_ground:   { bg: '#374151', text: '#ffffff' },
  ellis_island:            { bg: '#1e3a5f', text: '#ffffff' },
  tenement_museum:         { bg: '#7c2d12', text: '#ffffff' },
  stonewall_inn:           { bg: '#701a75', text: '#ffffff' },
  hamilton_grange:         { bg: '#166534', text: '#ffffff' },
  schomburg_center:        { bg: '#1d4ed8', text: '#ffffff' },
  // Hip-Hop
  one_five_two_zero:          { bg: '#7c2d12', text: '#ffffff' },
  universal_hip_hop_museum:   { bg: '#1c1917', text: '#fbbf24' },
  apollo_theater_hh:          { bg: '#1a1a2e', text: '#ffffff' },
  rucker_park:                { bg: '#14532d', text: '#ffffff' },
  marcy_houses:               { bg: '#1e3a5f', text: '#ffffff' },
  biggie_mural:               { bg: '#3b0764', text: '#ffffff' },
  hollis_queens:              { bg: '#92400e', text: '#ffffff' },
  queensbridge_houses:        { bg: '#1e293b', text: '#ffffff' },
  park_hill_staten_island:    { bg: '#450a0a', text: '#ffffff' },
}
// ── Venue coordinates for map (lat, lng, domain) ─────────────────────────
const venueCoords = {
  // Visual Art
  moma:                { lat: 40.7614, lng: -73.9776, domain: 'visual_art',      address: '11 W 53rd St, Midtown' },
  met:                 { lat: 40.7794, lng: -73.9632, domain: 'visual_art',      address: '1000 Fifth Ave, Upper East Side' },
  guggenheim:          { lat: 40.7830, lng: -73.9590, domain: 'visual_art',      address: '1071 Fifth Ave, Upper East Side' },
  whitney:             { lat: 40.7397, lng: -74.0089, domain: 'visual_art',      address: '99 Gansevoort St, Meatpacking District' },
  brooklyn:            { lat: 40.6712, lng: -73.9636, domain: 'visual_art',      address: '200 Eastern Pkwy, Crown Heights' },
  cooper_hewitt:       { lat: 40.7852, lng: -73.9573, domain: 'visual_art',      address: '2 E 91st St, Carnegie Hill' },
  // Jazz
  village_vanguard:    { lat: 40.7354, lng: -74.0002, domain: 'jazz',            address: '178 Seventh Ave S, West Village' },
  blue_note:           { lat: 40.7306, lng: -74.0003, domain: 'jazz',            address: '131 W 3rd St, Greenwich Village' },
  birdland:            { lat: 40.7589, lng: -73.9869, domain: 'jazz',            address: '315 W 44th St, Midtown' },
  jazz_lincoln_center: { lat: 40.7695, lng: -73.9826, domain: 'jazz',            address: 'Broadway at 60th St, Columbus Circle' },
  smalls:              { lat: 40.7330, lng: -74.0007, domain: 'jazz',            address: '183 W 10th St, West Village' },
  // Classical
  carnegie_hall:       { lat: 40.7651, lng: -73.9799, domain: 'classical_music', address: '881 Seventh Ave, Midtown' },
  david_geffen_hall:   { lat: 40.7725, lng: -73.9836, domain: 'classical_music', address: '10 Lincoln Center Plaza, Upper West Side' },
  met_opera_house:     { lat: 40.7730, lng: -73.9840, domain: 'classical_music', address: '30 Lincoln Center Plaza, Upper West Side' },
  alice_tully_hall:    { lat: 40.7723, lng: -73.9841, domain: 'classical_music', address: '1941 Broadway, Upper West Side' },
  miller_theatre:      { lat: 40.8075, lng: -73.9610, domain: 'classical_music', address: '2960 Broadway, Morningside Heights' },
  bargemusic:          { lat: 40.7023, lng: -73.9920, domain: 'classical_music', address: 'Fulton Ferry Landing, DUMBO' },
  ninety_second_st_y:  { lat: 40.7806, lng: -73.9544, domain: 'classical_music', address: '1395 Lexington Ave, Upper East Side' },
  merkin_hall:         { lat: 40.7737, lng: -73.9830, domain: 'classical_music', address: '129 W 67th St, Upper West Side' },
  // Sports
  yankee_stadium:      { lat: 40.8296, lng: -73.9262, domain: 'sports',          address: '1 E 161st St, The Bronx' },
  msg:                 { lat: 40.7505, lng: -73.9934, domain: 'sports',          address: '4 Pennsylvania Plaza, Midtown' },
  citi_field:          { lat: 40.7571, lng: -73.8458, domain: 'sports',          address: '41 Seaver Way, Flushing, Queens' },
  arthur_ashe_stadium: { lat: 40.7502, lng: -73.8472, domain: 'sports',          address: '124-02 Roosevelt Ave, Flushing' },
  barclays_center:     { lat: 40.6826, lng: -73.9754, domain: 'sports',          address: '620 Atlantic Ave, Prospect Heights' },
  // Architecture
  chrysler_building:   { lat: 40.7516, lng: -73.9755, domain: 'architecture',    address: '405 Lexington Ave, Midtown East' },
  empire_state:        { lat: 40.7484, lng: -73.9856, domain: 'architecture',    address: '20 W 34th St, Midtown' },
  rockefeller_center:  { lat: 40.7587, lng: -73.9787, domain: 'architecture',    address: '45 Rockefeller Plaza, Midtown' },
  woolworth_building:  { lat: 40.7128, lng: -74.0081, domain: 'architecture',    address: '233 Broadway, Lower Manhattan' },
  grand_central_terminal: { lat: 40.7527, lng: -73.9772, domain: 'architecture', address: '89 E 42nd St, Midtown' },
  nypl_schwarzman:     { lat: 40.7532, lng: -73.9822, domain: 'architecture',    address: '476 Fifth Ave, Midtown' },
  flatiron_building:   { lat: 40.7411, lng: -73.9897, domain: 'architecture',    address: '175 Fifth Ave, Flatiron District' },
  st_patricks:         { lat: 40.7584, lng: -73.9762, domain: 'architecture',    address: '5th Ave at 50th St, Midtown' },
  trinity_church_nyc:  { lat: 40.7081, lng: -74.0132, domain: 'architecture',    address: '75 Broadway, Financial District' },
  brooklyn_bridge_arch:{ lat: 40.7061, lng: -73.9969, domain: 'architecture',    address: 'Brooklyn Bridge, Lower Manhattan' },
  seagram_building:    { lat: 40.7582, lng: -73.9718, domain: 'architecture',    address: '375 Park Ave, Midtown East' },
  lever_house:         { lat: 40.7578, lng: -73.9721, domain: 'architecture',    address: '390 Park Ave, Midtown East' },
  un_headquarters:     { lat: 40.7489, lng: -73.9680, domain: 'architecture',    address: '405 E 42nd St, Turtle Bay' },
  one_wtc:             { lat: 40.7127, lng: -74.0134, domain: 'architecture',    address: '285 Fulton St, Lower Manhattan' },
  high_line:           { lat: 40.7479, lng: -74.0048, domain: 'architecture',    address: 'Gansevoort St to 34th St, West Side' },
  // Theater
  shubert_theatre:         { lat: 40.7579, lng: -73.9870, domain: 'theater',     address: '225 W 44th St, Theater District' },
  st_james_theatre:        { lat: 40.7590, lng: -73.9866, domain: 'theater',     address: '246 W 44th St, Theater District' },
  majestic_theatre:        { lat: 40.7583, lng: -73.9870, domain: 'theater',     address: '247 W 44th St, Theater District' },
  richard_rodgers_theatre: { lat: 40.7591, lng: -73.9862, domain: 'theater',     address: '226 W 46th St, Theater District' },
  imperial_theatre:        { lat: 40.7585, lng: -73.9877, domain: 'theater',     address: '249 W 45th St, Theater District' },
  public_theater:          { lat: 40.7288, lng: -73.9914, domain: 'theater',     address: '425 Lafayette St, NoHo' },
  delacorte_theater:       { lat: 40.7796, lng: -73.9686, domain: 'theater',     address: 'Central Park, 81st St, Upper West Side' },
  // History
  federal_hall:            { lat: 40.7077, lng: -74.0102, domain: 'history',     address: '26 Wall St, Financial District' },
  fraunces_tavern:         { lat: 40.7036, lng: -74.0110, domain: 'history',     address: '54 Pearl St, Financial District' },
  african_burial_ground:   { lat: 40.7144, lng: -74.0051, domain: 'history',     address: '290 Broadway, Lower Manhattan' },
  ellis_island:            { lat: 40.6996, lng: -74.0397, domain: 'history',     address: 'Ellis Island, New York Harbor' },
  tenement_museum:         { lat: 40.7179, lng: -73.9901, domain: 'history',     address: '103 Orchard St, Lower East Side' },
  stonewall_inn:           { lat: 40.7335, lng: -74.0025, domain: 'history',     address: '53 Christopher St, West Village' },
  hamilton_grange:         { lat: 40.8193, lng: -73.9492, domain: 'history',     address: '414 W 141st St, Harlem' },
  schomburg_center:        { lat: 40.8154, lng: -73.9412, domain: 'history',     address: '515 Malcolm X Blvd, Harlem' },
  // Hip-Hop
  one_five_two_zero:          { lat: 40.8508, lng: -73.9221, domain: 'hip_hop', address: '1520 Sedgwick Ave, Morris Heights, The Bronx' },
  universal_hip_hop_museum:   { lat: 40.8289, lng: -73.9282, domain: 'hip_hop', address: '610 Exterior St, Melrose, The Bronx' },
  apollo_theater_hh:          { lat: 40.8097, lng: -73.9501, domain: 'hip_hop', address: '253 W 125th St, Harlem' },
  rucker_park:                { lat: 40.8283, lng: -73.9350, domain: 'hip_hop', address: '155th St & Frederick Douglass Blvd, Harlem' },
  marcy_houses:               { lat: 40.6976, lng: -73.9540, domain: 'hip_hop', address: 'Marcy Ave & Myrtle Ave, Bed-Stuy, Brooklyn' },
  biggie_mural:               { lat: 40.6841, lng: -73.9665, domain: 'hip_hop', address: '226 St. James Place, Clinton Hill, Brooklyn' },
  hollis_queens:              { lat: 40.7069, lng: -73.7609, domain: 'hip_hop', address: '205th St & Hollis Ave, Hollis, Queens' },
  queensbridge_houses:        { lat: 40.7511, lng: -73.9407, domain: 'hip_hop', address: '10-05 41st Ave, Long Island City, Queens' },
  park_hill_staten_island:    { lat: 40.6207, lng: -74.0761, domain: 'hip_hop', address: 'Park Hill Ave, Clifton, Staten Island' },
  // New landmark venues
  central_park:               { lat: 40.7851, lng: -73.9683, domain: 'architecture', address: 'Central Park, New York, NY' },
  intrepid_museum:            { lat: 40.7645, lng: -74.0018, domain: 'history', address: 'Pier 86, 12th Ave at 46th St, New York, NY' },
  staten_island_ferry_terminal: { lat: 40.7006, lng: -74.0134, domain: 'history', address: '4 Whitehall St, New York, NY' },
}

// ── User-place categories — for user-added venues (kept separate from editorial domains) ──
const USER_PLACE_CATEGORIES = [
  { id: 'food',      label: 'Food',           emoji: '🍴' },
  { id: 'drinks',    label: 'Drinks',         emoji: '🍷' },
  { id: 'music',     label: 'Music',          emoji: '🎵' },
  { id: 'art',       label: 'Art / Museum',   emoji: '🎨' },
  { id: 'outdoors',  label: 'Outdoors',       emoji: '🌳' },
  { id: 'shopping',  label: 'Shopping',       emoji: '🛍️' },
  { id: 'activity',  label: 'Activity',       emoji: '🎢' },
  { id: 'other',     label: 'Other',          emoji: '✨' },
]

// ── Neighborhood groups (module-level so HomeScreen + NeighborhoodScreen share) ──
const NEIGHBORHOOD_GROUPS = [
  { key: 'midtown',         label: 'Midtown',           emoji: '🏙️', match: n => /midtown|columbus circle|times square/i.test(n) },
  { key: 'upper_east',      label: 'Upper East Side',   emoji: '🎨', match: n => /upper east/i.test(n) },
  { key: 'upper_west',      label: 'Upper West Side',   emoji: '🎼', match: n => /upper west|lincoln center|morningside/i.test(n) },
  { key: 'greenwich',       label: 'Greenwich Village', emoji: '🎷', match: n => /greenwich|west village|noho|east village|chelsea|meatpacking/i.test(n) },
  { key: 'lower_manhattan', label: 'Lower Manhattan',   emoji: '🗽', match: n => /financial district|lower manhattan|civic center|downtown|lower east/i.test(n) },
  { key: 'harlem',          label: 'Harlem',            emoji: '🎶', match: n => /harlem/i.test(n) },
  { key: 'brooklyn',        label: 'Brooklyn',          emoji: '🌉', match: n => /brooklyn|dumbo|greenpoint|williamsburg|bushwick|fort greene|clinton hill|prospect heights|park slope|crown heights/i.test(n) },
  { key: 'bronx',           label: 'The Bronx',         emoji: '⚾', match: n => /bronx/i.test(n) },
  { key: 'queens',          label: 'Queens',            emoji: '🎺', match: n => /queens/i.test(n) },
  { key: 'central_park',    label: 'Central Park',      emoji: '🌳', match: n => /central park/i.test(n) },
]

function getNeighborhoodVenues(key, venuesObj) {
  const grp = NEIGHBORHOOD_GROUPS.find(g => g.key === key)
  if (!grp) return []
  return Object.values(venuesObj).filter(v => v.neighborhood && grp.match(v.neighborhood))
}

// ── Sub-neighborhoods — granular areas within a top-level neighborhood. ──
// Keeps the main 10-chip grid clean while still letting users target specific places like Williamsburg or DUMBO
// when adding a custom venue or browsing the Brooklyn detail screen. Structure is extensible to other boroughs.
const NEIGHBORHOOD_SUBAREAS = {
  brooklyn: [
    {
      key: 'northern_brooklyn',
      label: 'Northern Brooklyn',
      areas: [
        {
          name: 'Greenpoint',
          desc: "Brooklyn's northernmost tip — Polish heritage, waterfront parks, indie dining",
          sights: [
            { icon: '🌳', name: 'McCarren Park',              desc: "Northern Brooklyn's main park — track, pool, and the Saturday farmers market." },
            { icon: '🌊', name: 'Transmitter Park',           desc: 'Small waterfront park with a knockout Manhattan skyline view.' },
            { icon: '🍞', name: 'Manhattan Avenue',           desc: 'Polish bakeries, butchers, and old-world delis lining the main commercial spine.' },
            { icon: '🎵', name: 'Warsaw',                     desc: 'Iconic concert venue inside the Polish National Home — pierogies between sets.' },
            { icon: '☕', name: 'Variety Coffee',             desc: 'Anchor coffee spot for the neighborhood; long bench seating, fast wifi.' },
          ],
        },
        {
          name: 'Williamsburg',
          desc: 'Trendy, creative, luxury waterfront condos, nightlife hub',
          sights: [
            { icon: '🌊', name: 'Domino Park',                desc: 'Waterfront promenade built around the old Domino Sugar Refinery — taco stand, dog run, knockout views.' },
            { icon: '🍴', name: 'Smorgasburg',                desc: '80+ food vendors at the East River State Park, Saturdays April through October.' },
            { icon: '🍺', name: 'Brooklyn Brewery',           desc: 'Tours and tastings at the original Williamsburg craft brewery on N 11th St.' },
            { icon: '🎵', name: 'Music Hall of Williamsburg', desc: 'Intimate venue for indie acts on the Bowery Presents circuit.' },
            { icon: '🛍️', name: 'Bedford Avenue',             desc: 'The main drag — vintage shops, cafes, boutiques, and weekend crowds.' },
            { icon: '🌳', name: 'McCarren Park',              desc: 'Shared with Greenpoint — pickup soccer, Sunday hangs, and the public pool in summer.' },
          ],
        },
        {
          name: 'East Williamsburg',
          desc: 'More industrial, emerging arts scene',
          sights: [
            { icon: '🌙', name: 'House of Yes',               desc: 'Cabaret, circus, and dance party fused into one converted warehouse.' },
            { icon: '🍕', name: "Roberta's",                  desc: 'Wood-fired pizza institution — the back patio is the move on a warm night.' },
            { icon: '🌳', name: 'Bushwick Inlet Park',        desc: 'Newer waterfront park bordering Greenpoint — green roof, soccer fields.' },
            { icon: '🎨', name: 'Cotton Candy Machine',       desc: 'Tiny gallery + shop focused on pop-culture art and prints.' },
          ],
        },
        {
          name: 'Bushwick',
          desc: 'Street art capital, warehouse venues, rapidly gentrifying',
          sights: [
            { icon: '🎨', name: 'The Bushwick Collective',    desc: "Open-air street art gallery sprawling across Troutman Street — NYC's largest." },
            { icon: '🌙', name: 'Mood Ring',                  desc: 'Astrology-themed bar — themed cocktails by zodiac sign.' },
            { icon: '🍕', name: "Roberta's",                  desc: 'The pizza place that put the neighborhood on the map (technically borders East Williamsburg).' },
            { icon: '🌳', name: 'Maria Hernandez Park',       desc: "Bushwick's main public space — basketball courts, playground, weekend dancers." },
          ],
        },
      ],
    },
    {
      key: 'northwestern_brooklyn',
      label: 'Northwestern Brooklyn',
      areas: [
        {
          name: 'Downtown Brooklyn',
          desc: "NYC's 3rd largest business district — high-rises, major transit hub",
          sights: [
            { icon: '🏛️', name: 'Brooklyn Borough Hall',      desc: "Historic Greek Revival building — Brooklyn's old city hall before the merger." },
            { icon: '🍰', name: "Junior's",                   desc: 'Cheesecake institution since 1950, original location at Flatbush Ave + DeKalb.' },
            { icon: '📚', name: 'Center for Brooklyn History', desc: "Smaller-scale museum and archive about Brooklyn's past." },
          ],
        },
        {
          name: 'DUMBO',
          desc: 'Cobblestone streets, tech startups, iconic Manhattan views',
          sights: [
            { icon: '🌉', name: 'Manhattan Bridge view',      desc: 'The famous Washington Street view — most photographed Brooklyn shot in the world.' },
            { icon: '🌳', name: 'Brooklyn Bridge Park',       desc: 'Six piers of green space along the waterfront — playgrounds, pop-up shops, kayaks.' },
            { icon: '🎠', name: "Jane's Carousel",            desc: 'Restored 1922 carousel inside a Jean Nouvel glass pavilion.' },
            { icon: '🛍️', name: 'Empire Stores',              desc: 'Restored 19th-century coffee warehouses, now full of shops and restaurants.' },
            { icon: '🍴', name: 'Time Out Market',            desc: "Curated food hall featuring some of Brooklyn's best chefs." },
            { icon: '☕', name: 'Brooklyn Roasting Company',   desc: 'Their original roastery, right on Pearl Street.' },
          ],
        },
        {
          name: 'Brooklyn Heights',
          desc: 'Oldest historic district — brownstones, the Promenade waterfront',
          sights: [
            { icon: '🌉', name: 'Brooklyn Heights Promenade', desc: 'Iconic Lower Manhattan view spanning six blocks atop the BQE.' },
            { icon: '⛪', name: 'Plymouth Church',             desc: '19th-century Underground Railroad stop — Henry Ward Beecher preached here.' },
            { icon: '🏘️', name: 'Willow + Pierrepont Street',  desc: 'Loveliest brownstone-lined blocks in NYC — Cranberry, Willow, Hicks.' },
            { icon: '🏛️', name: 'Brooklyn Historical Society', desc: 'Now the Brooklyn campus of the New-York Historical Society.' },
          ],
        },
        {
          name: 'Fort Greene',
          desc: 'Cultural hub — BAM (Brooklyn Academy of Music), brownstones',
          sights: [
            { icon: '🎭', name: 'BAM (Brooklyn Academy of Music)', desc: 'Major performing arts center — theater, opera, dance, film. Anchor of cultural Brooklyn.' },
            { icon: '🌳', name: 'Fort Greene Park',           desc: 'Olmsted-designed park, topped by the Prison Ship Martyrs Monument.' },
            { icon: '📚', name: 'Greenlight Bookstore',       desc: 'Beloved indie bookshop on Fulton Street — frequent author events.' },
            { icon: '🍴', name: 'Fulton Street',              desc: 'Restaurant row from Lafayette to Vanderbilt — Caribbean, soul food, wine bars.' },
          ],
        },
        {
          name: 'Clinton Hill',
          desc: 'Tree-lined streets, Pratt Institute, artsy and residential',
          sights: [
            { icon: '🏛️', name: 'Pratt Institute campus',     desc: 'Art college with a public outdoor sculpture park — free to wander.' },
            { icon: '🏘️', name: 'Washington Avenue brownstones', desc: "Some of Brooklyn's prettiest blocks — leafy, brownstone-lined, peaceful." },
            { icon: '🌳', name: 'Underwood Park',             desc: 'Small but lovely park surrounded by historic homes.' },
          ],
        },
        {
          name: 'Prospect Heights',
          desc: 'Trendy — near Barclays Center and Prospect Park',
          sights: [
            { icon: '🏟️', name: 'Barclays Center',            desc: "Brooklyn's pro sports arena — Nets, Liberty, plus major concerts." },
            { icon: '🏛️', name: 'Brooklyn Museum',            desc: 'World-class art museum — Egyptian wing, American Art, free first Saturdays.' },
            { icon: '🌻', name: 'Brooklyn Botanic Garden',    desc: 'Cherry blossoms in spring, Japanese garden, rose garden — adjacent to the museum.' },
            { icon: '🌳', name: 'Grand Army Plaza',           desc: "Massive roundabout topped by the Soldiers' and Sailors' Arch — Prospect Park's gateway." },
            { icon: '🍴', name: 'Vanderbilt Avenue',          desc: 'Restaurant and bar row of the neighborhood.' },
          ],
        },
      ],
    },
    {
      key: 'central_brooklyn',
      label: 'Central Brooklyn',
      areas: [
        {
          name: 'Park Slope',
          desc: 'Iconic brownstones — Prospect Park, top-rated schools, family-friendly',
          sights: [
            { icon: '🌳', name: 'Prospect Park',              desc: "Olmsted's other masterpiece — 585 acres of woods, meadows, and a lake." },
            { icon: '🛍️', name: 'Seventh Avenue',             desc: "Park Slope's old commercial spine — cafes, bookstores, boutiques." },
            { icon: '🍴', name: 'Fifth Avenue',               desc: 'The newer hot strip for restaurants and bars — al fresco in summer.' },
            { icon: '🌳', name: 'Grand Army Plaza',           desc: "Park Slope's elegant entry point at the north tip of Prospect Park." },
            { icon: '🪦', name: 'Green-Wood Cemetery',        desc: 'Just south — 478 acres of historic burial ground, hilltop city views.' },
          ],
        },
        {
          name: 'Crown Heights',
          desc: 'Caribbean culture, diverse — near Brooklyn Museum',
          sights: [
            { icon: '🏛️', name: 'Brooklyn Museum',            desc: 'Shared with Prospect Heights — central to the neighborhood and free first Saturdays.' },
            { icon: '🌻', name: 'Brooklyn Botanic Garden',    desc: 'Also borders Crown Heights — cherry blossom festival in spring is a must.' },
            { icon: '🛣️', name: 'Eastern Parkway',            desc: "Olmsted's grand boulevard — the route of the West Indian Day Parade every Labor Day." },
            { icon: '🍛', name: 'Nostrand Avenue',            desc: 'Roti shops, jerk spots, and Caribbean bakeries — the cultural heart.' },
            { icon: '🏘️', name: 'Sterling + St. Johns Place', desc: "Stately rowhouses on some of Brooklyn's best-preserved blocks." },
          ],
        },
      ],
    },
  ],
}

// Flat list of every sub-neighborhood name + its parent borough — used by the Add Place dropdown
// and by area-cluster lookups so trip-planning groups them under the right day.
const ALL_SUB_NEIGHBORHOODS = Object.entries(NEIGHBORHOOD_SUBAREAS).flatMap(([parentKey, groups]) =>
  groups.flatMap(g => g.areas.map(a => ({ ...a, parentKey, subAreaLabel: g.label })))
)

// ── Sight category colors — drives the header background + tag chip color so each sight feels
// venue-like and visually distinct by category. Keyed by icon glyph (matches the sight's icon field). ──
const SIGHT_CATEGORY_COLOR = {
  '🌳': { bg: '#15803d', text: '#fff' }, // park / nature - green
  '🌻': { bg: '#15803d', text: '#fff' }, // garden - green
  '🌊': { bg: '#0e7490', text: '#fff' }, // waterfront - teal
  '🌉': { bg: '#0e7490', text: '#fff' }, // view / bridge - teal
  '🏛️': { bg: '#1e40af', text: '#fff' }, // museum - blue
  '📚': { bg: '#1e40af', text: '#fff' }, // books / library - blue
  '🏟️': { bg: '#b91c1c', text: '#fff' }, // arena - red
  '🎭': { bg: '#7e22ce', text: '#fff' }, // theater - purple
  '🎵': { bg: '#7c3aed', text: '#fff' }, // music venue - violet
  '🎨': { bg: '#6d28d9', text: '#fff' }, // art / gallery - violet
  '🌙': { bg: '#5b21b6', text: '#fff' }, // nightlife - deep violet
  '🍴': { bg: '#c2410c', text: '#fff' }, // food - orange
  '🍕': { bg: '#dc2626', text: '#fff' }, // pizza - red
  '🍛': { bg: '#c2410c', text: '#fff' }, // caribbean - orange
  '🍰': { bg: '#be185d', text: '#fff' }, // dessert - pink
  '🍞': { bg: '#92400e', text: '#fff' }, // bakery - brown
  '🍺': { bg: '#b45309', text: '#fff' }, // brewery - amber
  '☕': { bg: '#7c2d12', text: '#fff' }, // coffee - dark brown
  '🛍️': { bg: '#be185d', text: '#fff' }, // shopping - pink
  '🎠': { bg: '#be185d', text: '#fff' }, // carousel / family - pink
  '⛪': { bg: '#92400e', text: '#fff' }, // church - brown
  '🏘️': { bg: '#78350f', text: '#fff' }, // brownstones - dark brown
  '🪦': { bg: '#475569', text: '#fff' }, // cemetery - slate
  '🛣️': { bg: '#475569', text: '#fff' }, // avenue - slate
}
const DEFAULT_SIGHT_COLOR = { bg: 'var(--gray-900)', text: '#fff' }

// ── Sight enrichment — extra editorial detail for prominent sub-neighborhood picks. ──
// Keyed by sightId. Anything missing here just doesn't render (the SightScreen adapts gracefully).
// Add more entries as we research them; new sights work fine without an enrichment entry.
const SIGHT_ENRICHMENT = {
  'sight_brooklyn_bridge_park': {
    lat: 40.7019, lng: -73.9967,
    longDesc: "An 85-acre waterfront park that runs from DUMBO south to Atlantic Avenue, built over six former shipping piers. Each pier has its own character — Pier 1's lawns face the Manhattan skyline, Pier 2 is built for active sports (basketball, handball, in-line skating), Pier 5 has soccer fields and the Picnic Peninsula, Pier 6 is family-focused with playgrounds and the Brooklyn Heights ferry dock. Jane's Carousel and Empire Stores sit at the north end; the Brooklyn Bridge soars overhead. The smartest move in the park is the unbroken Manhattan skyline view — particularly at sunset.",
    admission: 'Free · open daily 6am – 1am',
    timeNeeded: '1–2 hours',
    booking: 'No tickets needed · arrive any time',
    insiderTip: 'Sunset is best from Pier 5; the lawn at Pier 6 is dog-friendly. The carousel runs Thursday–Sunday in summer ($2 a ride).',
    officialUrl: 'https://www.brooklynbridgepark.org',
    tags: ['Park', 'Waterfront', 'Free', 'Outdoor'],
  },
  'sight_manhattan_bridge_view': {
    lat: 40.7029, lng: -73.9895,
    longDesc: "The most photographed view in Brooklyn — looking up Washington Street with the Manhattan Bridge framed perfectly overhead and the Empire State Building peeking through the arch. It became famous via Sergio Leone's Once Upon a Time in America and has appeared in countless films, ads, and Instagram posts since. The block itself is short and easy to miss — get the angle right and it's iconic in a single frame.",
    admission: 'Free',
    timeNeeded: '15 min',
    booking: 'No tickets · just show up',
    insiderTip: 'The photo spot is on Washington Street between Front and Water Streets. Early morning has the cleanest light and the fewest crowds.',
    tags: ['Photo spot', 'Free', 'Landmark'],
  },
  'sight_jane_s_carousel': {
    lat: 40.7036, lng: -73.9929,
    longDesc: "A meticulously restored 1922 Philadelphia Toboggan Company carousel, brought to Brooklyn Bridge Park and now spinning inside a Jean Nouvel-designed glass pavilion right on the East River. The 48 horses and two chariots were each hand-restored over 25 years; the pavilion's transparency makes the carousel feel like it's hovering between the Brooklyn Bridge and the Manhattan skyline. Magical for kids, surprisingly affecting for adults.",
    admission: '$2 per ride · free to enter the pavilion',
    timeNeeded: '30 min',
    booking: 'Walk-up only · no advance tickets',
    insiderTip: 'You don\'t have to ride to enjoy the pavilion. The views and the carousel woodwork are reason enough to stop in.',
    officialUrl: 'https://www.janescarousel.com',
    tags: ['Family', 'Landmark', 'Indoor'],
  },
  'sight_brooklyn_museum': {
    lat: 40.6712, lng: -73.9636,
    longDesc: "The second-largest art museum in NYC and one of the oldest in the country, with a collection that runs from ancient Egypt to contemporary photography. Strengths include world-class Egyptian antiquities (rivaled in the US only by the Met), the Sackler Center for Feminist Art (home to Judy Chicago's Dinner Party), and an under-appreciated American Art collection. The Beaux-Arts building on Eastern Parkway is itself worth the visit; the recent Pavilion glass entrance lets you see straight through to the original 1897 facade.",
    admission: '$25 suggested · First Saturdays free 5–11pm',
    timeNeeded: '2–4 hours',
    booking: 'Walk-up or pre-book at brooklynmuseum.org',
    insiderTip: 'Skip the queue by entering on Eastern Parkway. The Sackler Center for Feminist Art on the 4th floor is unmissable; First Saturdays bring DJs, performances, and the whole museum is free 5–11pm.',
    officialUrl: 'https://www.brooklynmuseum.org',
    tags: ['Museum', 'Indoor', 'Family'],
  },
  'sight_brooklyn_botanic_garden': {
    lat: 40.6694, lng: -73.9624,
    longDesc: "52 acres of curated landscapes right next to the Brooklyn Museum — the Cherry Esplanade is the centerpiece in spring, the Cranford Rose Garden in summer, the Native Flora Garden any time. The Steinhardt Conservatory's three glass houses feel like leaving the city entirely: tropical, desert, and bonsai. Smaller and more intimate than the New York Botanical Garden in the Bronx, but more accessible from most of Brooklyn.",
    admission: '$22 · Free Friday mornings + winter weekdays',
    timeNeeded: '1.5–3 hours',
    booking: 'Pre-book at bbg.org for popular weekends',
    insiderTip: 'Cherry blossom season (Sakura Matsuri, late April) is glorious but crowded — go on a weekday morning. The Cranford Rose Garden peaks in early June.',
    officialUrl: 'https://www.bbg.org',
    tags: ['Garden', 'Outdoor', 'Seasonal'],
  },
  'sight_prospect_park': {
    lat: 40.6602, lng: -73.9690,
    longDesc: "Frederick Law Olmsted and Calvert Vaux designed Prospect Park after they built Central Park — and they generally considered Prospect Park the better one. 585 acres of carefully composed landscapes: the Long Meadow (one of the longest unbroken meadows in any urban park anywhere), the Ravine (Brooklyn's only forest), the Lake (boating in summer, ice skating in winter at LeFrak Center). The park hosts the Prospect Park Bandshell summer concert series, free movies at night, and the city's largest Sunday drum circle at Drummer's Grove.",
    admission: 'Free · open 5am – 1am daily',
    timeNeeded: '1–3 hours',
    booking: 'No tickets needed',
    insiderTip: 'The Long Meadow is bigger than Central Park\'s Sheep Meadow. Sundays mean drum circles at Drummer\'s Grove (3rd St entrance). Smorgasburg sets up on Breeze Hill every Sunday April through October.',
    officialUrl: 'https://www.prospectpark.org',
    tags: ['Park', 'Free', 'Outdoor'],
  },
  'sight_grand_army_plaza': {
    lat: 40.6730, lng: -73.9700,
    longDesc: "Olmsted's monumental gateway to Prospect Park — a Beaux-Arts roundabout topped by the Soldiers' and Sailors' Memorial Arch (a Triumphal Arch modeled on Paris's Arc de Triomphe, dedicated to Union forces of the Civil War). The Bailey Fountain anchors the south side; the Brooklyn Public Library's Central Branch sits on the east, the Brooklyn Museum just beyond. Saturday morning is the largest farmers market in Brooklyn.",
    admission: 'Free',
    timeNeeded: '20 min',
    booking: 'No tickets needed',
    insiderTip: 'Saturday morning is the GrowNYC farmers market — biggest in Brooklyn. You can occasionally climb inside the Soldiers\' + Sailors\' Arch on select weekends — check Prospect Park Alliance for dates.',
    tags: ['Landmark', 'Free', 'Park'],
  },
  'sight_barclays_center': {
    lat: 40.6826, lng: -73.9754,
    longDesc: "Brooklyn's first major-league sports arena since the Dodgers left in 1957 — home of the Brooklyn Nets (NBA) and Liberty (WNBA), plus the New York Islanders' practice and Brooklyn-Long Island college games. SHoP Architects' weathered-steel rust-orange exterior was controversial when it opened in 2012 but has aged into a Brooklyn icon. The dramatic concourse with the curving canopy is a destination in itself; in concert mode it hosts everyone from Beyoncé and Bruce Springsteen to Bad Bunny.",
    admission: 'Varies by event ($30 nosebleed to $500+ floor)',
    timeNeeded: '2–3 hours',
    booking: 'Tickets via Ticketmaster / barclayscenter.com',
    insiderTip: 'The plaza outside is a hangout in its own right — and the Atlantic Terminal subway hub right below means you can get anywhere from here. Try the food at Calvert Vaux Park, the upper-deck taqueria.',
    officialUrl: 'https://www.barclayscenter.com',
    tags: ['Arena', 'Events', 'Sports'],
  },
  'sight_domino_park': {
    lat: 40.7142, lng: -73.9667,
    longDesc: "Built atop the bones of the Domino Sugar Refinery (which dominated this stretch of waterfront for 150+ years), Domino Park preserves the refinery's industrial archaeology — silos, cranes, syrup pipes — and weaves them into a 6-acre linear park. The elevated catwalk repurposes a stretch of the original sugar transfer infrastructure into a Manhattan-skyline-viewing platform; Tacocina (Danny Meyer's taco stand) anchors the food. Williamsburg's best new park since 2018.",
    admission: 'Free · open daily 6am – 1am',
    timeNeeded: '45 min',
    booking: 'No tickets needed',
    insiderTip: 'Tacocina and the elevated catwalk are the highlights. Bring sunscreen — there\'s very little shade on a hot day. The dog run is on the south end.',
    officialUrl: 'https://www.dominopark.com',
    tags: ['Park', 'Waterfront', 'Free'],
  },
  'sight_smorgasburg': {
    lat: 40.7220, lng: -73.9583,
    longDesc: "The largest weekly open-air food market in the United States — 80+ Brooklyn vendors gathered every Saturday at East River State Park in Williamsburg and every Sunday at Breeze Hill in Prospect Park (April through October). The lineup rotates each season but you can count on showstoppers: ramen burgers, Mighty Quinn's brisket, Mao's chicken, the original Ramen Burger, donuts, paletas, beer. Go before noon to beat the lines, after 3pm for vendor discounts.",
    admission: 'Free entry · pay per vendor ($5–25 per dish)',
    timeNeeded: '1–2 hours',
    booking: 'Walk-up · no reservations',
    insiderTip: 'Saturdays Williamsburg (East River State Park), Sundays Prospect Park (Breeze Hill). Go hungry, bring cash (cards accepted but slow). Skip lunch and graze for two hours.',
    officialUrl: 'https://www.smorgasburg.com',
    tags: ['Food', 'Outdoor', 'Seasonal'],
  },
  'sight_mccarren_park': {
    lat: 40.7197, lng: -73.9521,
    longDesc: "The de-facto town green of Northern Brooklyn — McCarren straddles the Williamsburg/Greenpoint border and serves as Sunday hangout, summer pool, soccer field, and farmers-market venue all in one. The 1936 WPA-era pool is one of NYC's best (free, swim-up bar from the city, open Memorial Day through Labor Day). Pickup volleyball, dog runs, runners on the track — McCarren never empties.",
    admission: 'Free',
    timeNeeded: '1 hour',
    booking: 'No tickets needed',
    insiderTip: 'The pool (Lorimer + Driggs entrance) is free in summer — get there before 11am to skip the line. Saturday farmers market on Lorimer Street is small but mighty.',
    tags: ['Park', 'Free', 'Outdoor'],
  },
  'sight_brooklyn_brewery': {
    lat: 40.7218, lng: -73.9572,
    longDesc: "Co-founded in 1988 by a former AP reporter (Steve Hindy) and a former banker (Tom Potter), Brooklyn Brewery essentially invented the modern American craft-beer wave on this single block in Williamsburg. Brewmaster Garrett Oliver is one of the most respected beer thinkers alive. The original brewery still operates here; the bigger production now happens upstate, but the Williamsburg taproom is the spiritual home — and where you'll find seasonal beers that never go to bottle.",
    admission: 'Free tours Sat–Sun · Tastings $5–10 per pour',
    timeNeeded: '1–2 hours',
    booking: 'Walk-up on weekends · reserve tours at brooklynbrewery.com',
    insiderTip: 'Friday Happy Hour (6–11pm) is the locals\' tradition — bring cash, beer comes by the token. Saturday tours are free and run on the half hour.',
    officialUrl: 'https://brooklynbrewery.com',
    tags: ['Drinks', 'Tours', 'Brewery'],
  },
  'sight_bam_brooklyn_academy_of_music_': {
    lat: 40.6863, lng: -73.9783,
    longDesc: "BAM is the oldest performing arts center in America (founded 1861), and arguably the country's most adventurous. Three buildings on the Fort Greene cultural corridor: the Howard Gilman Opera House (1908), the Harvey Theater (a beautifully half-restored old movie palace), and BAM Fisher (the experimental black box). Programming runs from full-scale opera (the Next Wave Festival each fall) to indie film series, Pina Bausch's Tanztheater, and BAM Café free shows on weekend nights. Robert Wilson, Mark Morris, Laurie Anderson — they've all been here.",
    admission: 'Varies by show ($25–150)',
    timeNeeded: '2–3 hours',
    booking: 'Book at bam.org or in person at the Peter Jay Sharp Building box office',
    insiderTip: 'The Next Wave Festival (Sept–Dec) is the season highlight. BAM Café (free live music Fri–Sat at 9pm in the lobby) is the best way to sample without committing.',
    officialUrl: 'https://www.bam.org',
    tags: ['Theater', 'Music', 'Film'],
  },
  'sight_brooklyn_heights_promenade': {
    lat: 40.6973, lng: -73.9966,
    longDesc: "A third-of-a-mile elevated walkway cantilevered above the Brooklyn-Queens Expressway, looking directly across the East River at Lower Manhattan. Built in the 1950s as part of Robert Moses's BQE deal with Brooklyn Heights residents (who insisted the highway not destroy their views), the Promenade is one of the great urban viewpoints anywhere — Liberty, the Brooklyn Bridge, the entire Lower Manhattan skyline all visible from the same bench. Especially magical at sunset and the first hour after dark.",
    admission: 'Free · open 24/7',
    timeNeeded: '30–45 min',
    booking: 'Walk-up anytime',
    insiderTip: 'Sunset for the skyline lighting up; sunrise for empty benches and golden light. The prettiest approach is from Cranberry Street, then walking the brownstone blocks afterward.',
    tags: ['View', 'Free', 'Landmark'],
  },
  'sight_fort_greene_park': {
    lat: 40.6896, lng: -73.9752,
    longDesc: "Designed by Frederick Law Olmsted and Calvert Vaux in 1867 — their first park after Central Park, a warm-up for what became Prospect Park. The 30-acre park climbs a hill that's topped by McKim, Mead & White's Prison Ship Martyrs Monument (1908), a 149-foot Doric column honoring the 11,500 American prisoners of war who died on British ships moored in Wallabout Bay during the Revolution. The view from the top spans Manhattan to Coney Island.",
    admission: 'Free',
    timeNeeded: '45 min',
    booking: 'No tickets needed',
    insiderTip: 'The Prison Ship Martyrs Monument staircase is the tallest open stair in any NYC park — great workout, panoramic view. Saturday morning the GrowNYC farmers market sets up at DeKalb + Washington Park.',
    tags: ['Park', 'Free', 'Historic'],
  },

  // --- Greenpoint ---
  'sight_transmitter_park': {
    lat: 40.7297, lng: -73.9594,
    longDesc: "A compact 5-acre waterfront park at the foot of Greenpoint Avenue, built atop the former WNYC radio transmitter site (the antennas were here from 1937 until 1990). The pier sticks out 200 feet into the East River, lining up the Empire State Building, the Chrysler Building, and the United Nations all in one frame. Less crowded than Domino Park down in Williamsburg, and the sunset over Midtown is among the best you'll find anywhere in Brooklyn.",
    admission: 'Free · open daily 6am – 10pm',
    timeNeeded: '30–45 min',
    booking: 'No tickets needed',
    insiderTip: 'Walk the pier all the way to the end at sunset — the Manhattan skyline lights up while you face directly into it. The grass lawn is dog-friendly off-leash before 9am.',
    tags: ['Park', 'Waterfront', 'Free'],
  },
  'sight_manhattan_avenue': {
    lat: 40.7270, lng: -73.9530,
    longDesc: "The commercial spine of Greenpoint and the most intact stretch of Polish Brooklyn left in the borough. Polish has been the second language here since the early 20th century, and the bakeries, butchers, delis, and the Polish & Slavic Center along Manhattan Avenue still anchor a real working community. Walk from Greenpoint Avenue north to McGuinness Boulevard for pierogi, kielbasa, fresh rye, and Polish books — then peel off onto the side streets for some of the prettiest old wood-frame houses in NYC.",
    admission: 'Free to walk',
    timeNeeded: '1–2 hours',
    booking: 'No tickets needed',
    insiderTip: 'Peter Pan Donut & Pastry Shop (727 Manhattan Ave) is the local breakfast institution — cash only, classics-only menu, open since 1952. Syrena Bakery for rye and babka.',
    tags: ['Walk', 'Food', 'Culture'],
  },
  'sight_warsaw': {
    lat: 40.7290, lng: -73.9528,
    longDesc: "A concert venue built inside the 1914 Polish National Home — a working community center that still hosts polka nights, weddings, and the parish kitchen alongside indie rock shows. Warsaw is what you get when Bowery Presents takes over a Polish dance hall: 1,000-capacity room with a balcony, terrible sightlines from the side, the best pierogi you can buy at a music venue anywhere. Patti Smith, Iggy Pop, Fleet Foxes, Father John Misty have all played here.",
    admission: 'Varies by show ($25–60)',
    timeNeeded: '2–3 hours',
    booking: 'Tickets via warsawconcerts.com or Ticketmaster',
    insiderTip: 'The pierogi station in the lobby is real — half-time intermission food, run by the Polish Home aunties. Doors usually 7pm; show starts later than the ticket says.',
    officialUrl: 'https://www.warsawconcerts.com',
    tags: ['Music', 'Venue', 'Food'],
  },
  'sight_variety_coffee': {
    lat: 40.7268, lng: -73.9540,
    longDesc: "Greenpoint's flagship third-wave coffee bar — the original Variety on Graham opened in 2008 and the Greenpoint shop on Manhattan Avenue is the bigger, calmer sibling. Long communal benches, fast wifi, generous outlets, and one of the better house espresso blends in Brooklyn. The pastries (almond croissants, sticky buns) come from Ovenly across the street. The patio out back is the quiet move on a warm afternoon.",
    admission: 'Pay per drink ($4–7)',
    timeNeeded: '30–60 min',
    booking: 'Walk-in',
    insiderTip: 'The back patio is the secret — most tourists never find it. Order an iced almond latte and bring a laptop on a weekday morning.',
    officialUrl: 'https://www.varietycoffeeroasters.com',
    tags: ['Coffee', 'Cafe', 'Work-friendly'],
  },

  // --- Williamsburg ---
  'sight_music_hall_of_williamsburg': {
    lat: 40.7188, lng: -73.9577,
    longDesc: "A 550-capacity Bowery Presents room that punches well above its weight on the indie circuit — Williamsburg's answer to the Bowery Ballroom, with the same booking team and a similar pedigree of bands-on-the-way-up. Tame Impala, Lorde, Phoebe Bridgers, Mitski, and Vampire Weekend all played here before they could fill Brooklyn Steel. The sightlines from the upstairs balcony are surprisingly forgiving for a converted warehouse.",
    admission: 'Varies by show ($25–55)',
    timeNeeded: '2–3 hours',
    booking: 'Tickets via musichallofwilliamsburg.com',
    insiderTip: 'The upstairs balcony has the best sightlines and a small bar with no line. Get there early — the doors usually open an hour before showtime and the venue fills fast for sold-out shows.',
    officialUrl: 'https://www.musichallofwilliamsburg.com',
    tags: ['Music', 'Venue', 'Indie'],
  },
  'sight_bedford_avenue': {
    lat: 40.7173, lng: -73.9568,
    longDesc: "Williamsburg's main commercial drag and the avenue that defined a certain idea of Brooklyn for two decades. The strip from Metropolitan up to N 10th Street still has the highest density of vintage shops, indie boutiques, coffee bars, bookstores (Spoonbill & Sugartown is essential), and weekend brunch spots in the neighborhood. The L train Bedford stop dumps you in the middle of it — start there and walk in either direction.",
    admission: 'Free to walk',
    timeNeeded: '1–3 hours',
    booking: 'No tickets needed',
    insiderTip: 'Skip the obvious chains on Bedford itself and duck onto the side streets — N 6th, N 7th, Berry, Wythe — for the better food and quieter shops. Spoonbill & Sugartown Books at N 4th + Bedford is the best indie bookshop in the neighborhood.',
    tags: ['Walk', 'Shopping', 'Cafe'],
  },

  // --- East Williamsburg ---
  'sight_house_of_yes': {
    lat: 40.7062, lng: -73.9234,
    longDesc: "Part nightclub, part circus, part immersive theater — House of Yes is what Williamsburg's nightlife scene wishes it still was. The themed parties (Dirty Circus, Tropico, Ketamine Disco) blur the line between performer and audience: aerialists drop from the ceiling, dancers in elaborate costumes prowl the floor, and a strict consent and dress code make it one of the most welcoming queer-friendly venues in the city. The brunch shows on Sundays are a milder gateway drug.",
    admission: '$20–60 cover · dress code enforced',
    timeNeeded: '3–5 hours',
    booking: 'Pre-book via houseofyes.org — many shows sell out',
    insiderTip: 'Dress up — they will turn you away in jeans and a t-shirt. Sunday brunch shows are the family-friendly entry point; the late-night themed parties are the real experience.',
    officialUrl: 'https://www.houseofyes.org',
    tags: ['Nightlife', 'Cabaret', 'LGBTQ+'],
  },
  'sight_roberta_s': {
    lat: 40.7053, lng: -73.9337,
    longDesc: "The wood-fired pizza counter that put Bushwick on the food map in 2008 and arguably launched the whole modern Brooklyn pizza renaissance. Carlo Mirarchi's oven turns out a Neapolitan-Brooklyn hybrid (the Bee Sting — soppressata, chili, honey — is the icon), the back patio is built from shipping containers, and the offshoot tasting-menu restaurant Blanca next door earned two Michelin stars. The neighborhood has gentrified hard around it; Roberta's still feels like itself.",
    admission: '$18–28 per pizza',
    timeNeeded: '1.5–2 hours',
    booking: 'Walk-in only at the main counter — Blanca tickets sold separately',
    insiderTip: 'The Bee Sting is the must-order. Show up before 6pm on weekends or after 9pm to avoid the worst waits. The Blanca tasting menu next door is a completely separate restaurant (and a completely separate booking).',
    officialUrl: 'https://www.robertaspizza.com',
    tags: ['Food', 'Pizza', 'Casual'],
  },
  'sight_bushwick_inlet_park': {
    lat: 40.7239, lng: -73.9610,
    longDesc: "A long-promised 27-acre waterfront park stitching together former industrial parcels at the Williamsburg-Greenpoint border. The first phase opened in 2014 with a green-roofed community building, turf soccer fields, and a kayak launch; the rest is still being assembled parcel by parcel. The Manhattan skyline view from the green roof is one of the underused secrets of the North Brooklyn waterfront.",
    admission: 'Free',
    timeNeeded: '45 min – 1 hour',
    booking: 'No tickets needed',
    insiderTip: 'Climb to the green roof of the community building — it is open during park hours and the view is empty most weekdays. Free kayaking on summer Saturdays via the North Brooklyn Boat Club.',
    tags: ['Park', 'Waterfront', 'Free'],
  },
  'sight_cotton_candy_machine': {
    lat: 40.7159, lng: -73.9492,
    longDesc: "A tiny print gallery and gift shop on Roebling Street run by artist Tara McPherson — specializing in pop-art prints, art toys, zines, and limited-edition collaborations with illustrators who orbit the gig-poster and lowbrow art worlds. Easy to miss, easy to love, and the kind of small business that still gives Williamsburg its character. Stop in for 20 minutes and walk out with a print you didn't know existed.",
    admission: 'Free entry · prints $25–200',
    timeNeeded: '20–30 min',
    booking: 'Walk-in',
    insiderTip: 'Check the back wall for the under-$50 prints — the signed editions are often a fraction of what the same artists charge at the bigger Manhattan galleries.',
    officialUrl: 'https://www.thecottoncandymachine.com',
    tags: ['Gallery', 'Shopping', 'Art'],
  },

  // --- Bushwick ---
  'sight_the_bushwick_collective': {
    lat: 40.7050, lng: -73.9330,
    longDesc: "An open-air street-art gallery that fills the warehouse walls around Troutman Street and St. Nicholas Avenue with rotating large-scale murals by international artists. Founded by Bushwick native Joe Ficalora in 2011, the Collective now stages an annual block party every June and rotates its work every few months — meaning the show is genuinely different every time you visit. The best concentration of murals runs Troutman from Wyckoff to St. Nicholas.",
    admission: 'Free · 24/7',
    timeNeeded: '45 min – 1.5 hours',
    booking: 'No tickets needed',
    insiderTip: 'Start at the Jefferson L stop and walk down Troutman. The annual block party in early June is when the new murals are unveiled — biggest street-art event in NYC.',
    officialUrl: 'https://www.thebushwickcollective.com',
    tags: ['Art', 'Walk', 'Free'],
  },
  'sight_mood_ring': {
    lat: 40.7036, lng: -73.9233,
    longDesc: "Bushwick's astrology bar — themed cocktails by zodiac sign, tarot readings on slow weeknights, and an aesthetic that lands somewhere between 1970s rec room and a Sailor Moon fan club. The crowd skews queer and creative; the drinks are surprisingly serious for a place with this much glitter. Look for the mood-lit storefront on Myrtle Avenue near the Central Avenue M stop.",
    admission: 'No cover · drinks $14–18',
    timeNeeded: '1.5–3 hours',
    booking: 'Walk-in · larger groups should call ahead',
    insiderTip: 'Order the cocktail for your sign — they take it seriously. Tuesday tarot readings are free with a drink; Friday and Saturday nights get tight after 11pm.',
    officialUrl: 'https://www.moodringnyc.com',
    tags: ['Bar', 'Nightlife', 'LGBTQ+'],
  },
  'sight_maria_hernandez_park': {
    lat: 40.7036, lng: -73.9266,
    longDesc: "Bushwick's main public space — a 7-acre block bordered by Knickerbocker, Irving, Suydam, and Starr. Renamed in 1989 for community activist Maria Hernandez, who was killed for resisting drug dealers in the neighborhood she was trying to clean up. Today the park is the social heart of Bushwick — soccer games, weekend salsa dancers, the playground for the surrounding tenements, and the staging ground for the Bushwick Collective's annual block party.",
    admission: 'Free',
    timeNeeded: '30–45 min',
    booking: 'No tickets needed',
    insiderTip: 'Sunday afternoons bring informal soccer leagues and a salsa-dance circle near the bandshell. Surrounded on all four sides by some of the best Bushwick Collective murals.',
    tags: ['Park', 'Free', 'Community'],
  },

  // --- Downtown Brooklyn ---
  'sight_brooklyn_borough_hall': {
    lat: 40.6929, lng: -73.9903,
    longDesc: "The Greek Revival temple at 209 Joralemon Street served as Brooklyn's actual City Hall from 1848 until consolidation with New York City in 1898 — when Brooklyn went from being the third-largest American city to a borough of a larger one. The building is still the seat of the Brooklyn Borough President; the steps and the plaza in front host the Brooklyn Flea on Saturdays in summer and the weekly Greenmarket year-round. The interior rotunda is open weekdays and worth a five-minute detour.",
    admission: 'Free · weekdays 9am–5pm',
    timeNeeded: '30 min',
    booking: 'Walk-in',
    insiderTip: 'Saturday farmers market on the plaza out front; the cast-iron cupola was added in 1898 to soften the change in status. Stand on the steps and look across at the Brooklyn Municipal Building — both are part of the same civic ensemble.',
    tags: ['Landmark', 'Historic', 'Free'],
  },
  'sight_junior_s': {
    lat: 40.6907, lng: -73.9818,
    longDesc: "The cheesecake institution that has been at Flatbush + DeKalb since 1950, when Harry Rosen opened it as a place where the Schubert Theatre crowd could eat between shows. Three generations of Rosens still run it; the cheesecake recipe hasn't changed (cream cheese and sour cream, no flour); the menu is a full diner of deli classics. The original Brooklyn outpost is the one that matters — the Times Square branch exists but doesn't count.",
    admission: '$30–50 per person for a meal',
    timeNeeded: '1 – 1.5 hours',
    booking: 'Walk-in · no reservations',
    insiderTip: 'You do not need to eat a full meal — just sit at the bakery counter and order a slice and a coffee. The strawberry shortcake cheesecake is the move if plain feels boring.',
    officialUrl: 'https://www.juniorscheesecake.com',
    tags: ['Food', 'Dessert', 'Historic'],
  },
  'sight_center_for_brooklyn_history': {
    lat: 40.6953, lng: -73.9930,
    longDesc: "Founded as the Long Island Historical Society in 1863, this gorgeous 1881 terracotta-and-brick building on Pierrepont Street holds the most complete archive of Brooklyn history anywhere — neighborhood maps, photographs, oral histories, the records of the Brooklyn Navy Yard and the Brooklyn Dodgers. Now operated as a branch of the Brooklyn Public Library and the Brooklyn campus of the New-York Historical Society. The Othmer Library reading room upstairs is open to anyone with a research project, no appointment needed.",
    admission: 'Free',
    timeNeeded: '1 – 1.5 hours',
    booking: 'Walk-in · library appointment recommended for archives',
    insiderTip: 'The 4th-floor Othmer Library is the secret — Tiffany lamps, carved oak, the smell of 19th-century books. The current rotating gallery exhibit is usually neighborhood-specific and good.',
    officialUrl: 'https://www.bklynlibrary.org/locations/center-for-brooklyn-history',
    tags: ['Museum', 'History', 'Free'],
  },

  // --- DUMBO ---
  'sight_empire_stores': {
    lat: 40.7035, lng: -73.9893,
    longDesc: "A row of seven brick coffee warehouses built between 1869 and 1885 along the Brooklyn waterfront — once where green coffee beans from South America were unloaded, weighed, and roasted for the entire Northeast. Restored in 2017 with a steel-and-glass top floor added without disturbing the original 19th-century brick. Now full of shops (West Elm, Cecconi's, Empire Stores Market), a public courtyard that cuts through to Brooklyn Bridge Park, and a rooftop with an unobstructed Lower Manhattan view.",
    admission: 'Free entry · shops and restaurants priced individually',
    timeNeeded: '1 – 1.5 hours',
    booking: 'Walk-in',
    insiderTip: 'The free rooftop is the best secret in DUMBO — take the elevator at the rear of the building to the 5th floor and walk out onto the deck. Best skyline view that does not require a drink minimum.',
    officialUrl: 'https://www.empirestoresdumbo.com',
    tags: ['Shopping', 'Landmark', 'View'],
  },
  'sight_time_out_market': {
    lat: 40.7028, lng: -73.9903,
    longDesc: "A 21,000 sq ft curated food hall on the third floor of Empire Stores — Time Out's editors picked the city's best chefs and pop-ups (Felice, Mr. Taka Ramen, Jacob's Pickles, Pat LaFrieda burgers, Fornino) and gave each one a stall. The communal seating area opens onto a rooftop bar with the Brooklyn Bridge and Manhattan skyline directly in front of you. Faster than chasing the same chefs across Manhattan; the rooftop is the best part.",
    admission: 'Free entry · $12–25 per dish',
    timeNeeded: '1 – 2 hours',
    booking: 'Walk-in',
    insiderTip: 'Skip the indoor seating and go straight to the rooftop bar — same food, far better view. Felice does a $14 cacio e pepe that is the best deal in DUMBO.',
    officialUrl: 'https://www.timeoutmarket.com/newyork',
    tags: ['Food', 'View', 'Casual'],
  },
  'sight_brooklyn_roasting_company': {
    lat: 40.7027, lng: -73.9883,
    longDesc: "Their original Pearl Street roastery — Jim Munson opened it in 2010 inside a former 19th-century paper warehouse, and the room still has the high ceilings, exposed beams, and roasting smell of a real working roastery. Fair-trade, single-origin beans roasted on-site; the espresso is the strongest argument for getting off Bedford Avenue. The Pearl Street location is the one with the soul; the newer outposts feel like satellites.",
    admission: 'Pay per drink ($4–7)',
    timeNeeded: '30–60 min',
    booking: 'Walk-in',
    insiderTip: 'The benches along the windows are the best seats on a weekday morning. Buy a half-pound of the Iris Espresso blend at the counter to take home.',
    officialUrl: 'https://www.brooklynroasting.com',
    tags: ['Coffee', 'Cafe', 'Work-friendly'],
  },

  // --- Brooklyn Heights ---
  'sight_plymouth_church': {
    lat: 40.6993, lng: -73.9933,
    longDesc: "The 1849 Congregationalist church on Orange Street where Henry Ward Beecher delivered the most famous abolitionist sermons in America — and where the basement reportedly served as a stop on the Underground Railroad. Abraham Lincoln worshipped here twice; Mark Twain, Walt Whitman, and Frederick Douglass all spoke from the pulpit. The interior is plain by 19th-century standards (Beecher wanted the focus on preaching, not architecture); the historical weight of the room is the reason to visit.",
    admission: 'Free · open Sundays for services + select tours',
    timeNeeded: '45 min',
    booking: 'Check plymouthchurch.org for tour schedule',
    insiderTip: 'The Sunday 11am service is open to the public and is the easiest way to see the sanctuary. The garden behind the church holds a piece of the original Plymouth Rock — a literal one, brought here by the congregation in 1840.',
    officialUrl: 'https://www.plymouthchurch.org',
    tags: ['Historic', 'Free', 'Architecture'],
  },
  'sight_willow_pierrepont_street': {
    lat: 40.6964, lng: -73.9942,
    longDesc: "The blocks bounded by Willow, Pierrepont, Cranberry, and Hicks streets contain the densest concentration of preserved pre-1860 brownstones, wood-frame houses, and federal-style row houses anywhere in NYC. Brooklyn Heights became the first historic district designated under NYC's 1965 Landmarks Preservation Law, which is why the entire neighborhood still looks like a 19th-century daguerreotype. Truman Capote wrote In Cold Blood in the yellow house at 70 Willow; Walt Whitman lived two blocks over.",
    admission: 'Free to walk',
    timeNeeded: '45 min – 1 hour',
    booking: 'No tickets needed',
    insiderTip: 'Start at Cranberry + Hicks (Truman Capote territory), walk down Willow to Pierrepont, then west to the Promenade. The wood-frame houses on Cranberry are the rarest — most of the original 1830s wood frames in NYC burned down a century ago.',
    tags: ['Walk', 'Historic', 'Free'],
  },
  'sight_brooklyn_historical_society': {
    lat: 40.6953, lng: -73.9930,
    longDesc: "The 1881 landmark on Pierrepont Street merged with the New-York Historical Society in 2020 and now operates as the Brooklyn campus of the larger institution — but the building, the archive, and the focus on Brooklyn history remain. The galleries on the ground floor host rotating exhibitions on Brooklyn neighborhoods, immigrant history, and the borough's cultural transformations. The Othmer Library upstairs is the same magnificent Tiffany-lamped reading room mentioned in the Center for Brooklyn History — they share the building.",
    admission: 'Free',
    timeNeeded: '1 – 1.5 hours',
    booking: 'Walk-in',
    insiderTip: 'Same building as the Center for Brooklyn History — visit both in one stop. The terracotta exterior with portraits of Beethoven, Shakespeare, and Gutenberg is one of the prettiest 19th-century facades in NYC.',
    officialUrl: 'https://www.nyhistory.org/brooklyn',
    tags: ['Museum', 'History', 'Free'],
  },

  // --- Fort Greene ---
  'sight_greenlight_bookstore': {
    lat: 40.6862, lng: -73.9745,
    longDesc: "The beloved indie bookshop that opened on Fulton Street in 2009 and has anchored the cultural life of Fort Greene ever since. Co-owners Jessica Stockton Bagnulo and Rebecca Fitting curate one of the smartest fiction sections in the city and program a packed calendar of author events — Zadie Smith, Colson Whitehead, Jesmyn Ward, Jacqueline Woodson have all read here. The smaller second location in Prospect Lefferts Gardens followed in 2016, but the Fulton store is the original.",
    admission: 'Free entry · books at cover price',
    timeNeeded: '30–60 min',
    booking: 'Walk-in · author events ticketed via greenlightbookstore.com',
    insiderTip: 'Check the events calendar — they get top-tier writers and the rooms are small enough that you can talk to them afterward. The local-author table near the front is curated by the staff and reliable.',
    officialUrl: 'https://www.greenlightbookstore.com',
    tags: ['Books', 'Cultural', 'Indie'],
  },
  'sight_fulton_street': {
    lat: 40.6862, lng: -73.9700,
    longDesc: "The restaurant row that runs through Fort Greene from Flatbush Avenue east to Vanderbilt — Caribbean takeout windows, soul-food sit-downs, oyster bars, and natural-wine spots all on the same six-block stretch. Olea (Mediterranean), Black Iris (Middle Eastern), Saraghina (Italian pizza), and Madiba (South African) have anchored this strip for over a decade; the new arrivals keep filling in the gaps. Walk it at 7pm on a Friday to feel why Fort Greene is the dinner neighborhood the rest of Brooklyn copies from.",
    admission: 'Free to walk · meals $20–60',
    timeNeeded: '1 – 3 hours',
    booking: 'Most restaurants take walk-ins or same-day Resy',
    insiderTip: 'The block between South Portland and South Oxford has the highest density. Pair dinner here with a 7:30pm show at BAM (one block south) — it is the move locals use.',
    tags: ['Food', 'Walk', 'Dining'],
  },

  // --- Clinton Hill ---
  'sight_pratt_institute_campus': {
    lat: 40.6913, lng: -73.9637,
    longDesc: "The Brooklyn campus of one of the country's top art and design schools — founded in 1887 by oil baron Charles Pratt and still operating on its original 25-acre grounds. The campus is open to the public and includes the Pratt Sculpture Park (60+ outdoor pieces rotating across the lawns), the Memorial Hall steam plant (the oldest continuously operating private power plant in NYC), and a Beaux-Arts main building that would not look out of place at any Ivy League school. The walk through the campus is one of the prettiest urban-academic strolls in Brooklyn.",
    admission: 'Free · open daily during daylight hours',
    timeNeeded: '45 min – 1 hour',
    booking: 'No tickets needed',
    insiderTip: 'Enter at the Hall Street gate and walk diagonally across to DeKalb — the best sculpture pieces sit on the lawns along the central path. The historic steam plant near the engineering buildings is occasionally open for tours.',
    officialUrl: 'https://www.pratt.edu',
    tags: ['Art', 'Walk', 'Free'],
  },
  'sight_washington_avenue_brownstones': {
    lat: 40.6855, lng: -73.9650,
    longDesc: "The stretch of Washington and Clinton Avenues between Atlantic and Myrtle is among the best-preserved brownstone-and-mansion blocks in NYC. Charles Pratt's old neighborhood — when he was the second-richest man in America, he built a mansion at 232 Clinton Avenue (the green-shuttered one) and gave each of his sons a mansion of his own up and down the same block. Today the blocks read as a museum of late-19th-century Brooklyn wealth.",
    admission: 'Free to walk',
    timeNeeded: '30–45 min',
    booking: 'No tickets needed',
    insiderTip: 'Start at Lafayette + Clinton and walk north — the four Pratt mansions cluster between Greene and Willoughby. Look for the original carriage-house garages tucked behind some properties.',
    tags: ['Walk', 'Historic', 'Free'],
  },
  'sight_underwood_park': {
    lat: 40.6859, lng: -73.9641,
    longDesc: "A small but lovely neighborhood park tucked at Washington and Lafayette Avenues, built on the former site of John Underwood's typewriter mansion. The park is one block square — a fountain, a playground, perimeter benches under mature plane trees — but it functions as Clinton Hill's living room. Sunday afternoons bring chess players, dog walkers, and the kind of relaxed brownstone-neighborhood scene that's getting harder to find in Brooklyn.",
    admission: 'Free',
    timeNeeded: '20–30 min',
    booking: 'No tickets needed',
    insiderTip: 'Combine with the Washington Avenue brownstone walk and the Pratt campus — they are all within three blocks of each other and make a perfect 90-minute Clinton Hill loop.',
    tags: ['Park', 'Free', 'Quiet'],
  },

  // --- Prospect Heights ---
  'sight_vanderbilt_avenue': {
    lat: 40.6790, lng: -73.9683,
    longDesc: "Prospect Heights's restaurant and bar row — the seven blocks of Vanderbilt between Atlantic and Prospect Park host the densest cluster of acclaimed independent restaurants in the borough. Olmsted (foraged tasting menus), Faun (Italian small plates), Cheryl's Global Soul, Bar Sardine, James (American), Convivium Osteria — most have been here for a decade or more. The street closes to traffic on summer Sundays for the Vanderbilt Avenue Open Street, which turns the strip into a Brooklyn block party.",
    admission: 'Free to walk · meals $25–80',
    timeNeeded: '1 – 3 hours',
    booking: 'Reserve via Resy for dinner — most spots book up by Wednesday for weekends',
    insiderTip: 'Walk it on a Sunday from May through October when the open street is in effect — the whole avenue becomes outdoor dining. Olmsted around the corner from the Brooklyn Museum is the destination booking; book three weeks ahead.',
    tags: ['Food', 'Walk', 'Dining'],
  },

  // --- Park Slope ---
  'sight_seventh_avenue': {
    lat: 40.6710, lng: -73.9782,
    longDesc: "Park Slope's original commercial spine — running parallel to the western edge of Prospect Park from Flatbush down to Bartel-Pritchard Square. Seventh Avenue is the Park Slope of Park Slope: longtime independent bookstores (Community Bookstore), the original Two Boots pizza, multi-generation Italian delis (Russo's Mozzarella & Pasta), bagel shops, neighborhood bars. Less hyped than Fifth Avenue and more useful — this is where the actual Park Slopers shop.",
    admission: 'Free to walk',
    timeNeeded: '1 – 2 hours',
    booking: 'No tickets needed',
    insiderTip: 'Community Bookstore at 143 7th Ave has a back garden with the resident cat — among the oldest indie bookstores left in NYC. Russo at 363 7th Ave for fresh mozzarella made that morning.',
    tags: ['Walk', 'Shopping', 'Local'],
  },
  'sight_fifth_avenue': {
    lat: 40.6745, lng: -73.9830,
    longDesc: "Park Slope's newer hot strip — the stretch of 5th Avenue from Flatbush down to 9th Street has become the borough's most reliable bar-and-restaurant corridor over the last 15 years. Al fresco sidewalk dining year-round (post-pandemic the city made it permanent), the Park Slope Food Coop one block over keeps the foot traffic walking, and the bars stay packed late on weekends. Compared to Seventh Avenue, this is louder, younger, and the better choice for dinner-and-drinks.",
    admission: 'Free to walk · meals $20–60',
    timeNeeded: '1 – 3 hours',
    booking: 'Most restaurants take walk-ins or same-day Resy',
    insiderTip: 'Convivium Osteria, al di la, and Mary\'s Bar are the Fifth Avenue anchors that have been here longest. Walk it from 9th Street north on a Friday or Saturday for the full Park Slope-after-dark feel.',
    tags: ['Food', 'Walk', 'Nightlife'],
  },
  'sight_green_wood_cemetery': {
    lat: 40.6580, lng: -73.9941,
    longDesc: "478 acres of rolling hills, glacial ponds, and Victorian mausoleums at the southern edge of Park Slope — one of the largest historic cemeteries in the United States and a National Historic Landmark. Founded in 1838 as a rural cemetery in the Mount Auburn tradition, Green-Wood became so popular as a Sunday destination that it directly inspired the creation of Central Park. Permanent residents include Leonard Bernstein, Jean-Michel Basquiat, Boss Tweed, and 300,000 others. The hilltop at Battle Hill is the highest natural point in Brooklyn (and the site of the 1776 Battle of Brooklyn).",
    admission: 'Free · open daily 7am – 7pm (winter 5pm)',
    timeNeeded: '1.5 – 3 hours',
    booking: 'Walk-in · trolley tours bookable at green-wood.com',
    insiderTip: 'Pick up a free map at the 25th Street gate — you will get lost without one. The annual Memorial Day Concert at the chapel is the best free music program in Brooklyn.',
    officialUrl: 'https://www.green-wood.com',
    tags: ['Historic', 'Park', 'Free'],
  },

  // --- Crown Heights ---
  'sight_eastern_parkway': {
    lat: 40.6720, lng: -73.9560,
    longDesc: "Frederick Law Olmsted and Calvert Vaux designed Eastern Parkway in 1866 as the first parkway in the world — a grand 2.5-mile boulevard with central drive, side promenades, tree-lined pedestrian walks, and bridle paths. It connected Prospect Park east to the Brooklyn Museum and the Botanic Garden, and remains the spine of central Brooklyn. Every Labor Day weekend the route hosts the West Indian Day Parade, the largest Caribbean parade in North America (over 1 million attendees).",
    admission: 'Free to walk',
    timeNeeded: '45 min – 1.5 hours',
    booking: 'No tickets needed',
    insiderTip: 'Walk the pedestrian promenade (set back from the traffic lanes) — the experience Olmsted designed. Labor Day Monday is the parade; arrive by 10am to find a sidewalk spot east of Utica Avenue.',
    tags: ['Walk', 'Historic', 'Free'],
  },
  'sight_nostrand_avenue': {
    lat: 40.6720, lng: -73.9500,
    longDesc: "The cultural and commercial heart of Caribbean Crown Heights — the stretch of Nostrand Avenue from Eastern Parkway south to Empire Boulevard is lined with Jamaican patty shops, Trinidadian roti spots, Guyanese bakeries, Haitian griot stands, and Caribbean grocery markets. The food culture here is older and deeper than anywhere else in Brooklyn; the West Indian Day Parade may take place on Eastern Parkway, but the eating happens on Nostrand. Allan's Bakery (1109 Nostrand) for currant rolls; Gloria's (764 Nostrand) for oxtail.",
    admission: 'Free to walk · meals $10–25',
    timeNeeded: '1 – 2 hours',
    booking: 'Walk-in at any of the food spots',
    insiderTip: 'Allan\'s Bakery for Caribbean pastries (since 1961); Gloria\'s for the best Trinidadian curry chicken roti in Brooklyn. Cash is faster than cards at most spots.',
    tags: ['Food', 'Walk', 'Culture'],
  },
  'sight_sterling_st_johns_place': {
    lat: 40.6755, lng: -73.9560,
    longDesc: "The blocks between Sterling Place and St. Johns Place, running from Washington Avenue east to Nostrand, contain some of Brooklyn's best-preserved late-19th-century rowhouse architecture — limestone Renaissance Revivals, Romanesque brownstones, and turreted Queen Anne mansions, most built between 1885 and 1905 by the same group of speculative developers. Crown Heights North was designated a Historic District in 2007; the walk along these blocks is the architectural-history version of Park Slope's brownstone blocks, with about half the foot traffic.",
    admission: 'Free to walk',
    timeNeeded: '30–45 min',
    booking: 'No tickets needed',
    insiderTip: 'Start at the Brooklyn Museum and walk east on St. Johns — the architecture gets denser as you approach Nostrand. The mansions on Dean Street between Bedford and Nostrand are an even better one-block detour.',
    tags: ['Walk', 'Historic', 'Free'],
  },
}

// Slugify a name into a stable ID for use as a venue-like key.
function sightIdOf(name) {
  return 'sight_' + (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

// Flat lookup of every sight across every sub-neighborhood, keyed by sightId.
// Merged with SIGHT_ENRICHMENT so SightScreen can render planning detail when available.
const ALL_SIGHTS = (() => {
  const result = {}
  Object.entries(NEIGHBORHOOD_SUBAREAS).forEach(([parentKey, subAreas]) => {
    subAreas.forEach(sa => {
      sa.areas.forEach(area => {
        (area.sights || []).forEach(s => {
          const id = sightIdOf(s.name)
          if (!result[id]) {
            result[id] = {
              ...s,
              ...(SIGHT_ENRICHMENT[id] || {}),
              id,
              borough: parentKey,
              subArea: sa.label,
              neighborhood: area.name,
            }
          }
        })
      })
    })
  })
  return result
})()

// ── Cross-domain nearby venues ─────────────────────────────────────────
function getNearbyAcrossDomains(venueId, maxCount = 3) {
  const origin = venueCoords[venueId]
  if (!origin) return []
  const dist = (a, b) => {
    const dlat = a.lat - b.lat, dlng = a.lng - b.lng
    return Math.sqrt(dlat * dlat + dlng * dlng)
  }
  const candidates = []
  Object.entries(venueCoords).forEach(([id, coord]) => {
    if (id === venueId) return
    if (coord.domain === origin.domain) return
    const v = venues[id]
    if (!v) return
    candidates.push({ id, dist: dist(origin, coord), domain: coord.domain, venue: v })
  })
  candidates.sort((a, b) => a.dist - b.dist)
  // One result per domain, up to maxCount
  const seen = new Set()
  const result = []
  for (const c of candidates) {
    if (!seen.has(c.domain)) {
      seen.add(c.domain)
      result.push(c)
    }
    if (result.length >= maxCount) break
  }
  return result
}

// ── Graceful image fallback ───────────────────────────────────────────────
function ImgWithFallback({ src, alt, className, style }) {
  const [failed, setFailed] = useState(false)
  const onError = useCallback(() => setFailed(true), [])

  if (failed) {
    return (
      <div
        className={className}
        style={{
          background: 'linear-gradient(160deg, #1c1035 0%, #2a1650 50%, #1c0a35 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 16px',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)',
        }} />
        <span style={{
          color: '#c9a84c',
          fontSize: '10px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          opacity: 0.8,
        }}>✦  ✦</span>
        <span style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '15px',
          fontWeight: '700',
          textAlign: 'center',
          lineHeight: 1.25,
          letterSpacing: '0.3px',
        }}>{alt}</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} style={style} onError={onError} loading="lazy" />
}

// ── Nav stack ─────────────────────────────────────────────────────────────
function useNav() {
  const [stack, setStack] = useState([{ screen: 'home' }])
  const current = stack[stack.length - 1]
  const canGoBack = stack.length > 1

  function push(entry) {
    setStack(s => [...s, entry])
    window.scrollTo(0, 0)
  }
  function back() {
    setStack(s => s.slice(0, -1))
    window.scrollTo(0, 0)
  }
  function reset() {
    setStack([{ screen: 'home' }])
    window.scrollTo(0, 0)
  }

  return { current, canGoBack, push, back, reset }
}

// ── Top Nav ───────────────────────────────────────────────────────────────
function TopNav({ title, canGoBack, onBack, isHome }) {
  if (isHome) return null
  return (
    <div className="top-nav">
      {canGoBack && (
        <button className="nav-back" onClick={onBack} aria-label="Go back">
          ←
        </button>
      )}
      <span className="nav-title">{title}</span>
    </div>
  )
}

// ── Home Screen ───────────────────────────────────────────────────────────
function HomeScreen({ push, savedItems, toggleSave, onSeeAllTonight = () => {} }) {
  const [query, setQuery] = useState('')
  const [browseBy, setBrowseBy] = useState('topics') // 'topics' | 'neighborhoods'

  const searchResults = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const results = []
    Object.values(venues).forEach(v => {
      if (v.name.toLowerCase().includes(q))
        results.push({ type: 'venue', id: v.id, name: v.name, sub: v.neighborhood || '' })
    })
    Object.values(figures).forEach(f => {
      if (f.name.toLowerCase().includes(q)) {
        const t = topics[f.topicId]
        results.push({ type: 'figure', id: f.id, name: f.name, sub: t?.name || '' })
      }
    })
    Object.values(works).forEach(w => {
      if (w.title.toLowerCase().includes(q)) {
        const fig = figures[w.figureId]
        results.push({ type: 'work', id: w.id, name: w.title, sub: fig?.name || '' })
      }
    })
    return results.slice(0, 25)
  }, [query])

  // BottomNav is 60px fixed; no TopNav on home — so available height is 100dvh - 60px
  return (
    <div style={{ height: 'calc(100dvh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Pinned header + search — never scrolls away ── */}
      <div style={{ flexShrink: 0 }}>
        <div className="home-header">
          <div className="home-wordmark">NYC Tonight</div>
          <div className="home-subtitle">A curated guide to what&apos;s on — and the stories behind it.</div>
        </div>
        <div style={{ padding: '12px 20px 10px', background: 'var(--white)', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--gray-100)', borderRadius: 12, padding: '10px 14px',
          }}>
            <span style={{ fontSize: 16, color: 'var(--gray-400)', flexShrink: 0 }}>🔍</span>
            <input
              type="search"
              placeholder="Search venues, artists, works…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: 15, color: 'var(--gray-900)', fontFamily: 'inherit',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--gray-400)', fontSize: 16, padding: 0, lineHeight: 1,
              }}>&#x2715;</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable content area ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {query.trim() ? (
        <div style={{ padding: '8px 20px 40px' }}>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>&#128269;</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6 }}>No results for &#8220;{query}&#8221;</div>
              <div style={{ fontSize: 13 }}>Try a venue name, artist, or artwork</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
              {searchResults.map(r => {
                const typeLabel = r.type === 'venue' ? 'Venue' : r.type === 'figure' ? 'Artist' : 'Work'
                const typeColor = r.type === 'venue' ? '#1a56db' : r.type === 'figure' ? '#7c3aed' : '#059669'
                const onPress = () => {
                  if (r.type === 'venue') push({ screen: 'venue', venueId: r.id })
                  else if (r.type === 'figure') push({ screen: 'figure', figureId: r.id })
                  else push({ screen: 'work', workId: r.id })
                }
                return (
                  <button key={r.type + ':' + r.id} onClick={onPress} style={{
                    width: '100%', background: 'var(--white)', border: '1px solid var(--gray-200)',
                    borderRadius: 12, padding: '13px 16px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                      color: typeColor, background: typeColor + '18', padding: '3px 8px', borderRadius: 20, flexShrink: 0,
                    }}>{typeLabel}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      {r.sub && <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 1 }}>{r.sub}</div>}
                    </div>
                    <div style={{ color: 'var(--gray-300)', fontSize: 20, flexShrink: 0 }}>&#8250;</div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {(() => {
            const domainColors = { jazz: '#C8823A', visual_art: '#5B7FA6', classical_music: '#7B6FA6', theater: '#A65B7B', sports: '#4A8C5C', architecture: '#8C6A4A', history: '#6A6A6A', hip_hop: '#3A3A8C' }
            // Hero rotation: if any picks have real photos, rotate only among those so first-impression always shows a photo.
            // Falls back to all picks if none have images yet.
            const picksWithImages = tonightPicks.filter(p => p.image)
            const heroCandidates = picksWithImages.length > 0 ? picksWithImages : tonightPicks
            const heroIndex = heroCandidates.length ? new Date().getDay() % heroCandidates.length : 0
            const heroPick = heroCandidates[heroIndex]
            const heroColor = heroPick ? (domainColors[heroPick.domain] || '#888') : '#888'
            const heroDomain = heroPick ? domains[heroPick.domain] : null
            const carouselPicks = tonightPicks.filter(p => p.id !== heroPick?.id).slice(0, 4)
            return (
              <>
                {/* ── HERO: tonight's lead pick ── */}
                {heroPick && (
                  <div style={{ padding: '16px 20px 4px' }}>
                    {/* Section label row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>
                        Tonight in NYC
                      </div>
                      <button onClick={onSeeAllTonight} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, color: 'var(--gray-500)',
                      }}>
                        See all ›
                      </button>
                    </div>
                    {/* Trust copy — single line, subtle */}
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 10, lineHeight: 1.4 }}>
                      Hand-picked by NYC editors · Refreshed weekly
                    </div>
                    <button
                      onClick={() => push({ screen: 'venue', venueId: heroPick.venueId })}
                      style={{
                        position: 'relative',
                        width: '100%', textAlign: 'left', cursor: 'pointer',
                        background: 'var(--white)',
                        border: '1px solid var(--gray-200)', borderRadius: 16,
                        padding: 0,
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                      }}>
                      {/* Save heart — absolute overlay top-right, sits above photo + content */}
                      {(() => {
                        const isHeroSaved = !!savedItems?.[`venue:${heroPick.venueId}`]
                        return (
                          <span
                            role="button"
                            tabIndex={-1}
                            aria-label={isHeroSaved ? 'Remove from saved' : 'Save'}
                            onClick={(e) => { e.stopPropagation(); toggleSave?.('venue', heroPick.venueId) }}
                            style={{
                              position: 'absolute', top: 12, right: 12, zIndex: 5,
                              cursor: 'pointer', userSelect: 'none',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 34, height: 34, borderRadius: 999,
                              background: isHeroSaved ? '#fee2e2' : 'rgba(0,0,0,0.32)',
                              backdropFilter: isHeroSaved ? 'none' : 'blur(6px)',
                              color: isHeroSaved ? '#dc2626' : 'rgba(255,255,255,0.96)',
                              fontSize: 18, lineHeight: 1,
                              boxShadow: isHeroSaved ? '0 1px 4px rgba(220,38,38,0.4)' : 'none',
                              transition: 'background 120ms ease, color 120ms ease',
                            }}>
                            {isHeroSaved ? '♥' : '♡'}
                          </span>
                        )
                      })()}
                      {/* Visual header — real photo if available, gradient + icon as fallback */}
                      {heroPick.image ? (
                        <div style={{
                          position: 'relative',
                          height: 168,
                          overflow: 'hidden',
                          background: '#0a0a0a',
                        }}>
                          <img
                            src={heroPick.image}
                            alt={heroPick.imageAlt || ''}
                            loading="eager"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                          {/* Bottom gradient for date-pill readability */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 45%)',
                            pointerEvents: 'none',
                          }} />
                          {/* Date note pinned bottom-right */}
                          <span style={{
                            position: 'absolute', right: 14, bottom: 12,
                            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.96)',
                            background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)',
                            padding: '5px 11px', borderRadius: 20,
                            letterSpacing: '0.02em',
                          }}>
                            {heroPick.dateNote}
                          </span>
                          {/* Tiny domain mark pinned top-left over the photo */}
                          <span style={{
                            position: 'absolute', left: 12, top: 12,
                            fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.96)',
                            background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)',
                            padding: '4px 9px', borderRadius: 20,
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                          }}>
                            <span>{heroDomain?.icon || '✨'}</span>
                            <span>{heroPick.domain.replace('_', ' ')}</span>
                          </span>
                        </div>
                      ) : (
                        <div style={{
                          position: 'relative',
                          height: 132,
                          background: `linear-gradient(135deg, ${heroColor} 0%, ${heroColor}CC 60%, ${heroColor}99 100%)`,
                          overflow: 'hidden',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22), transparent 55%)',
                          }} />
                          <div style={{
                            position: 'relative',
                            fontSize: 64, lineHeight: 1,
                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))',
                          }}>
                            {heroDomain?.icon || '✨'}
                          </div>
                          <span style={{
                            position: 'absolute', right: 14, bottom: 12,
                            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.92)',
                            background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)',
                            padding: '4px 10px', borderRadius: 20,
                            letterSpacing: '0.02em',
                          }}>
                            {heroPick.dateNote}
                          </span>
                        </div>
                      )}
                      {/* Content area — domain badge dropped (now lives on the photo as a chip; redundant under) */}
                      <div style={{ padding: '14px 18px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.25 }}>
                          {heroPick.title}
                        </div>
                        <div style={{
                          fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5, minHeight: 58,
                          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {heroPick.blurb}
                        </div>
                      </div>
                    </button>
                    {/* Learn-bridge: discreet link to the domain page for context/depth */}
                    {heroDomain && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button
                          onClick={() => push({ screen: 'domain', domainId: heroPick.domain })}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, color: heroColor,
                            padding: '4px 6px',
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}>
                          Read about {heroDomain.name.toLowerCase()} →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── More for tonight: smaller carousel ── */}
                {carouselPicks.length > 0 && (
                  <div style={{ padding: '14px 0 4px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', padding: '0 20px', marginBottom: 10 }}>
                      More for tonight
                    </div>
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
                      {carouselPicks.map(pick => {
                        const color = domainColors[pick.domain] || '#888'
                        const pickDomain = domains[pick.domain]
                        return (
                          <button key={pick.id}
                            onClick={() => push({ screen: 'venue', venueId: pick.venueId })}
                            style={{
                              flexShrink: 0, width: 180, background: 'var(--white)',
                              border: '1px solid var(--gray-200)', borderRadius: 14,
                              padding: 0, cursor: 'pointer', textAlign: 'left',
                              display: 'flex', flexDirection: 'column',
                              overflow: 'hidden',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            }}>
                            {/* Photo strip — real image, gradient + emoji fallback */}
                            <div style={{
                              width: '100%', height: 90,
                              background: pick.image ? '#0a0a0a' : `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                              position: 'relative',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              {pick.image ? (
                                <img src={pick.image} alt={pick.imageAlt || ''} loading="lazy"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                              ) : (
                                <span style={{ fontSize: 32, lineHeight: 1, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.2))' }}>
                                  {pickDomain?.icon || '✨'}
                                </span>
                              )}
                            </div>
                            {/* Content */}
                            <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                                <span style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  {pick.domain.replace('_', ' ')}
                                </span>
                              </div>
                              <div style={{
                                fontSize: 13, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.3,
                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                              }}>
                                {pick.title}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>
                                {pick.dateNote}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* ── Browse by topic / neighborhood — toggle pill + horizontal chip scroll ── */}
                <div style={{ padding: '20px 0 8px' }}>
                  {/* Section header row: small label + toggle pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12, gap: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>
                      Browse by
                    </div>
                    <div role="tablist" style={{
                      display: 'inline-flex', background: 'var(--gray-100)', borderRadius: 999, padding: 3,
                    }}>
                      {[
                        { id: 'topics',        label: 'Topics' },
                        { id: 'neighborhoods', label: 'Neighborhoods' },
                      ].map(opt => {
                        const isActive = browseBy === opt.id
                        return (
                          <button key={opt.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setBrowseBy(opt.id)}
                            style={{
                              border: 'none', cursor: 'pointer',
                              padding: '6px 14px', borderRadius: 999,
                              fontSize: 12, fontWeight: 700,
                              background: isActive ? 'var(--white)' : 'transparent',
                              color: isActive ? 'var(--gray-900)' : 'var(--gray-500)',
                              boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                              transition: 'background 120ms ease, color 120ms ease',
                            }}>
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Chip grid — equal-width 2-column grid so rows align cleanly, no orphan items. */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 8,
                    padding: '0 20px 4px',
                  }}>
                    {browseBy === 'topics' && Object.values(domains).map(domain => {
                      const count = (domain.venueIds || []).length
                      const tint = domainColors[domain.id] || 'var(--gray-500)'
                      return (
                        <button key={domain.id}
                          onClick={() => push({ screen: 'domain', domainId: domain.id })}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 12px 10px 12px',
                            borderRadius: 14,
                            background: 'var(--white)',
                            border: '1px solid var(--gray-200)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            cursor: 'pointer',
                            minWidth: 0, // allow children to shrink/ellipsize
                            width: '100%',
                            textAlign: 'left',
                          }}>
                          <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{domain.icon}</span>
                          <span style={{
                            fontSize: 13, fontWeight: 700, color: 'var(--gray-900)',
                            flex: 1, minWidth: 0,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{domain.name}</span>
                          {count > 0 && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, color: tint,
                              background: tint + '18',
                              padding: '2px 7px', borderRadius: 999,
                              flexShrink: 0,
                            }}>{count}</span>
                          )}
                        </button>
                      )
                    })}

                    {browseBy === 'neighborhoods' && NEIGHBORHOOD_GROUPS.map(grp => {
                      const count = getNeighborhoodVenues(grp.key, venues).length
                      return (
                        <button key={grp.key}
                          onClick={() => push({ screen: 'neighborhood', neighborhoodKey: grp.key })}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 12px 10px 12px',
                            borderRadius: 14,
                            background: 'var(--white)',
                            border: '1px solid var(--gray-200)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            cursor: 'pointer',
                            opacity: count > 0 ? 1 : 0.55,
                            minWidth: 0,
                            width: '100%',
                            textAlign: 'left',
                          }}>
                          <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{grp.emoji}</span>
                          <span style={{
                            fontSize: 13, fontWeight: 700, color: 'var(--gray-900)',
                            flex: 1, minWidth: 0,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{grp.label}</span>
                          {count > 0 && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, color: 'var(--gray-600)',
                              background: 'var(--gray-100)',
                              padding: '2px 7px', borderRadius: 999,
                              flexShrink: 0,
                            }}>{count}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ── Footer — gives the scroll a real ending ── */}
                <div style={{
                  marginTop: 28,
                  padding: '20px 20px 32px',
                  borderTop: '1px solid var(--gray-100)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-700)', letterSpacing: '0.04em' }}>
                    NYC Tonight
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4, lineHeight: 1.5 }}>
                    A handcrafted guide to the city&apos;s culture.<br />
                    New picks every week.
                  </div>
                </div>
              </>
            )
          })()}
        </>
      )}
      </div>{/* end scrollable content */}
    </div>
  )
}
// ── Domain Screen ─────────────────────────────────────────────────────────
function DomainScreen({ domainId, push, savedItems = {} }) {
  const domain = domains[domainId]

  // Sports (and future venueFirst domains): go straight to venue cards
  if (domain.venueFirst) {
    const hasGroups = domain.venueGroups?.length > 0
    const domainVenues = (domain.venueIds || []).map(id => venues[id]).filter(Boolean)
    return (
      <div className="screen">
        <div className="section">
          <p className="meta">{domain.icon} {domain.name}</p>
          <h1 className="display" style={{ marginTop: 8 }}>Where do you want to go?</h1>
          <p style={{ marginTop: 10, fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.5 }}>
            {domain.description}
          </p>
        </div>

        {hasGroups ? (
          <div style={{ padding: '4px 20px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {domain.venueGroups.map((group, idx) => (
              <button
                key={group.name || group.label || idx}
                onClick={() => push({ screen: 'venueGroup', domainId, groupIndex: idx })}
                style={{
                  width: '100%',
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 14,
                  padding: '18px 20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--gray-900)', marginBottom: 4 }}>
                    {group.name || group.label}
                  </div>
                  {(group.description || group.note) && (
                    <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                      {group.description || group.note}
                    </div>
                  )}
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--gray-400)' }}>
                    {group.venueIds.length} {group.venueIds.length === 1 ? 'site' : 'sites'}
                  </div>
                </div>
                <div style={{ color: 'var(--gray-300)', fontSize: 22, flexShrink: 0 }}>›</div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ padding: '4px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {domainVenues.map(v => (
              <VenueTapCard
                key={v.id}
                venue={v}
                isSaved={!!savedItems[`venue:${v.id}`]}
                onPress={() => push({ screen: 'venue', venueId: v.id, fromDomainId: domainId })}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Interest-first domains (Visual Art, Jazz, Classical)
  const domainTopics = domain.topicIds.map(id => topics[id]).filter(Boolean)
  return (
    <div className="screen">
      <div className="section">
        <p className="meta">{domain.icon} {domain.name}</p>
        <h1 className="display" style={{ marginTop: 8 }}>What draws you in?</h1>
      </div>

      <div className="card-list">
        {domainTopics.map(topic => (
          <button
            key={topic.id}
            className="card"
            onClick={() => push({ screen: 'topic', topicId: topic.id })}
          >
            <div className="card-body">
              <div className="card-name">{topic.name}</div>
              {topic.years && <div className="card-meta">{topic.years}</div>}
              <div className="card-tagline">{topic.tagline}</div>
            </div>
          </button>
        ))}

        {domain.comingSoon && domain.comingSoon.length > 0 && (
          <>
            <div className="section-label" style={{ marginBottom: 0, paddingTop: 8 }}>More — coming soon</div>
            {domain.comingSoon.map(name => (
              <div key={name} className="card" style={{ opacity: 0.4, cursor: 'default', pointerEvents: 'none' }}>
                <div className="card-body">
                  <div className="card-name">{name}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ── Interest Screen (Topic) ───────────────────────────────────────────────
// New flow: prose intro → venue cards → figures (if any)
function TopicScreen({ topicId, push, savedItems = {} }) {
  const topic = topics[topicId]
  const topicVenues = (topic.venueIds || []).map(id => venues[id]).filter(Boolean)
  const topicFigures = (topic.figureIds || []).map(id => figures[id]).filter(Boolean)
  const descParagraphs = (topic.description || topic.primer || '').split('\n\n')
  const isTheaterTopic = topic.domainId === 'theater'

  // Theater: collect all shows from this topic's figures (deduplicated, sorted by year)
  const theaterShows = isTheaterTopic
    ? [...new Map(
        topicFigures
          .flatMap(fig => (fig.workIds || []).map(id => works[id]).filter(Boolean))
          .map(w => [w.id, w])
      ).values()].sort((a, b) => parseInt(a.year) - parseInt(b.year))
    : []

  // Figures card list
  const figuresSection = topicFigures.length > 0 && (
    <div className="card-list" style={{ paddingTop: 0 }}>
      {topicFigures.map(figure => (
        <button
          key={figure.id}
          className="figure-card"
          style={{ position: 'relative' }}
          onClick={() => push({ screen: 'figure', figureId: figure.id })}
        >
          <ImgWithFallback
            className="figure-avatar"
            src={figure.imageUrl}
            alt={figure.name}
          />
          <div className="figure-card-text">
            <div className="figure-card-name">{figure.name}</div>
            <div className="figure-card-years">{figure.years}{figure.nationality ? ` · ${figure.nationality}` : ''}</div>
            <div className="figure-card-tagline">{figure.tagline}</div>
          </div>
          <div className="figure-card-arrow">›</div>
        </button>
      ))}
    </div>
  )

  // Venues card list
  const venuesSection = topicVenues.length > 0 && (
    <div style={{ padding: '4px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {topicVenues.map(v => (
        <VenueTapCard
          key={v.id}
          venue={v}
          isSaved={!!savedItems[`venue:${v.id}`]}
          onPress={() => push({ screen: 'venue', venueId: v.id, fromTopicId: topicId })}
        />
      ))}
    </div>
  )

  return (
    <div className="screen">
      <div className="topic-intro">
        {topic.years && <div className="topic-years">{topic.years}</div>}
        <div className="topic-name">{topic.name}</div>
        <div className="topic-description">
          {descParagraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      {isTheaterTopic ? (
        // Theater: shows first, then playwrights, then theaters
        <>
          {theaterShows.length > 0 && (
            <>
              <div className="section" style={{ paddingBottom: 4 }}>
                <div className="section-label">Broadway shows</div>
              </div>
              <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
                {theaterShows.map(work => {
                  const fig = figures[work.figureId]
                  const venue = venues[work.venueId]
                  return (
                    <button
                      key={work.id}
                      className="card"
                      style={{ position: 'relative' }}
                      onClick={() => push({ screen: 'work', workId: work.id })}
                    >
                      <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                      <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                      <div className="card-body">
                        <div className="card-name">{work.title}</div>
                        <div className="card-meta">{work.year} · {venue?.name || ''}</div>
                        <div style={{ marginTop: 5 }}>
                          {work.currentlyRunning
                            ? <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.03em' }}>🟢 Running now</span>
                            : <span style={{ background: '#f3f4f6', color: '#9ca3af', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>Historic</span>
                          }
                        </div>
                        {fig && <div className="card-tagline" style={{ marginTop: 2, fontSize: 12, color: 'var(--gray-500)' }}>{fig.name}</div>}
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="divider" style={{ marginTop: 16 }} />
            </>
          )}
          {topicFigures.length > 0 && (
            <>
              <div className="section" style={{ paddingBottom: 4 }}>
                <div className="section-label">Playwrights & composers</div>
              </div>
              {figuresSection}
              <div className="divider" style={{ marginTop: 8 }} />
            </>
          )}
          {topicVenues.length > 0 && (
            <>
              <div className="section" style={{ paddingBottom: 4 }}>
                <div className="section-label">The theaters</div>
              </div>
              {venuesSection}
            </>
          )}
        </>
      ) : (
        // Default: venues first, figures second
        <>
          {topicVenues.length > 0 && (
            <div style={{ padding: '4px 20px 32px' }}>
              <div className="section-label" style={{ marginBottom: 14 }}>
                Where to experience it in NYC
              </div>
              {venuesSection}
            </div>
          )}
          {topicFigures.length > 0 && (
            <>
              <div className="divider" />
              <div className="section">
                <div className="section-label">Key figures</div>
              </div>
              {figuresSection}
            </>
          )}
        </>
      )}
    </div>
  )
}

// ── Venue Screen ──────────────────────────────────────────────────────────
function VenueScreen({ venueId, fromTopicId, fromDomainId, push, savedItems = {}, toggleSave = () => {}, onViewMap = null, editorialCallout = null }) {
  const venue = venues[venueId]
  const colors = venueColors[venueId] || { bg: '#111', text: '#fff' }

  const fromTopic = fromTopicId ? topics[fromTopicId] : null
  const domainId = fromTopic?.domainId || fromDomainId

  const isVisualArt    = domainId === 'visual_art'
  const isSports       = domainId === 'sports'
  const isPerformance  = domainId === 'jazz' || domainId === 'classical_music'
  const isArchitecture = domainId === 'architecture'
  const isTheater      = domainId === 'theater'
  const isHistory      = domainId === 'history'

  const [justAdded, setJustAdded] = React.useState(false)

  // Works at this venue
  const worksHere = getWorksAtVenue(venueId)

  // Visual art: filter by source interest's figureIds
  let filteredWorks = worksHere
  if (isVisualArt && fromTopic?.figureIds?.length) {
    const figSet = new Set(fromTopic.figureIds)
    filteredWorks = worksHere.filter(w => figSet.has(w.figureId))
  }

  // Sports: group figures by sport (topic)
  const sportGroups = []
  if (isSports && worksHere.length > 0) {
    const byTopic = {}
    worksHere.forEach(w => {
      const fig = figures[w.figureId]
      if (!fig) return
      if (!byTopic[fig.topicId]) byTopic[fig.topicId] = new Set()
      byTopic[fig.topicId].add(fig.id)
    })
    Object.entries(byTopic).forEach(([tid, figIds]) => {
      const t = topics[tid]
      if (t) sportGroups.push({ topic: t, figs: [...figIds].map(id => figures[id]).filter(Boolean) })
    })
  }

  // Performance venues: curated figures associated with this room
  const venueFigures = isPerformance && venue.figureIds?.length
    ? venue.figureIds.map(id => figures[id]).filter(Boolean)
    : []

  // Architecture: curated architects associated with this building
  const venueArchitects = isArchitecture && venue.figureIds?.length
    ? venue.figureIds.map(id => figures[id]).filter(Boolean)
    : []

  // Architecture: features (works) at this building
  const archFeatures = isArchitecture ? worksHere : []

  // Theater: productions + playwrights/composers
  const theaterWorks = isTheater ? worksHere : []
  const theaterFigures = isTheater && venue.figureIds?.length
    ? venue.figureIds.map(id => figures[id]).filter(Boolean)
    : []

  // History: events + key figures
  const historyWorks = isHistory ? worksHere : []
  const historyFigures = isHistory && venue.figureIds?.length
    ? venue.figureIds.map(id => figures[id]).filter(Boolean)
    : []

  // Related venues (shared interest, not self)
  const relatedVenues = isPerformance || isVisualArt || isArchitecture || isTheater || isHistory
    ? getRelatedVenues(venueId).slice(0, 3)
    : []

  return (
    <div className="screen">

      {/* ── Colored header ── */}
      <div style={{
        background: colors.bg,
        color: colors.text,
        padding: '28px 20px 22px',
        position: 'relative',
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, marginBottom: 4, paddingRight: 92 }}>
          {venue.name}
        </div>
        {venue.fullName && venue.fullName !== venue.name && (
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6, paddingRight: 92 }}>{venue.fullName}</div>
        )}
        <div style={{ fontSize: 13, opacity: 0.75 }}>📍 {venue.neighborhood}</div>
        {/* Action buttons — normalized share + save pill pair, top-right */}
        <div style={{ position: 'absolute', top: 18, right: 16, display: 'flex', gap: 6 }}>
          <button
            onClick={() => {
              const shareText = `${venue.name}${venue.neighborhood ? ' · ' + venue.neighborhood : ''}`
              const shareData = { title: venue.name, text: shareText, url: typeof window !== 'undefined' ? window.location.href : '' }
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share(shareData).catch(() => {})
              } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(`${shareText}\n${shareData.url}`).catch(() => {})
              }
            }}
            aria-label="Share venue"
            style={{
              background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)', border: 'none',
              borderRadius: 999, width: 36, height: 36,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: colors.text, lineHeight: 1, fontSize: 15, fontWeight: 700,
            }}
          >↗</button>
          {(() => {
            const isSaved = !!savedItems[`venue:${venueId}`]
            return (
              <button
                onClick={() => toggleSave('venue', venueId)}
                aria-label={isSaved ? 'Remove from saved' : 'Save venue'}
                style={{
                  background: isSaved ? '#fee2e2' : 'rgba(255,255,255,0.22)',
                  backdropFilter: isSaved ? 'none' : 'blur(6px)',
                  border: 'none',
                  borderRadius: 999, width: 36, height: 36,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: isSaved ? '#dc2626' : colors.text,
                  lineHeight: 1, fontSize: 18,
                  transition: 'background 120ms ease, color 120ms ease',
                }}
              >
                {isSaved ? '♥' : '♡'}
              </button>
            )
          })()}
        </div>
      </div>

      {/* ── Editorial callout — only when arriving from a Tonight pick. Carries the curation voice through. ── */}
      {editorialCallout && (
        <div style={{
          margin: '16px 20px 4px',
          padding: '14px 16px 14px 16px',
          background: 'var(--gray-50, #fafafa)',
          border: '1px solid var(--gray-200)',
          borderLeft: `3px solid ${colors.bg}`,
          borderRadius: 10,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--gray-500)',
          }}>
            ✨ Why NYC Tonight picked this
          </div>
          <div style={{
            fontSize: 14, lineHeight: 1.55, color: 'var(--gray-800)', fontStyle: 'italic',
          }}>
            {editorialCallout}
          </div>
        </div>
      )}

      {/* ── Playing Now card ── */}
      {venue.nowPlaying && !venue.nowPlaying.isDark && (
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{
            background: '#0d1117',
            borderRadius: 14,
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>🎭 Playing now</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 5 }}>{venue.nowPlaying.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 14, lineHeight: 1.5 }}>{venue.nowPlaying.tagline}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', flexShrink: 1 }}>{venue.nowPlaying.through}</span>
              <a
                href={venue.nowPlaying.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 700,
                  padding: '9px 18px', borderRadius: 8, textDecoration: 'none',
                  flexShrink: 0, display: 'inline-block',
                }}
              >Book tickets →</a>
            </div>
          </div>
        </div>
      )}
      {venue.nowPlaying?.isDark && (
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{
            background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
            borderRadius: 14, padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Currently dark</div>
              <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.45 }}>{venue.nowPlaying.tagline}</div>
            </div>
            <a
              href={venue.nowPlaying.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: 'var(--gray-600)', textDecoration: 'underline', flexShrink: 0 }}
            >Schedule →</a>
          </div>
        </div>
      )}


      {/* ── Weekly Schedule ── */}
      {venue.weeklySchedule && venue.weeklySchedule.length > 0 && (() => {
        const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        const todayName = DAY_NAMES[new Date().getDay()]
        // Group entries by day preserving order Sun→Sat starting from today
        const dayOrder = [...Array(7)].map((_, i) => DAY_NAMES[(new Date().getDay() + i) % 7])
        const grouped = {}
        venue.weeklySchedule.forEach(e => {
          if (!grouped[e.day]) grouped[e.day] = []
          grouped[e.day].push(e)
        })
        const days = dayOrder.filter(d => grouped[d]).slice(0, 3)
        return (
          <div style={{ padding: '14px 16px 0' }}>
            <div style={{
              background: 'var(--gray-50)', borderRadius: 14, padding: '14px 16px',
              border: '1px solid var(--gray-100)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  Upcoming
                </div>
                {venue.weeklySchedule.some(e => !e.isAnchor) && (
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                    Bookings change weekly
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {days.map(day => (
                  <div key={day}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: day === todayName ? colors.bg : 'var(--gray-700)' }}>{day}</div>
                      {day === todayName && (
                        <div style={{ fontSize: 10, fontWeight: 800, background: colors.bg, color: colors.text, borderRadius: 20, padding: '2px 8px', letterSpacing: '0.05em' }}>
                          TONIGHT
                        </div>
                      )}
                    </div>
                    {grouped[day].every(e => e.performer === 'Featured artist') ? (
                      /* All slots are variable — collapse to a single website link */
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)', minWidth: 58, flexShrink: 0 }}>
                          {grouped[day][0].time}
                        </div>
                        <div style={{ flex: 1 }}>
                          <a
                            href={venue.scheduleUrl || venue.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 13, color: 'var(--gray-500)', textDecoration: 'none' }}
                          >
                            {grouped[day].length > 1
                              ? `Sets ${grouped[day].map(e => e.time).join(' & ')}`
                              : `Doors ${grouped[day][0].time}`
                            }
                            {' · Lineup at '}
                            {(() => { try { return new URL(venue.scheduleUrl || venue.ticketUrl || '').hostname.replace('www.', '') } catch { return 'website' } })()}
                            {' →'}
                          </a>
                        </div>
                      </div>
                    ) : (
                      grouped[day].map((entry, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '4px 0', borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)' }}>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)', minWidth: 58, flexShrink: 0, paddingTop: 1 }}>{entry.time}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: entry.isAnchor ? 700 : 500, color: 'var(--gray-900)' }}>
                              {entry.performer}
                              {entry.isAnchor && <span style={{ color: colors.bg, marginLeft: 6, fontSize: 11 }}>●</span>}
                            </div>
                            {entry.note && <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2, lineHeight: 1.4 }}>{entry.note}</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
              <a
                href={venue.scheduleUrl || venue.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  marginTop: 14, padding: '9px 0', borderRadius: 10,
                  background: colors.bg + '18',
                  fontSize: 13, color: colors.bg, fontWeight: 700, textDecoration: 'none',
                  border: `1px solid ${colors.bg}30`,
                }}
              >
                <span>🗓</span>
                <span>See live schedule & tickets</span>
                <span style={{ fontSize: 16, lineHeight: 1 }}>›</span>
              </a>
            </div>
          </div>
        )
      })()}

      {/* ── Character prose ── */}
      <div className="section" style={{ paddingTop: 22, paddingBottom: 8 }}>
        <div style={{ fontSize: 15, lineHeight: 1.72, color: 'var(--gray-700)' }}>
          {venue.character}
        </div>
      </div>

      {/* ── Specialties chips ── */}
      {venue.specialties?.length > 0 && (
        <div style={{ padding: '4px 20px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {venue.specialties.map(s => (
            <span key={s} style={{
              background: colors.bg,
              color: colors.text,
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 20,
              opacity: 0.85,
              letterSpacing: '0.02em',
            }}>{s}</span>
          ))}
        </div>
      )}

      <div className="divider" />

      {/* ── Plan Your Visit ── */}
      {(venue.admissionCost || venue.visitDuration || venue.bookingNote || venue.insiderTip) && (
        <div className="section" style={{ paddingTop: 20, paddingBottom: 4 }}>
          <div className="section-label">Plan your visit</div>
          <div style={{
            background: 'var(--gray-50)',
            border: '1px solid var(--gray-200)',
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {venue.admissionCost && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>💰</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admission</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-800)', marginTop: 2 }}>{venue.admissionCost}</div>
                </div>
              </div>
            )}
            {venue.visitDuration && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>⏱</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Time needed</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-800)', marginTop: 2 }}>{venue.visitDuration}</div>
                </div>
              </div>
            )}
            {venue.bookingNote && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>📅</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Booking</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-800)', marginTop: 2 }}>{venue.bookingNote}</div>
                </div>
              </div>
            )}
            {venue.insiderTip && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', borderTop: '1px solid var(--gray-200)', paddingTop: 12, marginTop: 2 }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>💡</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Insider tip</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-800)', marginTop: 2, lineHeight: 1.6 }}>{venue.insiderTip}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CTA buttons ── */}
      <div className="section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* ── Primary: Add to My Trip ── */}
          {(() => {
            const isSaved = !!savedItems[`venue:${venueId}`]
            return (
              <button
                className="venue-btn"
                onClick={() => {
                  toggleSave('venue', venueId)
                  if (!isSaved) { setJustAdded(true); setTimeout(() => setJustAdded(false), 2000) }
                }}
                style={isSaved ? { background: '#1a1a1a', opacity: 0.75 } : {}}
              >
                {isSaved ? '✓ Saved to My Trip' : justAdded ? '✓ Added to My Trip!' : '+ Add to My Trip'}
              </button>
            )
          })()}

          {/* ── Buy tickets (paid venues only) ── */}
          {venue.ticketUrl && !(venue.admissionCost || '').toLowerCase().startsWith('free') && (
            <a
              href={venue.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-btn"
              style={{ background: 'var(--gray-100)', color: 'var(--gray-800)', border: '1px solid var(--gray-200)' }}
            >
              {isPerformance || isTheater || isSports ? 'Buy tickets →' : 'Buy tickets →'}
            </a>
          )}

          {/* ── See schedule (performance/theater/sports with separate schedule URL) ── */}
          {(isPerformance || isTheater || isSports) && venue.scheduleUrl && venue.scheduleUrl !== venue.ticketUrl && (
            <a
              href={venue.scheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-btn"
              style={{ background: 'var(--gray-100)', color: 'var(--gray-800)', border: '1px solid var(--gray-200)' }}
            >
              {isPerformance ? 'See upcoming shows →' : isTheater ? "See what's playing →" : 'See schedule →'}
            </a>
          )}

          {/* ── Address ── */}
          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-btn"
          >
            📍 {venue.address}
          </a>

          {/* ── View on in-app map ── */}
          {onViewMap && venueCoords[venueId] && (
            <button
              onClick={onViewMap}
              className="venue-btn"
              style={{ background: 'var(--gray-100)', color: 'var(--gray-800)', border: '1px solid var(--gray-200)' }}
            >
              🗺️ View on Map
            </button>
          )}

          {/* ── Official site (small text link, always shown if URL exists) ── */}
          {(venue.ticketUrl || venue.scheduleUrl) && (
            <a
              href={venue.ticketUrl || venue.scheduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', textDecoration: 'none', paddingTop: 2 }}
            >
              Official site ↗
            </a>
          )}

        </div>
        {venue.hours && (
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>🕐 {venue.hours}</div>
        )}
      </div>

      {/* ── Sports: what to see in building ── */}
      {isSports && venue.whatToSeeInBuilding?.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section">
            <div className="section-label">What to see in the building</div>
            <div className="look-for-list">
              {venue.whatToSeeInBuilding.map((item, i) => (
                <div key={i} className="look-for-item">
                  <div className="look-for-num">{i + 1}</div>
                  <div className="look-for-text">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Sports: legends by sport ── */}
      {isSports && sportGroups.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          {sportGroups.map(({ topic, figs }) => (
            <div key={topic.id}>
              <div className="section" style={{ paddingBottom: 4 }}>
                <div className="section-label">{topic.name} legends</div>
              </div>
              <div className="card-list" style={{ paddingTop: 0, paddingBottom: 4 }}>
                {figs.map(fig => (
                  <button
                    key={fig.id}
                    className="figure-card"
                    style={{ position: 'relative' }}
                    onClick={() => push({ screen: 'figure', figureId: fig.id })}
                  >
                                        <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                    <div className="figure-card-text">
                      <div className="figure-card-name">{fig.name}</div>
                      <div className="figure-card-years">{fig.years}</div>
                      <div className="figure-card-tagline">{fig.tagline}</div>
                    </div>
                    <div className="figure-card-arrow">›</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── Architecture: key features of the building ── */}
      {isArchitecture && archFeatures.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">What to look for</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
            {archFeatures.map(work => {
              const fig = figures[work.figureId]
              return (
                <button
                  key={work.id}
                  className="card"
                  style={{ position: 'relative' }}
                  onClick={() => push({ screen: 'work', workId: work.id })}
                >
                  <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                  <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                  <div className="card-body">
                    <div className="card-name">{work.title}</div>
                    <div className="card-meta">{work.year} · {work.medium}</div>
                    {work.description && (
                      <div className="card-tagline" style={{ marginTop: 4, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                        {work.description.length > 100 ? work.description.slice(0, 100) + '…' : work.description}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── Architecture: the architects ── */}
      {isArchitecture && venueArchitects.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">
              {venueArchitects.length === 1 ? 'The architect' : 'The architects'}
            </div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, paddingBottom: 8 }}>
            {venueArchitects.map(fig => (
              <button
                key={fig.id}
                className="figure-card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'figure', figureId: fig.id })}
              >
                                <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                <div className="figure-card-text">
                  <div className="figure-card-name">{fig.name}</div>
                  <div className="figure-card-years">{fig.years} · {fig.nationality}</div>
                  <div className="figure-card-tagline">{fig.tagline}</div>
                </div>
                <div className="figure-card-arrow">›</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Theater: notable productions ── */}
      {isTheater && theaterWorks.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">Notable productions</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
            {theaterWorks.map(work => (
              <button
                key={work.id}
                className="card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'work', workId: work.id })}
              >
                <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                <div className="card-body">
                  <div className="card-name">{work.title}</div>
                  <div className="card-meta">{work.year} · {work.medium}</div>
                  {work.description && (
                    <div className="card-tagline" style={{ marginTop: 4, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                      {work.description.length > 100 ? work.description.slice(0, 100) + '…' : work.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Theater: playwrights & composers ── */}
      {isTheater && theaterFigures.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">Playwrights & composers</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, paddingBottom: 8 }}>
            {theaterFigures.map(fig => (
              <button
                key={fig.id}
                className="figure-card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'figure', figureId: fig.id })}
              >
                                <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                <div className="figure-card-text">
                  <div className="figure-card-name">{fig.name}</div>
                  <div className="figure-card-years">{fig.years}</div>
                  <div className="figure-card-tagline">{fig.tagline}</div>
                </div>
                <div className="figure-card-arrow">›</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── History: what happened here ── */}
      {isHistory && historyWorks.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">What happened here</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
            {historyWorks.map(work => (
              <button
                key={work.id}
                className="card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'work', workId: work.id })}
              >
                <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                <div className="card-body">
                  <div className="card-name">{work.title}</div>
                  <div className="card-meta">{work.year}</div>
                  {work.description && (
                    <div className="card-tagline" style={{ marginTop: 4, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                      {work.description.length > 100 ? work.description.slice(0, 100) + '…' : work.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── History: key figures ── */}
      {isHistory && historyFigures.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">Key figures</div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, paddingBottom: 8 }}>
            {historyFigures.map(fig => (
              <button
                key={fig.id}
                className="figure-card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'figure', figureId: fig.id })}
              >
                                <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                <div className="figure-card-text">
                  <div className="figure-card-name">{fig.name}</div>
                  <div className="figure-card-years">{fig.years}</div>
                  <div className="figure-card-tagline">{fig.tagline}</div>
                </div>
                <div className="figure-card-arrow">›</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Performance venues: notable musicians / composers ── */}
      {isPerformance && venueFigures.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">
              {domainId === 'jazz' ? 'Musicians who\'ve defined this room' : 'Composers performed here'}
            </div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, paddingBottom: 8 }}>
            {venueFigures.map(fig => (
              <button
                key={fig.id}
                className="figure-card"
                style={{ position: 'relative' }}
                onClick={() => push({ screen: 'figure', figureId: fig.id })}
              >
                                <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                <div className="figure-card-text">
                  <div className="figure-card-name">{fig.name}</div>
                  <div className="figure-card-years">{fig.years} · {fig.nationality}</div>
                  <div className="figure-card-tagline">{fig.tagline}</div>
                </div>
                <div className="figure-card-arrow">›</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Visual art: works at this venue in this interest ── */}
      {isVisualArt && filteredWorks.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div className="section" style={{ paddingBottom: 4 }}>
            <div className="section-label">
              {fromTopic ? `${fromTopic.name} works here` : 'Works in the collection'}
            </div>
          </div>
          <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
            {filteredWorks.map(work => {
              const fig = figures[work.figureId]
              return (
                <button
                  key={work.id}
                  className="card"
                  style={{ position: 'relative' }}
                  onClick={() => push({ screen: 'work', workId: work.id })}
                >
                  <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                  <ImgWithFallback className="card-image" src={work.imageUrl} alt={work.title} />
                  <div className="card-body">
                    <div className="card-name">{work.title}</div>
                    <div className="card-meta">{fig?.name} · {work.year}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── Related venues ── */}
      {relatedVenues.length > 0 && (
        <>
          <div className="divider" style={{ marginTop: 24 }} />
          <div style={{ padding: '16px 20px 40px' }}>
            <div className="section-label" style={{ marginBottom: 14 }}>
              {domainId === 'jazz' ? 'Other rooms worth knowing' : domainId === 'classical_music' ? 'Other venues for this repertoire' : domainId === 'architecture' ? 'Other buildings in this style' : 'Other venues to consider'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {relatedVenues.map(v => (
                <VenueTapCard
                  key={v.id}
                  venue={v}
                  onPress={() => push({ screen: 'venue', venueId: v.id, fromTopicId, fromDomainId })}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {!relatedVenues.length && <div style={{ height: 40 }} />}
      {/* ── Also nearby (cross-domain) ── */}
      {(() => {
        const domainLabels = {
          visual_art: 'Visual Art', jazz: 'Jazz', classical_music: 'Classical Music',
          sports: 'Sports', architecture: 'Architecture', theater: 'Theater',
          history: 'History', hip_hop: 'Hip-Hop',
        }
        const nearby = getNearbyAcrossDomains(venueId, 3)
        if (!nearby.length) return null
        return (
          <>
            <div className="divider" style={{ marginTop: 8 }} />
            <div style={{ padding: '16px 20px 40px' }}>
              <div className="section-label" style={{ marginBottom: 14 }}>Also nearby</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {nearby.map(({ id, venue: nv, domain: nd }) => {
                  const nc = venueColors[id] || { bg: '#111', text: '#fff' }
                  return (
                    <button
                      key={id}
                      onClick={() => push({ screen: 'venue', venueId: id, fromDomainId: nd })}
                      style={{
                        width: '100%', background: 'var(--white)', border: '1px solid var(--gray-100)',
                        borderRadius: 12, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                        background: nc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                      }}>
                        {nd === 'jazz' ? '🎷' : nd === 'classical_music' ? '🎻' : nd === 'visual_art' ? '🎨' : nd === 'sports' ? '🏟️' : nd === 'architecture' ? '🏛️' : nd === 'theater' ? '🎭' : nd === 'history' ? '📜' : '🎤'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{nv.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                          {domainLabels[nd]} · {nv.neighborhood}
                        </div>
                      </div>
                      <div style={{ color: 'var(--gray-300)', fontSize: 18 }}>›</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )
      })()}


    </div>
  )
}

// ── Figure Screen ─────────────────────────────────────────────────────────
function FigureScreen({ figureId, push, savedItems = {}, toggleSave = () => {} }) {
  const figure = figures[figureId]
  const figureWorks = (figure.workIds || []).map(id => works[id]).filter(Boolean)
  const primerParagraphs = (figure.primer || figure.description || '').split('\n\n')
  const figureDomain = topics[figure.topicId].domainId
  const isPerformance = ['jazz', 'classical_music'].includes(figureDomain)
  const isSportsFigure = figureDomain === 'sports'
  const isArchFigure = figureDomain === 'architecture'
  const isTheaterFigure = figureDomain === 'theater'
  const isHistoryFigure = figureDomain === 'history'

  const venueGroups = {}
  if (!isPerformance) {
    figureWorks.forEach(w => {
      if (!venueGroups[w.venueId]) venueGroups[w.venueId] = []
      venueGroups[w.venueId].push(w)
    })
  }

  return (
    <div className="screen">
      <div className="figure-hero" style={{ position: 'relative' }}>
        <ImgWithFallback
          className="figure-hero-img"
          src={figure.imageUrl}
          alt={figure.name}
        />
        {/* No save/share — a figure is reading material, not something you go visit. */}
        <div className="figure-hero-text">
          <div className="figure-hero-name">{figure.name}</div>
          <div className="figure-hero-meta">{figure.years}{figure.nationality ? ` · ${figure.nationality}` : ''}</div>
          <div className="figure-hero-tagline">{figure.tagline}</div>
        </div>
      </div>

      <div className="divider" />

      <div className="section">
        <div className="section-label">5-minute primer</div>
        <div className="primer-text">
          {primerParagraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="divider" style={{ marginTop: 28 }} />

      <div className="section">
        <div className="section-label">
          {isPerformance ? 'Hear it in NYC — pick a recording' : isSportsFigure ? 'Career highlights' : isArchFigure ? 'What they built in New York' : isTheaterFigure ? 'Notable productions' : isHistoryFigure ? 'Their story in NYC' : 'See it in NYC — pick a work'}
        </div>
      </div>

      {isPerformance ? (
        <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
          {figureWorks.map(work => (
            <button
              key={work.id}
              className="card"
              style={{ position: 'relative' }}
              onClick={() => push({ screen: 'work', workId: work.id })}
            >
              <SavedDot saved={!!savedItems[`work:${work.id}`]} />
              <ImgWithFallback
                className="card-image"
                src={work.imageUrl}
                alt={work.title}
              />
              <div className="card-body">
                <div className="card-name">{work.title}</div>
                <div className="card-meta">{work.year} · {work.medium}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        Object.entries(venueGroups).map(([venueId, venueWorks]) => {
          const venue = venues[venueId]
          return (
            <div key={venueId} style={{ marginBottom: 4 }}>
              <div style={{ padding: '12px 20px 8px', fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {venue.name}
              </div>
              <div className="card-list" style={{ paddingTop: 0, gap: 8 }}>
                {venueWorks.map(work => (
                  <button
                    key={work.id}
                    className="card"
                    style={{ position: 'relative' }}
                    onClick={() => push({ screen: 'work', workId: work.id })}
                  >
                    <SavedDot saved={!!savedItems[`work:${work.id}`]} />
                    <ImgWithFallback
                      className="card-image"
                      src={work.imageUrl}
                      alt={work.title}
                    />
                    <div className="card-body">
                      <div className="card-name">{work.title}</div>
                      <div className="card-meta">{work.year} · {venue.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// ── Work Screen ───────────────────────────────────────────────────────────
function WorkScreen({ workId, push, savedItems = {}, toggleSave = () => {} }) {
  const work = works[workId]
  const figure = figures[work.figureId]
  const nearby = getSeeAlsoNearby(workId)
  const topic = topics[figure.topicId]
  const isJazz = topic.domainId === 'jazz' || topic.domainId === 'classical_music'
  const isArchWork = ['architecture', 'theater', 'history'].includes(topic.domainId)

  const venue = !isJazz ? venues[work.venueId] : null

  return (
    <div className="screen">
      <ImgWithFallback
        className="hero-img"
        src={work.imageUrl}
        alt={work.title}
      />

      <div className="work-header" style={{ position: 'relative' }}>
        {/* Action buttons — normalized share + save pair, top-right of header (not on hero image, so gray styling) */}
        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 6 }}>
          <button
            onClick={() => {
              const shareText = `${work.title}${figure?.name ? ' — ' + figure.name : ''}${work.year ? ' (' + work.year + ')' : ''}`
              const shareData = { title: work.title, text: shareText, url: typeof window !== 'undefined' ? window.location.href : '' }
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share(shareData).catch(() => {})
              } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(`${shareText}\n${shareData.url}`).catch(() => {})
              }
            }}
            aria-label="Share work"
            style={{
              background: 'var(--gray-100)', border: 'none',
              borderRadius: 999, width: 36, height: 36,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gray-500)', lineHeight: 1, fontSize: 14, fontWeight: 700,
            }}
          >↗</button>
          {(() => {
            const isSaved = !!savedItems[`work:${workId}`]
            return (
              <button
                onClick={() => toggleSave('work', workId)}
                aria-label={isSaved ? 'Remove from saved' : 'Save work'}
                style={{
                  background: isSaved ? '#fee2e2' : 'var(--gray-100)',
                  border: 'none',
                  borderRadius: 999, width: 36, height: 36,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: isSaved ? '#dc2626' : 'var(--gray-500)',
                  lineHeight: 1, fontSize: 18,
                  transition: 'background 120ms ease, color 120ms ease',
                }}
              >
                {isSaved ? '♥' : '♡'}
              </button>
            )
          })()}
        </div>
        <div className="work-title-year">{work.year} · {figure.name}</div>
        <h1 className="display">{work.title}</h1>
        {topic.domainId === 'theater' && (
          <div style={{ marginTop: 10 }}>
            {work.currentlyRunning
              ? <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20 }}>🟢 Currently running</span>
              : (
                <>
                  <span style={{ background: '#f3f4f6', color: '#6b7280', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20 }}>
                    Original run: {work.year} · Historic production
                  </span>
                  {venue?.nowPlaying?.title && (
                    <div style={{
                      background: '#f0fdf4', border: '1px solid #bbf7d0',
                      borderRadius: 12, padding: '13px 16px', marginTop: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }}>Playing now at {venue.name}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.25 }}>{venue.nowPlaying.title}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{venue.nowPlaying.through}</div>
                      </div>
                      <a
                        href={venue.nowPlaying.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 700,
                          padding: '9px 14px', borderRadius: 8, textDecoration: 'none', flexShrink: 0,
                        }}
                      >Book →</a>
                    </div>
                  )}
                  {venue?.nowPlaying?.isDark && (
                    <div style={{
                      background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                      borderRadius: 12, padding: '12px 16px', marginTop: 12,
                    }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }}>At {venue?.name}</div>
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{venue.nowPlaying.tagline}</div>
                      <a href={venue.nowPlaying.bookingUrl} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: '#6b7280', textDecoration: 'underline', display: 'inline-block', marginTop: 6 }}>
                        Check upcoming schedule →
                      </a>
                    </div>
                  )}
                </>
              )
            }
          </div>
        )}
        <div className="work-medium">{work.medium} · {work.dimensions}</div>
      </div>

      <div className="section">
        <div className="body-text">
          {work.description}
        </div>
      </div>

      <div className="divider" style={{ marginTop: 24 }} />

      {isArchWork && work.significance ? (
        <div className="section">
          <div className="section-label">Why it matters</div>
          <div className="body-text">{work.significance}</div>
        </div>
      ) : work.whatToLookFor?.length > 0 ? (
        <div className="section">
          <div className="section-label">{isJazz ? 'What to listen for' : 'What to look for'}</div>
          <div className="look-for-list">
            {work.whatToLookFor.map((item, i) => (
              <div key={i} className="look-for-item">
                <div className="look-for-num">{i + 1}</div>
                <div className="look-for-text">{item}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="divider" style={{ marginTop: 24 }} />

      {!isJazz && venue && (
        <div className="section">
          <div className="section-label">{topic.domainId === 'architecture' ? 'The building' : topic.domainId === 'theater' ? 'The theater' : topic.domainId === 'history' ? 'The site' : 'Where to see it'}</div>
          <VenueCard venue={venue} />
        </div>
      )}

      {/* See Also */}
      <div className="see-also-block">
        <div className="see-also-title">{isJazz ? 'More in this tradition' : 'See also nearby'}</div>

        {nearby.otherByFigure.length > 0 && (
          <div className="see-also-group">
            <div className="see-also-group-label">More {figure.name} in NYC</div>
            <div className="card-row">
              {nearby.otherByFigure.map(w => (
                <button
                  key={w.id}
                  className="card-small"
                  style={{ position: 'relative' }}
                  onClick={() => push({ screen: 'work', workId: w.id })}
                >
                  <SavedDot saved={!!savedItems[`work:${w.id}`]} style={{ top: 6, right: 6, width: 18, height: 18, fontSize: 10 }} />
                  <ImgWithFallback className="card-small-img" src={w.imageUrl} alt={w.title} />
                  <div className="card-small-body">
                    <div className="card-small-name">{w.title}</div>
                    <div className="card-small-meta">{isJazz ? w.year : (venues[w.venueId]?.name + ' · ' + w.year)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isJazz && nearby.otherInTopic && nearby.otherInTopic.length > 0 && (
          <div className="see-also-group">
            <div className="see-also-group-label">
              Other {topic.name} {topic.domainId === 'jazz' ? 'albums' : 'works'}
            </div>
            <div className="card-row">
              {nearby.otherInTopic.slice(0, 4).map(w => {
                const wFig = figures[w.figureId]
                return (
                  <button
                    key={w.id}
                    className="card-small"
                    style={{ position: 'relative' }}
                    onClick={() => push({ screen: 'work', workId: w.id })}
                  >
                    <SavedDot saved={!!savedItems[`work:${w.id}`]} style={{ top: 6, right: 6, width: 18, height: 18, fontSize: 10 }} />
                    <ImgWithFallback className="card-small-img" src={w.imageUrl} alt={w.title} />
                    <div className="card-small-body">
                      <div className="card-small-name">{w.title}</div>
                      <div className="card-small-meta">{wFig.name} · {w.year}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {!isJazz && nearby.otherAtVenue.length > 0 && venue && (
          <div className="see-also-group">
            <div className="see-also-group-label">Also at {venue.name}</div>
            <div className="card-row">
              {nearby.otherAtVenue.slice(0, 4).map(w => {
                const wFig = figures[w.figureId]
                return (
                  <button
                    key={w.id}
                    className="card-small"
                    style={{ position: 'relative' }}
                    onClick={() => push({ screen: 'work', workId: w.id })}
                  >
                    <SavedDot saved={!!savedItems[`work:${w.id}`]} style={{ top: 6, right: 6, width: 18, height: 18, fontSize: 10 }} />
                    <ImgWithFallback className="card-small-img" src={w.imageUrl} alt={w.title} />
                    <div className="card-small-body">
                      <div className="card-small-name">{w.title}</div>
                      <div className="card-small-meta">{wFig.name} · {w.year}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {nearby.otherFigures.length > 0 && (
          <div className="see-also-group">
            <div className="see-also-group-label">
              Other {topic.name} {topic.domainId === 'jazz' ? 'musicians' : topic.domainId === 'classical_music' ? 'composers' : 'athletes'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nearby.otherFigures.slice(0, 3).map(fig => (
                <button
                  key={fig.id}
                  className="figure-card"
                  style={{ background: 'var(--white)', position: 'relative' }}
                  onClick={() => push({ screen: 'figure', figureId: fig.id })}
                >
                                    <ImgWithFallback className="figure-avatar" src={fig.imageUrl} alt={fig.name} />
                  <div className="figure-card-text">
                    <div className="figure-card-name">{fig.name}</div>
                    <div className="figure-card-years">{fig.years}</div>
                    <div className="figure-card-tagline">{fig.tagline}</div>
                  </div>
                  <div className="figure-card-arrow">›</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


// ── Venue Group Screen — buildings within a geographic cluster ────────────
function VenueGroupScreen({ domainId, groupIndex, push, savedItems = {} }) {
  const domain = domains[domainId]
  const group = domain.venueGroups?.[groupIndex]
  if (!group) return null
  const groupVenues = (group.venueIds || []).map(id => venues[id]).filter(Boolean)

  return (
    <div className="screen">
      <div className="section">
        <p className="meta">📍 {domain.name}</p>
        <h1 className="display" style={{ marginTop: 8 }}>{group.name || group.label}</h1>
        {(group.description || group.note) && (
          <p style={{ marginTop: 8, fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>
            {group.description || group.note}
          </p>
        )}
      </div>
      <div style={{ padding: '4px 20px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {groupVenues.map(v => (
          <VenueTapCard
            key={v.id}
            venue={v}
            isSaved={!!savedItems[`venue:${v.id}`]}
            onPress={() => push({ screen: 'venue', venueId: v.id, fromDomainId: domainId })}
          />
        ))}
      </div>
    </div>
  )
}

// ── NeighborhoodScreen — all venues in a single area ──────────────────────
function NeighborhoodScreen({ neighborhoodKey, subAreaName, push, savedItems = {} }) {
  const group = NEIGHBORHOOD_GROUPS.find(g => g.key === neighborhoodKey)
  if (!group) return null
  // If subAreaName is set, we're showing the focused view for a specific Brooklyn neighborhood (Williamsburg, etc.)
  let subAreaInfo = null
  if (subAreaName) {
    const subAreas = NEIGHBORHOOD_SUBAREAS[neighborhoodKey] || []
    for (const sa of subAreas) {
      const found = sa.areas.find(a => a.name === subAreaName)
      if (found) { subAreaInfo = { ...found, parentLabel: sa.label }; break }
    }
  }
  // Venue filter: focused sub-area → match only that neighborhood string; otherwise the parent's match.
  const nbVenues = subAreaInfo
    ? Object.values(venues).filter(v => v.neighborhood && new RegExp(escapeRegExp(subAreaName), 'i').test(v.neighborhood))
    : getNeighborhoodVenues(neighborhoodKey, venues)
  // Sub-areas only render at the parent-level view (not when already drilled into one).
  const subAreas = subAreaInfo ? null : (NEIGHBORHOOD_SUBAREAS[neighborhoodKey] || null)

  return (
    <div className="screen">
      <div className="section">
        {/* Breadcrumb meta — for sub-area view, show parent borough so users see the hierarchy */}
        <p className="meta">
          {subAreaInfo
            ? <>{group.emoji} {group.label} · {subAreaInfo.parentLabel}</>
            : <>{group.emoji} Neighborhood</>}
        </p>
        <h1 className="display" style={{ marginTop: 8 }}>{subAreaInfo ? subAreaInfo.name : group.label}</h1>
        {/* Sub-area's editorial description — only shown in focused view */}
        {subAreaInfo && (
          <p style={{ marginTop: 10, fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.55, fontStyle: 'italic' }}>
            {subAreaInfo.desc}
          </p>
        )}
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>
          {nbVenues.length === 0
            ? subAreaInfo
              ? `No venues catalogued in ${subAreaInfo.name} yet — tap + Add to save your own.`
              : 'No venues catalogued in this area yet — check back as the guide grows.'
            : `${nbVenues.length} venue${nbVenues.length !== 1 ? 's' : ''} to explore here.`}
        </p>
      </div>
      {nbVenues.length > 0 && (
        <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {nbVenues.map(v => (
            <VenueTapCard
              key={v.id}
              venue={v}
              isSaved={!!savedItems[`venue:${v.id}`]}
              onPress={() => push({ screen: 'venue', venueId: v.id })}
            />
          ))}
        </div>
      )}

      {/* Curated sights — only shown in focused sub-area view. Tap a row → opens Google Maps search for that place. */}
      {subAreaInfo && subAreaInfo.sights && subAreaInfo.sights.length > 0 && (
        <div style={{ padding: '8px 20px 40px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 12, gap: 8,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'var(--gray-500)',
            }}>
              Don&apos;t miss in {subAreaInfo.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
              {subAreaInfo.sights.length} pick{subAreaInfo.sights.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {subAreaInfo.sights.map((s, idx) => {
              const sId = sightIdOf(s.name)
              const isSaved = !!savedItems[`sight:${sId}`]
              return (
                <button
                  key={s.name}
                  onClick={() => push({ screen: 'sight', sightId: sId })}
                  style={{
                    width: '100%', position: 'relative',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 14px 14px 16px',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderTop: idx === 0 ? 'none' : '1px solid var(--gray-100)',
                    transition: 'background 120ms ease',
                  }}
                  onMouseDown={e => { e.currentTarget.style.background = 'var(--gray-50)' }}
                  onMouseUp={e => { e.currentTarget.style.background = 'transparent' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {s.name}
                      {isSaved && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#dc2626', background: '#fee2e2',
                          padding: '1px 6px', borderRadius: 999,
                        }}>♥</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--gray-300)', alignSelf: 'center', flexShrink: 0 }}>›</span>
                </button>
              )
            })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
            Tap any pick for details, insider tips, and to save it to your trip.
          </div>
        </div>
      )}

      {/* Sub-area cards — only at the parent level. Each row is now a button that drills into the sub-area. */}
      {subAreas && subAreas.length > 0 && (
        <div style={{ padding: '8px 20px 40px' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--gray-500)', marginBottom: 14,
          }}>
            {group.label} neighborhoods
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {subAreas.map(sa => (
              <div key={sa.key} style={{
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: 14,
                padding: '6px 6px 8px',
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: 'var(--gray-900)',
                  letterSpacing: '0.02em', padding: '8px 10px 10px',
                }}>
                  {sa.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {sa.areas.map((a, idx) => (
                    <button
                      key={a.name}
                      onClick={() => push({ screen: 'neighborhood', neighborhoodKey, subAreaName: a.name })}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 10px 10px 10px',
                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                        borderTop: idx === 0 ? 'none' : '1px solid var(--gray-100)',
                        width: '100%',
                        transition: 'background 120ms ease',
                      }}
                      onMouseDown={e => { e.currentTarget.style.background = 'var(--gray-50)' }}
                      onMouseUp={e => { e.currentTarget.style.background = 'none' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                    >
                      <span style={{ fontSize: 13, color: 'var(--gray-300)', marginTop: 1, flexShrink: 0 }}>📍</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>{a.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2, lineHeight: 1.45 }}>{a.desc}</div>
                      </div>
                      <span style={{ fontSize: 18, color: 'var(--gray-300)', alignSelf: 'center', flexShrink: 0 }}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
            Tap any neighborhood to focus on it — or hit <strong>+ Add</strong> below to save your own favorite spot.
          </div>
        </div>
      )}
    </div>
  )
}

// Small helper to safely use a user-provided string inside a RegExp (escapes special chars).
function escapeRegExp(s) {
  return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ── SightScreen — in-app detail page for sub-neighborhood sights. Built to match VenueScreen's
// visual richness (category-colored header, full description, colored tag chips, BOOKING row). ──
function SightScreen({ sightId, push, savedItems = {}, toggleSave = () => {} }) {
  const sight = ALL_SIGHTS[sightId]
  if (!sight) {
    return (
      <div className="screen">
        <div className="section">
          <h1 className="display">Sight not found</h1>
          <p style={{ marginTop: 10, fontSize: 14, color: 'var(--gray-500)' }}>
            That sight doesn&apos;t exist in our guide yet.
          </p>
        </div>
      </div>
    )
  }
  const isSaved = !!savedItems[`sight:${sight.id}`]
  // Category colors drive the header background + tag chips. Falls back to gray-900 if no match.
  const colors = SIGHT_CATEGORY_COLOR[sight.icon] || DEFAULT_SIGHT_COLOR
  // Google Maps deep link — works whether or not we have explicit coords.
  const mapsUrl = sight.lat && sight.lng
    ? `https://www.google.com/maps/?q=${sight.lat},${sight.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(sight.name + ', ' + sight.neighborhood + ', Brooklyn, New York')}`
  const hasPlanCard = sight.admission || sight.timeNeeded || sight.booking || sight.insiderTip
  // Prefer the longer editorial description when available; fall back to the short sub-area blurb.
  const description = sight.longDesc || sight.desc

  return (
    <div className="screen">
      {/* ── Colored header — uses category color, name as primary visual anchor (matches VenueScreen). ── */}
      <div style={{
        background: colors.bg,
        color: colors.text,
        padding: '28px 20px 22px',
        position: 'relative',
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, marginBottom: 6, paddingRight: 92 }}>
          {sight.name}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8, paddingRight: 92 }}>
          {sight.subArea} · Brooklyn
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          📍 {sight.neighborhood}
        </div>
        {/* Action buttons — normalized share + save pair, matches VenueScreen treatment. */}
        <div style={{ position: 'absolute', top: 18, right: 16, display: 'flex', gap: 6 }}>
          <button
            onClick={() => {
              const shareText = `${sight.name}${sight.neighborhood ? ' · ' + sight.neighborhood : ''} — ${sight.desc}`
              const shareData = { title: sight.name, text: shareText, url: typeof window !== 'undefined' ? window.location.href : '' }
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share(shareData).catch(() => {})
              } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(`${shareText}\n${shareData.url}`).catch(() => {})
              }
            }}
            aria-label="Share sight"
            style={{
              background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)', border: 'none',
              borderRadius: 999, width: 36, height: 36,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: colors.text, lineHeight: 1, fontSize: 15, fontWeight: 700,
            }}
          >↗</button>
          <button
            onClick={() => toggleSave('sight', sight.id)}
            aria-label={isSaved ? 'Remove from saved' : 'Save sight'}
            style={{
              background: isSaved ? '#fee2e2' : 'rgba(255,255,255,0.22)',
              backdropFilter: isSaved ? 'none' : 'blur(6px)', border: 'none',
              borderRadius: 999, width: 36, height: 36,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: isSaved ? '#dc2626' : colors.text, lineHeight: 1, fontSize: 18,
              transition: 'background 120ms ease, color 120ms ease',
            }}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        </div>
      </div>

      {/* Description — uses longDesc when available, falls back to short desc otherwise. */}
      <div className="section" style={{ paddingTop: 20, paddingBottom: 6 }}>
        <div style={{ fontSize: 15, color: 'var(--gray-700)', lineHeight: 1.7 }}>
          {description}
        </div>
      </div>

      {/* Tag chips — colored in the sight's category color (matches VenueScreen pattern). */}
      {sight.tags && sight.tags.length > 0 && (
        <div style={{ padding: '8px 20px 4px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sight.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 700, color: '#fff',
              background: colors.bg, padding: '5px 12px', borderRadius: 999,
            }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Plan Your Visit card — adds BOOKING row alongside admission / time / insider tip. */}
      {hasPlanCard && (
        <div className="section" style={{ paddingTop: 18 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--gray-500)', marginBottom: 12,
          }}>
            Plan your visit
          </div>
          <div style={{
            background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
            borderRadius: 14, padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            {sight.admission && (
              <DetailRow icon="💰" label="Admission" body={sight.admission} />
            )}
            {sight.timeNeeded && (
              <DetailRow icon="🕐" label="Time needed" body={sight.timeNeeded} />
            )}
            {sight.booking && (
              <DetailRow icon="📅" label="Booking" body={sight.booking} />
            )}
            {sight.insiderTip && (
              <>
                <div style={{ borderTop: '1px dashed var(--gray-200)' }} />
                <DetailRow icon="💡" label="Insider tip" body={sight.insiderTip} bodyStyle={{ lineHeight: 1.55 }} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Action buttons — primary save-to-trip + secondary helpers */}
      <div style={{ padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* + Add to My Trip — main CTA */}
        <button onClick={() => toggleSave('sight', sight.id)} style={{
          background: isSaved ? '#dcfce7' : 'var(--gray-900)',
          color: isSaved ? '#15803d' : '#fff',
          border: 'none', borderRadius: 12, padding: '14px',
          fontSize: 14, fontWeight: 800, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 120ms ease, color 120ms ease',
        }}>
          {isSaved ? <>✓ Added to My Trip</> : <>+ Add to My Trip</>}
        </button>

        {/* Official site (if URL is known) */}
        {sight.officialUrl && (
          <a href={sight.officialUrl} target="_blank" rel="noopener noreferrer" style={{
            background: 'var(--gray-100)', color: 'var(--gray-800)',
            border: '1px solid var(--gray-200)', borderRadius: 12, padding: '12px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            Official site ↗
          </a>
        )}

        {/* Address row + Maps button */}
        <div style={{
          background: 'var(--white)', border: '1px solid var(--gray-200)',
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13 }}>📍</span>
          <span style={{ fontSize: 13, color: 'var(--gray-700)', flex: 1 }}>
            {sight.name}, {sight.neighborhood}, Brooklyn
          </span>
        </div>

        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{
          background: 'var(--gray-100)', color: 'var(--gray-800)',
          border: '1px solid var(--gray-200)', borderRadius: 12, padding: '12px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          🗺️ View on Map
        </a>
      </div>

      {/* Bottom hint */}
      <div style={{ padding: '4px 20px 40px', fontSize: 11, color: 'var(--gray-400)', textAlign: 'center', fontStyle: 'italic' }}>
        Found something missing? Tap <strong>+ Add</strong> at the bottom to save your own pick.
      </div>
    </div>
  )
}

// Small helper for label/body rows inside the Plan-Your-Visit card. Used by SightScreen.
function DetailRow({ icon, label, body, bodyStyle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--gray-500)', marginBottom: 3,
        }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--gray-800)', lineHeight: 1.45, ...bodyStyle }}>{body}</div>
      </div>
    </div>
  )
}

// ── VenueTapCard — tappable card for InterestScreen / DomainScreen ────────
// Reusable saved-state indicator for figure/work/venue cards across inner screens.
// Render inside any card whose wrapper has position:relative (or add it). Returns null when not saved.
function SavedDot({ saved, style }) {
  if (!saved) return null
  return (
    <span aria-label="Saved" style={{
      position: 'absolute', top: 8, right: 8, zIndex: 2,
      width: 20, height: 20, borderRadius: '50%',
      background: '#fee2e2', color: '#dc2626',
      fontSize: 11, lineHeight: 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      pointerEvents: 'none',
      ...style,
    }}>♥</span>
  )
}

function VenueTapCard({ venue, onPress, isSaved = false }) {
  const colors = venueColors[venue.id] || { bg: '#111', text: '#fff' }
  const preview = venue.character?.length > 160
    ? venue.character.slice(0, 160).trimEnd() + '…'
    : (venue.character || '')

  return (
    <button
      style={{
        display: 'block', position: 'relative',
        width: '100%',
        border: '1px solid var(--gray-200)',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'var(--white)',
        cursor: 'pointer',
        textAlign: 'left',
        padding: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onClick={onPress}
    >
      {/* Saved indicator — read-only ♥ in top-right corner of the colored header. Lets users see what they've already collected when browsing. */}
      {isSaved && (
        <span aria-label="Saved" style={{
          position: 'absolute', top: 10, right: 12, zIndex: 2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: 999,
          background: '#fee2e2', color: '#dc2626',
          fontSize: 12, lineHeight: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}>♥</span>
      )}
      <div style={{
        background: colors.bg,
        color: colors.text,
        padding: '14px 16px 12px',
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 2, paddingRight: isSaved ? 32 : 0 }}>{venue.name}</div>
        {venue.fullName && venue.fullName !== venue.name && (
          <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>{venue.fullName}</div>
        )}
        <div style={{ fontSize: 12, opacity: 0.8 }}>{venue.neighborhood}</div>
      </div>
      <div style={{ padding: '12px 16px 14px' }}>
        {preview && (
          <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.55, marginBottom: 10 }}>
            {preview}
          </div>
        )}
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.bg }}>Explore →</div>
      </div>
    </button>
  )
}

// ── VenueCard — static detail card for WorkScreen ─────────────────────────
function VenueCard({ venue }) {
  const colors = venueColors[venue.id] || { bg: '#111', text: '#fff' }

  return (
    <div className="venue-card">
      <div className="venue-card-header" style={{ background: colors.bg }}>
        <div className="venue-name-badge">{venue.name}</div>
        <div className="venue-full-name">{venue.fullName}</div>
        <div className="venue-neighborhood">{venue.neighborhood}</div>
      </div>
      <div className="venue-card-body">
        <div className="venue-detail-row">
          <span className="venue-detail-icon">📍</span>
          <span>{venue.address}</span>
        </div>
        <div className="venue-detail-row">
          <span className="venue-detail-icon">🕐</span>
          <span>{venue.hours}</span>
        </div>
        <div className="venue-detail-row" style={{ borderBottom: 'none' }}>
          <span className="venue-detail-icon">ℹ️</span>
          <span>{venue.description}</span>
        </div>
        <a
          href={venue.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="venue-btn"
        >
          Get tickets & plan your visit →
        </a>
        <a
          href={venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-btn"
        >
          📍 Open in Maps
        </a>
      </div>
    </div>
  )
}

// ── App Root ──────────────────────────────────────────────────────────────

// ── Bottom Navigation Bar ─────────────────────────────────────────────────
function BottomNav({ activeTab, onTabPress, savedCount, onAddPlace }) {
  // 'add' is a special action item — fires onAddPlace() instead of switching tabs.
  const tabs = [
    { id: 'explore', icon: '🧭', label: 'Explore' },
    { id: 'map',     icon: '📍', label: 'Map' },
    { id: 'add',     icon: '➕', label: 'Add',     isAction: true },
    { id: 'tonight', icon: '🌙', label: 'Tonight' },
    { id: 'saved',   icon: '🗓️', label: 'My Trip' },
  ]
  return (
    <div style={{
      position: 'fixed', bottom: 0,
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      height: 60,
      background: 'var(--white)',
      borderTop: '1px solid var(--gray-200)',
      display: 'flex', zIndex: 200,
    }}>
      {tabs.map(({ id, icon, label, isAction }) => {
        const active = activeTab === id && !isAction
        const badge = id === 'saved' && savedCount > 0 ? savedCount : null
        const handleClick = isAction ? () => onAddPlace?.() : () => onTabPress(id)
        return (
          <button key={id} onClick={handleClick} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 2,
            background: 'none', border: 'none', cursor: 'pointer',
            color: active ? 'var(--gray-900)' : isAction ? 'var(--gray-600)' : 'var(--gray-400)',
            position: 'relative',
          }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : isAction ? 600 : 400 }}>{label}</span>
            {badge && (
              <span style={{
                position: 'absolute', top: 5, right: '50%', transform: 'translateX(16px)',
                background: '#dc2626', color: '#fff',
                fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 999, minWidth: 18,
                textAlign: 'center', lineHeight: 1.1,
                boxShadow: '0 1px 3px rgba(220,38,38,0.4)',
                border: '1.5px solid var(--white)',
              }}>{badge > 99 ? '99+' : badge}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Map Screen ────────────────────────────────────────────────────────────
const MAP_DOMAIN_COLORS = {
  visual_art:     '#1a56db',
  jazz:           '#0369a1',
  classical_music:'#854d0e',
  sports:         '#dc2626',
  architecture:   '#059669',
  theater:        '#7c3aed',
  history:        '#92400e',
  hip_hop:         '#b45309',
}

const MAP_FILTERS = [
  { id: 'all',             label: 'All' },
  { id: 'visual_art',      label: 'Art' },
  { id: 'jazz',            label: 'Jazz' },
  { id: 'classical_music', label: 'Music' },
  { id: 'sports',          label: 'Sports' },
  { id: 'architecture',    label: 'Architecture' },
  { id: 'theater',         label: 'Theater' },
  { id: 'history',         label: 'History' },
  { id: 'hip_hop', label: 'Hip-Hop' },
]

function MapScreen({ onSelectVenue, highlight = null, onClearHighlight = null, savedItems = {}, toggleSave = () => {} }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef  = useRef(null)
  const markersRef      = useRef([])
  const [filter, setFilter]         = useState('all')
  const [selectedVenueId, setSelectedVenueId] = useState(null)

  // Load Leaflet JS dynamically (CSS already in index.html)
  useEffect(() => {
    if (window.L) return
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => { /* triggers re-render via mapReady */ setMapReady(true) }
    document.head.appendChild(script)
  }, [])
  const [mapReady, setMapReady] = useState(!!window.L)

  // Init map — re-runs when Leaflet finishes loading
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return
    if (!window.L) return
    const L = window.L

    const map = L.map(mapContainerRef.current, {
      center: [40.754, -73.983],
      zoom: 12,
      zoomControl: false,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapInstanceRef.current = map

    return () => { map.remove(); mapInstanceRef.current = null }
  }, [mapReady])

  // Sync markers when filter or saved-set changes — saved venues get a larger, brighter marker so users can see what they've collected
  useEffect(() => {
    const L = window.L
    const map = mapInstanceRef.current
    if (!L || !map) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    Object.entries(venueCoords).forEach(([venueId, info]) => {
      if (filter !== 'all' && info.domain !== filter) return
      const venue = venues[venueId]
      if (!venue) return
      const color = MAP_DOMAIN_COLORS[info.domain] || '#666'
      const isSaved = !!savedItems[`venue:${venueId}`]

      // Saved venues: bigger, red outline ring, full opacity to pop on the map
      const marker = L.circleMarker([info.lat, info.lng], isSaved ? {
        radius: 11,
        fillColor: color,
        color: '#dc2626',
        weight: 3,
        fillOpacity: 1,
      } : {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9,
      })
      marker.on('click', () => setSelectedVenueId(venueId))
      marker.bindTooltip(venue.name + (isSaved ? ' ♥' : ''), { permanent: false, direction: 'top', offset: [0, -8] })
      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [filter, mapReady, savedItems])

  // Pan to + open popup when arriving via "View on Map".
  // mapReady is in the dependency list so this re-runs after Leaflet finishes loading on the first visit —
  // otherwise venues far from the default Manhattan center (e.g. Citi Field in Queens, Yankee Stadium in the Bronx)
  // appear off-screen because the pan call bailed before the map instance existed.
  useEffect(() => {
    if (!highlight || !mapReady || !mapInstanceRef.current || !window.L) return
    setSelectedVenueId(highlight)
    const info = venueCoords[highlight]
    if (info) mapInstanceRef.current.setView([info.lat, info.lng], 15)
    if (onClearHighlight) onClearHighlight()
  }, [highlight, mapReady])

  const selVenue = selectedVenueId ? venues[selectedVenueId] : null
  const selInfo  = selectedVenueId ? venueCoords[selectedVenueId] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, bottom: 60, zIndex: 1 }}>
      {/* Filter chips */}
      <div style={{
        padding: '10px 14px 8px', display: 'flex', gap: 8, overflowX: 'auto',
        flexShrink: 0, scrollbarWidth: 'none', background: 'var(--white)',
        borderBottom: '1px solid var(--gray-100)',
      }}>
        {MAP_FILTERS.map(f => (
          <button key={f.id} onClick={() => { setFilter(f.id); setSelectedVenueId(null) }} style={{
            padding: '5px 13px', borderRadius: 20, border: 'none', flexShrink: 0,
            background: filter === f.id ? 'var(--gray-900)' : 'var(--gray-100)',
            color: filter === f.id ? '#fff' : 'var(--gray-600)',
            fontSize: 12, fontWeight: filter === f.id ? 700 : 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Map */}
      <div ref={mapContainerRef} style={{ flex: 1, minHeight: 0 }} />

      {/* Selected venue card */}
      {selVenue && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          background: 'var(--white)', borderRadius: 16, padding: '14px 16px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.22)', zIndex: 1000,
        }}>
          {/* Header row: domain badge + heart + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: MAP_DOMAIN_COLORS[selInfo?.domain] || '#666',
            }}>{domains[selInfo?.domain]?.name || ''}</div>
            {/* Save heart — in-place save from the map popup */}
            {(() => {
              const isSaved = !!savedItems[`venue:${selectedVenueId}`]
              return (
                <button
                  onClick={() => toggleSave('venue', selectedVenueId)}
                  aria-label={isSaved ? 'Remove from saved' : 'Save'}
                  style={{
                    marginLeft: 'auto',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 999,
                    background: isSaved ? '#fee2e2' : 'var(--gray-100)',
                    color: isSaved ? '#dc2626' : 'var(--gray-500)',
                    border: 'none', cursor: 'pointer',
                    fontSize: 15, lineHeight: 1,
                    transition: 'background 120ms ease, color 120ms ease',
                  }}>
                  {isSaved ? '♥' : '♡'}
                </button>
              )
            })()}
            <button onClick={() => setSelectedVenueId(null)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 16, color: 'var(--gray-400)', padding: '0 2px', lineHeight: 1,
            }}>&#x2715;</button>
          </div>
          {/* Venue name */}
          <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--gray-900)', lineHeight: 1.2, marginBottom: 8 }}>{selVenue.name}</div>
          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
            {selInfo?.address && (
              <div style={{ fontSize: 12, color: 'var(--gray-600)', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>&#x1F4CD;</span>
                <span>{selInfo.address}</span>
              </div>
            )}
            {selVenue.bookingNote && (
              <div style={{ fontSize: 12, color: 'var(--gray-600)', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>&#x1F550;</span>
                <span>{selVenue.bookingNote}</span>
              </div>
            )}
            {selVenue.admissionCost && (
              <div style={{ fontSize: 12, color: 'var(--gray-600)', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>&#x1F3AB;</span>
                <span>{selVenue.admissionCost}</span>
              </div>
            )}
          </div>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={`https://maps.google.com/maps?q=${selInfo?.lat},${selInfo?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, background: 'var(--gray-100)', color: 'var(--gray-900)', border: 'none',
                borderRadius: 10, padding: '10px 0', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                textDecoration: 'none', textAlign: 'center', display: 'block',
              }}
            >&#x1F4CD; Directions</a>
            <button onClick={() => onSelectVenue(selectedVenueId)} style={{
              flex: 1, background: 'var(--gray-900)', color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 0', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            }}>Explore ›</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tonight Screen ────────────────────────────────────────────────────────
const TONIGHT_DOMAIN_COLORS = {
  visual_art:     '#1a56db',
  jazz:           '#0369a1',
  classical_music:'#854d0e',
  theater:        '#7c3aed',
  hip_hop:         '#b45309',
  sports:         '#dc2626',
  architecture:   '#059669',
  history:        '#92400e',
}
const TONIGHT_DOMAIN_LABELS = {
  visual_art: 'Art', jazz: 'Jazz', classical_music: 'Classical',
  theater: 'Theater', sports: 'Sports', architecture: 'Architecture', history: 'History',
  hip_hop:         'Hip-Hop',
}

function TonightScreen({ onNavigate, savedItems = {}, toggleSave = () => {}, onViewSaved = () => {} }) {
  const [tonightFilter, setTonightFilter] = React.useState('all')

  // Per-pick domain palette — kept in sync with Explore so chips/headers match across tabs
  const domainColors = {
    jazz: '#C8823A', visual_art: '#5B7FA6', classical_music: '#7B6FA6',
    theater: '#A65B7B', sports: '#4A8C5C', architecture: '#8C6A4A',
    history: '#6A6A6A', hip_hop: '#3A3A8C',
  }

  // Per-domain counts — drives the filter row (hides empty filters, shows count badges)
  const counts = React.useMemo(() => {
    const c = { all: tonightPicks.length }
    tonightPicks.forEach(p => { c[p.domain] = (c[p.domain] || 0) + 1 })
    return c
  }, [])

  const ALL_FILTERS = [
    { key: 'all',             label: 'All' },
    { key: 'jazz',            label: 'Jazz' },
    { key: 'visual_art',      label: 'Art' },
    { key: 'classical_music', label: 'Classical' },
    { key: 'theater',         label: 'Theater' },
    { key: 'architecture',    label: 'Architecture' },
    { key: 'sports',          label: 'Sports' },
    { key: 'history',         label: 'History' },
    { key: 'hip_hop',         label: 'Hip-Hop' },
  ]
  // Only show filters that have content. Removes the "tap and get an empty state" trust hit.
  const visibleFilters = ALL_FILTERS.filter(f => f.key === 'all' || (counts[f.key] || 0) > 0)

  const visiblePicks = tonightFilter === 'all'
    ? tonightPicks
    : tonightPicks.filter(p => p.domain === tonightFilter)

  // Group picks by time-of-day. Order: Evening → Late night → Daytime → In season
  // The Tonight tab leads with evening because most users open it after work.
  const SECTION_ORDER = [
    { key: 'evening',    label: 'Evening',     emoji: '🌆' },
    { key: 'late_night', label: 'Late night',  emoji: '🌙' },
    { key: 'daytime',    label: 'Daytime',     emoji: '☀️' },
    { key: 'anytime',    label: 'In season',   emoji: '⭐' },
  ]
  const grouped = {}
  SECTION_ORDER.forEach(s => {
    grouped[s.key] = visiblePicks.filter(p => (p.timeOfDay || 'anytime') === s.key)
  })

  // How many of these picks has the user saved? Powers the saved-count link in the header.
  const savedCount = React.useMemo(
    () => tonightPicks.filter(p => savedItems[`venue:${p.venueId}`]).length,
    [savedItems]
  )

  // Live current-time anchor — updates every 30s so it actually feels alive on long sessions
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()]
  const hour24 = now.getHours()
  const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12
  const ampm = hour24 >= 12 ? 'PM' : 'AM'
  const minute = String(now.getMinutes()).padStart(2, '0')
  const partOfDay =
    hour24 < 6   ? 'early morning' :
    hour24 < 11  ? 'morning' :
    hour24 < 17  ? 'afternoon' :
    hour24 < 21  ? 'evening' :
                   'late evening'
  const timeAnchor = `It's ${dayName} ${partOfDay}, ${displayHour}:${minute} ${ampm}`

  return (
    <div className="screen" style={{ paddingBottom: 80 }}>
      {/* ── Header — branding consistent with Explore + live current-time line ── */}
      <div className="home-header">
        <div className="home-wordmark">NYC Tonight</div>
        <div className="home-subtitle">{timeAnchor}</div>
        <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 6, lineHeight: 1.4 }}>
          Hand-picked by NYC editors · Refreshed weekly
        </div>
        {/* Saved-count link — appears only when there's at least 1 save. Jumps to Saved tab. */}
        {savedCount > 0 && (
          <button onClick={onViewSaved} style={{
            marginTop: 10,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: '#fee2e2', border: '1px solid #fecaca',
            color: '#b91c1c', fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 13, lineHeight: 1 }}>♥</span>
            <span>{savedCount} saved · Plan your trip →</span>
          </button>
        )}
      </div>

      {/* ── Sticky filter chip row — stays visible while scrolling the list ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-100)',
      }}>
        <div style={{
          overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
          padding: '10px 20px',
          display: 'flex', gap: 8,
        }}>
          {visibleFilters.map(f => {
            const isActive = tonightFilter === f.key
            const count = counts[f.key] || 0
            return (
              <button key={f.key} onClick={() => setTonightFilter(f.key)} style={{
                flexShrink: 0, padding: '7px 12px 7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: isActive ? 700 : 600,
                background: isActive ? 'var(--gray-900)' : 'var(--gray-100)',
                color: isActive ? 'var(--white)' : 'var(--gray-600)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <span>{f.label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--gray-500)',
                  background: isActive ? 'rgba(255,255,255,0.18)' : 'var(--white)',
                  padding: '1px 7px', borderRadius: 999,
                }}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grouped picks ── */}
      <div style={{ padding: '0 0 20px' }}>
        {visiblePicks.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: 15, padding: '60px 20px' }}>
            No picks for that category yet.
          </div>
        )}

        {SECTION_ORDER.map(section => {
          const picks = grouped[section.key]
          if (picks.length === 0) return null
          return (
            <div key={section.key} style={{ padding: '18px 20px 4px' }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>{section.emoji}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: 'var(--gray-600)',
                }}>{section.label}</span>
                {(() => {
                  // Editorial count copy — ties to the section's time-of-day so it reads as voice, not output
                  const wordFor = {
                    evening:    picks.length === 1 ? '1 idea tonight' : `${picks.length} ideas tonight`,
                    late_night: picks.length === 1 ? 'Just one tonight' : `${picks.length} late-night ideas`,
                    daytime:    picks.length === 1 ? '1 idea today' : `${picks.length} ideas today`,
                    anytime:    picks.length === 1 ? '1 evergreen pick' : `${picks.length} evergreen picks`,
                  }
                  return (
                    <span style={{ fontSize: 11, color: 'var(--gray-400)', marginLeft: 'auto' }}>
                      {wordFor[section.key] || `${picks.length}`}
                    </span>
                  )
                })()}
              </div>

              {/* Pick cards — thumbnail + scannable content + heart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {picks.map(pick => {
                  const tint = domainColors[pick.domain] || '#666'
                  const label = TONIGHT_DOMAIN_LABELS[pick.domain] || pick.domain
                  const isSaved = !!savedItems[`venue:${pick.venueId}`]
                  const domainObj = domains[pick.domain]
                  return (
                    <button key={pick.id} onClick={() => onNavigate({ venueId: pick.venueId, workId: pick.workId, blurb: pick.blurb })} style={{
                      width: '100%', height: 132, background: 'var(--white)', border: '1px solid var(--gray-200)',
                      borderRadius: 14, padding: 0, cursor: 'pointer', textAlign: 'left',
                      display: 'flex', flexDirection: 'row', alignItems: 'stretch',
                      overflow: 'hidden',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}>
                      {/* Thumbnail — real image if available, colored fallback w/ emoji otherwise. Fills card height for uniform rhythm. */}
                      <div style={{
                        flexShrink: 0,
                        width: 132,
                        height: '100%',
                        background: pick.image ? '#0a0a0a' : `linear-gradient(135deg, ${tint} 0%, ${tint}CC 100%)`,
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {pick.image ? (
                          <img src={pick.image} alt={pick.imageAlt || ''} loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <span style={{ fontSize: 36, lineHeight: 1, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.18))' }}>
                            {domainObj?.icon || '✨'}
                          </span>
                        )}
                      </div>

                      {/* Content area */}
                      <div style={{
                        flex: 1, minWidth: 0,
                        padding: '10px 12px 10px 14px',
                        display: 'flex', flexDirection: 'column', gap: 4,
                      }}>
                        {/* Top row: domain badge + heart (now a proper pill button) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                            color: tint, background: tint + '18', padding: '2px 8px', borderRadius: 999,
                          }}>{label}</span>
                          {/* Share button — uses Web Share API on mobile, falls back to clipboard. */}
                          <span
                            role="button"
                            tabIndex={-1}
                            aria-label="Share"
                            onClick={(e) => {
                              e.stopPropagation()
                              const shareData = {
                                title: pick.title,
                                text: `${pick.title} — ${pick.dateNote}`,
                                url: typeof window !== 'undefined' ? window.location.href : '',
                              }
                              if (typeof navigator !== 'undefined' && navigator.share) {
                                navigator.share(shareData).catch(() => {})
                              } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`).catch(() => {})
                              }
                            }}
                            style={{
                              marginLeft: 'auto',
                              cursor: 'pointer', userSelect: 'none',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 30, height: 30, borderRadius: 999,
                              background: 'var(--gray-100)', color: 'var(--gray-500)',
                              fontSize: 13, lineHeight: 1, fontWeight: 700,
                            }}>
                            ↗
                          </span>
                          <span
                            role="button"
                            tabIndex={-1}
                            aria-label={isSaved ? 'Remove from saved' : 'Save'}
                            onClick={(e) => { e.stopPropagation(); toggleSave('venue', pick.venueId) }}
                            style={{
                              cursor: 'pointer', userSelect: 'none',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 30, height: 30, borderRadius: 999,
                              background: isSaved ? '#fee2e2' : 'var(--gray-100)',
                              color: isSaved ? '#dc2626' : 'var(--gray-500)',
                              fontSize: 17, lineHeight: 1,
                              transition: 'background 120ms ease, color 120ms ease',
                            }}>
                            {isSaved ? '♥' : '♡'}
                          </span>
                        </div>

                        {/* Title — clamped to 2 lines so card stays scannable */}
                        <div style={{
                          fontSize: 15, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.3,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>{pick.title}</div>

                        {/* dateNote — "when" of a Tonight card, in domain accent color */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontSize: 12, fontWeight: 600, color: tint, minWidth: 0,
                        }}>
                          <span style={{ fontSize: 11, lineHeight: 1, flexShrink: 0 }}>🕐</span>
                          <span style={{
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
                          }}>{pick.dateNote}</span>
                        </div>

                        {/* Trip-planner metadata: neighborhood · price · duration. Muted single line. */}
                        {(() => {
                          const neighborhood = venues[pick.venueId]?.neighborhood
                          const bits = []
                          if (neighborhood) bits.push(`📍 ${neighborhood}`)
                          if (pick.price) bits.push(pick.price)
                          if (pick.duration) bits.push(pick.duration)
                          if (bits.length === 0) return null
                          return (
                            <div style={{
                              fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.3,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              minWidth: 0,
                            }}>
                              {bits.join(' · ')}
                            </div>
                          )
                        })()}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Saved Screen ──────────────────────────────────────────────────────────

// ── Visit Plan helpers ───────────────────────────────────────────────────────
function parseDurationHours(str) {
  if (!str) return 2
  const isMinutes = /\bmin/i.test(str)
  const nums = (str.match(/\d+(\.\d+)?/g) || []).map(Number)
  if (nums.length === 0) return 2
  const raw = nums.length === 1 ? nums[0] : (nums[0] + nums[1]) / 2
  return isMinutes ? raw / 60 : raw
}

const AREA_CLUSTERS = {
  'Midtown': 'Midtown',
  'Midtown East': 'Midtown',
  'Midtown East / Turtle Bay': 'Midtown',
  'Midtown Manhattan': 'Midtown',
  'Midtown West': 'Midtown',
  'Midtown / Theatre District': 'Midtown',
  'Columbus Circle': 'Midtown',
  'Flatiron': 'Midtown',
  'Upper East Side': 'Upper East Side',
  'Upper West Side': 'Upper West Side',
  'Lincoln Center': 'Upper West Side',
  'Morningside Heights': 'Upper West Side',
  'Central Park (Upper West Side)': 'Upper West Side',
  'Harlem': 'Harlem',
  'Harlem (St. Nicholas Park)': 'Harlem',
  'Greenwich Village': 'Downtown Village',
  'NoHo / East Village': 'Downtown Village',
  'Meatpacking District': 'Downtown Village',
  'Chelsea / Meatpacking District': 'Downtown Village',
  'Lower East Side': 'Downtown Village',
  'Financial District': 'Lower Manhattan',
  'Downtown / Civic Center': 'Lower Manhattan',
  'Lower Manhattan / Civic Center': 'Lower Manhattan',
  // Brooklyn sub-neighborhoods — explicit so that user-added Williamsburg / DUMBO / Park Slope places
  // get correctly grouped into the Brooklyn day rather than falling through to "Other".
  'Greenpoint': 'Brooklyn',
  'Williamsburg': 'Brooklyn',
  'East Williamsburg': 'Brooklyn',
  'Bushwick': 'Brooklyn',
  'Downtown Brooklyn': 'Brooklyn',
  'DUMBO': 'Brooklyn',
  'Brooklyn Heights': 'Brooklyn',
  'Fort Greene': 'Brooklyn',
  'Clinton Hill': 'Brooklyn',
  'Prospect Heights': 'Brooklyn',
  'Park Slope': 'Brooklyn',
  'Crown Heights': 'Brooklyn',
}

function getAreaCluster(neighborhood) {
  if (!neighborhood) return 'Other'
  if (AREA_CLUSTERS[neighborhood]) return AREA_CLUSTERS[neighborhood]
  if (neighborhood.includes('Brooklyn')) return 'Brooklyn'
  if (neighborhood.includes('Bronx')) return 'The Bronx'
  if (neighborhood.includes('Queens')) return 'Queens'
  return 'Other'
}

function buildItinerary(venueIds, userVenuesLookup = {}) {
  const EVENING_DOMAINS = new Set(['jazz', 'classical_music', 'theater'])
  const DOMAIN_ORDER = { history: 0, architecture: 1, visual_art: 2, hip_hop: 3, sports: 4 }
  // Map user-place category → display domain so the itinerary can color/sort them
  // alongside curated venues. Defaults to 'visual_art' (treated as daytime, neutral).
  const USER_CATEGORY_DOMAIN = {
    food: 'visual_art', drink: 'jazz', music: 'jazz', art: 'visual_art',
    history: 'history', sports: 'sports', shopping: 'visual_art', other: 'visual_art',
  }

  const annotated = venueIds.map(id => {
    const v = venues[id]
    if (v) {
      const domain = venueCoords[id]?.domain || 'visual_art'
      const isEvening = EVENING_DOMAINS.has(domain)
      return {
        id, name: v.name, neighborhood: v.neighborhood,
        hours: v.hours, scheduleUrl: v.scheduleUrl, ticketUrl: v.ticketUrl,
        admissionCost: v.admissionCost, nowPlaying: v.nowPlaying,
        domain, isEvening,
        duration: parseDurationHours(v.visitDuration),
        area: getAreaCluster(v.neighborhood),
      }
    }
    const uv = userVenuesLookup[id]
    if (uv) {
      const domain = USER_CATEGORY_DOMAIN[uv.category] || 'visual_art'
      const isEvening = uv.category === 'drink' || uv.category === 'music'
      return {
        id, name: uv.name, neighborhood: uv.neighborhood,
        hours: uv.hours || '', scheduleUrl: '', ticketUrl: '',
        admissionCost: '', nowPlaying: '',
        domain, isEvening,
        duration: 1.5,
        area: getAreaCluster(uv.neighborhood),
        isCustom: true, blurb: uv.blurb, address: uv.address,
      }
    }
    return null
  }).filter(Boolean)

  const daytime = annotated.filter(v => !v.isEvening)
  const evening = annotated.filter(v => v.isEvening)

  // Group daytime by area cluster
  const areaMap = {}
  daytime.forEach(v => {
    if (!areaMap[v.area]) areaMap[v.area] = []
    areaMap[v.area].push(v)
  })

  // Sort within each area: by domain order
  Object.values(areaMap).forEach(list => {
    list.sort((a, b) => (DOMAIN_ORDER[a.domain] ?? 9) - (DOMAIN_ORDER[b.domain] ?? 9))
  })

  const days = []
  const usedEveningIds = new Set()

  // Build one day per area cluster (merge small clusters into nearby days)
  const areas = Object.entries(areaMap)
  areas.forEach(([area, dayVenues]) => {
    // Time slots: 10am start, 30min travel between stops
    let hour = 10
    const stops = dayVenues.map(v => {
      const slot = {
        ...v,
        period: hour < 13 ? 'Morning' : 'Afternoon',
        startHour: hour,
      }
      hour += v.duration + 0.5
      return slot
    })

    // Attach next available evening venue
    const eve = evening.find(e => !usedEveningIds.has(e.id))
    if (eve) {
      usedEveningIds.add(eve.id)
      const eveHour = eve.domain === 'theater' ? 19.5 : eve.domain === 'classical_music' ? 19 : 20
      stops.push({ ...eve, period: 'Evening', startHour: eveHour })
    }

    days.push({ area, stops })
  })

  // Remaining evening-only venues → their own "Evening" day
  const leftoverEvening = evening.filter(e => !usedEveningIds.has(e.id))
  if (leftoverEvening.length > 0) {
    const stops = leftoverEvening.map((v, i) => ({
      ...v, period: 'Evening',
      startHour: v.domain === 'classical_music' ? 19 : v.domain === 'theater' ? 19.5 : 20 + i,
    }))
    days.push({ area: 'Evening Out', stops })
  }

  // Safety net: if annotated has venues but days ended up empty somehow, show them all
  if (days.length === 0 && annotated.length > 0) {
    let hour = 10
    const stops = annotated.map(v => {
      const slot = { ...v, period: hour < 13 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening', startHour: hour }
      hour += (v.duration || 1.5) + 0.5
      return slot
    })
    days.push({ area: annotated[0]?.area || 'New York City', stops })
  }

  return days
}

function capDays(days, maxDays) {
  if (!maxDays || days.length <= maxDays) return days
  // Keep first (maxDays-1) days intact; merge all remaining into the last slot
  const kept    = days.slice(0, maxDays - 1)
  const merged  = days.slice(maxDays - 1)
  const areaLabel = [...new Set(merged.map(d => d.area))].join(' + ')
  const allStops  = merged.flatMap(d => d.stops)
  // Re-sort by period then by original startHour
  const order = { Morning: 0, Afternoon: 1, Evening: 2 }
  allStops.sort((a, b) =>
    (order[a.period] ?? 1) - (order[b.period] ?? 1) || a.startHour - b.startHour
  )
  // Re-assign start hours so nothing overlaps
  let hour = 10
  const reSlotted = allStops.map(s => {
    if (s.period === 'Evening') return { ...s, startHour: s.startHour }  // keep evening times
    const slot = { ...s, startHour: hour }
    hour += (s.duration || 1.5) + 0.5
    return slot
  })
  kept.push({ area: areaLabel, stops: reSlotted })
  return kept
}

function fmtHour(h) {
  const hh = Math.floor(h)
  const mm = h % 1 === 0.5 ? '30' : '00'
  const ampm = hh >= 12 ? 'pm' : 'am'
  return `${hh > 12 ? hh - 12 : hh}:${mm}${ampm}`
}


// ── Restaurant Data ──────────────────────────────────────────────────────────
const CUISINE_OPTIONS = [
  { id: 'japanese',   label: 'Japanese',    emoji: '🍣', color: '#e11d48' },
  { id: 'korean',     label: 'Korean',      emoji: '🥩', color: '#ea580c' },
  { id: 'italian',    label: 'Italian',     emoji: '🍝', color: '#16a34a' },
  { id: 'pizza',      label: 'Pizza',       emoji: '🍕', color: '#dc2626' },
  { id: 'burger',     label: 'Burger',      emoji: '🍔', color: '#92400e' },
  { id: 'bar_tavern', label: 'Bar',         emoji: '🍺', color: '#6d28d9' },
  { id: 'steakhouse', label: 'Steak',       emoji: '🥩', color: '#991b1b' },
  { id: 'american',   label: 'American',    emoji: '🍳', color: '#1e40af' },
]

const RESTAURANT_DATA = [
  // ── MIDTOWN ──
  { id: 'sushi_yasuda',    name: 'Sushi Yasuda',       cuisines: ['japanese'],   area: 'Midtown', price: '$$$', neighborhood: 'Midtown East',   description: 'Pristine traditional Edomae sushi in a serene bamboo-walled room. One of NYC\'s finest.',      reservationUrl: 'https://www.opentable.com/sushi-yasuda',           mapsUrl: 'https://maps.google.com/?q=Sushi+Yasuda+New+York' },
  { id: 'ootoya_midtown',  name: 'Ootoya',             cuisines: ['japanese'],   area: 'Midtown', price: '$$',  neighborhood: 'Midtown',         description: 'Homestyle Japanese teishoku sets — rice, miso soup, pickles, grilled fish or tonkatsu.',      reservationUrl: 'https://www.opentable.com/ootoya-chelsea',          mapsUrl: 'https://maps.google.com/?q=Ootoya+Midtown+New+York' },
  { id: 'marea',           name: 'Marea',              cuisines: ['italian'],    area: 'Midtown', price: '$$$$',neighborhood: 'Central Park South', description: 'Michelin-starred coastal Italian — impeccable seafood pastas and crudo overlooking the park.', reservationUrl: 'https://www.opentable.com/marea',                   mapsUrl: 'https://maps.google.com/?q=Marea+Restaurant+New+York' },
  { id: 'the_modern',      name: 'The Modern',         cuisines: ['american'],   area: 'Midtown', price: '$$$$',neighborhood: 'Midtown (MoMA)',   description: 'Danny Meyer\'s MoMA restaurant with floor-to-ceiling sculpture garden views and seasonal tasting menus.', reservationUrl: 'https://www.opentable.com/the-modern',         mapsUrl: 'https://maps.google.com/?q=The+Modern+Restaurant+MoMA+New+York' },
  { id: 'shake_shack_midtown', name: 'Shake Shack',   cuisines: ['burger'],     area: 'Midtown', price: '$',   neighborhood: 'Midtown',         description: 'The original ShackBurger — crispy edges, special sauce, fresh potato bun. Perfect quick stop.', reservationUrl: 'https://www.shakeshack.com',                        mapsUrl: 'https://maps.google.com/?q=Shake+Shack+Madison+Square+Park+New+York' },
  { id: 'campbell',        name: 'The Campbell',       cuisines: ['bar_tavern'], area: 'Midtown', price: '$$',  neighborhood: 'Grand Central',    description: 'Jaw-dropping 1920s Gilded Age bar inside Grand Central — gilded ceiling, roaring fireplace, craft cocktails.', reservationUrl: 'https://thecampbellnyc.com',                    mapsUrl: 'https://maps.google.com/?q=The+Campbell+Grand+Central+New+York' },
  { id: 'benjamin_steak',  name: 'Benjamin Steakhouse',cuisines: ['steakhouse'], area: 'Midtown', price: '$$$$',neighborhood: 'Midtown East',    description: 'Classic NYC prime steakhouse — USDA prime dry-aged porterhouses in an elegant Helmsley Building room.', reservationUrl: 'https://www.opentable.com/benjamin-steakhouse', mapsUrl: 'https://maps.google.com/?q=Benjamin+Steakhouse+New+York' },
  { id: 'jongno_midtown',  name: 'Jongno Gopchang',   cuisines: ['korean'],     area: 'Midtown', price: '$$',  neighborhood: 'Koreatown',       description: 'Sizzling Korean BBQ specializing in beef intestines and offcuts — bold, smoky, deeply satisfying.', reservationUrl: 'https://www.yelp.com/biz/jongno-gopchang-new-york',mapsUrl: 'https://maps.google.com/?q=Jongno+Gopchang+New+York' },

  // ── UPPER EAST SIDE ──
  { id: 'sushi_of_gari',   name: 'Sushi of Gari',     cuisines: ['japanese'],   area: 'Upper East Side', price: '$$$', neighborhood: 'Upper East Side', description: 'Chef Gari\'s legendary omakase — creative toppings and sauces that transformed NYC sushi culture.',  reservationUrl: 'https://www.sushiofgari.com',           mapsUrl: 'https://maps.google.com/?q=Sushi+of+Gari+New+York' },
  { id: 'caravaggio',      name: 'Caravaggio',         cuisines: ['italian'],    area: 'Upper East Side', price: '$$$', neighborhood: 'Upper East Side', description: 'Refined northern Italian — handmade pastas, excellent osso buco, hushed elegant room favored by locals.', reservationUrl: 'https://www.opentable.com/caravaggio-new-york', mapsUrl: 'https://maps.google.com/?q=Caravaggio+Restaurant+New+York' },
  { id: 'jg_melon',        name: 'J.G. Melon',         cuisines: ['burger','american'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'NYC burger institution since 1972 — thick patty on a bun with cottage fries, cash only, always packed.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=JG+Melon+New+York' },
  { id: 'burnside_ues',    name: 'Burnside',            cuisines: ['bar_tavern'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Warm neighborhood whiskey bar — long list of Irish and Scotch whiskeys, excellent cocktails, cozy booths.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Burnside+Bar+New+York' },
  { id: 'mezzaluna',       name: 'Mezzaluna',           cuisines: ['italian','pizza'], area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Beloved UES neighborhood Italian — thin-crust pizza from a wood-burning oven and classic pastas.',    reservationUrl: 'https://www.opentable.com/mezzaluna',   mapsUrl: 'https://maps.google.com/?q=Mezzaluna+New+York' },
  { id: 'mono_mono',       name: 'Mono+Mono',           cuisines: ['korean'],     area: 'Upper East Side', price: '$$', neighborhood: 'Upper East Side', description: 'Modern Korean comfort food — crispy rice, japchae, galbi, and rice-cake stir-fry in a sleek room.',     reservationUrl: 'https://www.opentable.com/mono-mono',   mapsUrl: 'https://maps.google.com/?q=Mono+Mono+New+York' },

  // ── UPPER WEST SIDE ──
  { id: 'carmines_uws',    name: 'Carmine\'s',          cuisines: ['italian'],    area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Legendary family-style Italian — enormous platters of linguine alle vongole and chicken parmigiana built for sharing.', reservationUrl: 'https://www.carminesnyc.com', mapsUrl: 'https://maps.google.com/?q=Carmine\'s+Upper+West+Side+New+York' },
  { id: 'shake_shack_uws', name: 'Shake Shack (UWS)',   cuisines: ['burger'],     area: 'Upper West Side', price: '$',  neighborhood: 'Upper West Side', description: 'The Shake Shack nearest Lincoln Center — ideal pre-concert ShackBurger or custard stop.',           reservationUrl: 'https://www.shakeshack.com', mapsUrl: 'https://maps.google.com/?q=Shake+Shack+Upper+West+Side+New+York' },
  { id: 'amsterdam_ale',   name: 'Amsterdam Ale House', cuisines: ['bar_tavern'], area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: '60 taps of craft and import beer in a classic neighborhood tavern — excellent wings and a relaxed vibe.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Amsterdam+Ale+House+New+York' },
  { id: 'kefi_uws',        name: 'Kefi',                cuisines: ['american'],   area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Michael Psilakis\'s beloved Greek-American taverna — roasted lamb, spreads, and casual neighborhood warmth.', reservationUrl: 'https://www.opentable.com/kefi', mapsUrl: 'https://maps.google.com/?q=Kefi+Restaurant+New+York' },
  { id: 'sushi_yasaka',    name: 'Sushi Yasaka',        cuisines: ['japanese'],   area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Quiet neighborhood sushi bar known for generous omakase value and pristine fish sourced daily.',           reservationUrl: 'https://www.opentable.com/sushi-yasaka', mapsUrl: 'https://maps.google.com/?q=Sushi+Yasaka+New+York' },
  { id: 'juliana_uws',     name: 'Juliana\'s (UWS)',    cuisines: ['pizza'],      area: 'Upper West Side', price: '$$', neighborhood: 'Upper West Side', description: 'Coal-fired Neapolitan pizza — charred blistered crust, San Marzano tomatoes, fresh mozzarella.',         reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Juliana\'s+Pizza+New+York' },

  // ── DOWNTOWN VILLAGE ──
  { id: 'carbone',         name: 'Carbone',             cuisines: ['italian'],    area: 'Downtown Village', price: '$$$$', neighborhood: 'Greenwich Village', description: 'The most coveted reservation in NYC — theatrical red-sauce Italian with tuxedoed captains and legendary spicy rigatoni.', reservationUrl: 'https://www.exploretock.com/carbone', mapsUrl: 'https://maps.google.com/?q=Carbone+New+York' },
  { id: 'lupa',            name: 'Lupa Osteria Romana', cuisines: ['italian'],    area: 'Downtown Village', price: '$$$', neighborhood: 'Greenwich Village', description: 'Mario Batali\'s warm Roman trattoria — impeccable house-made pastas and an extensive all-Italian wine list.', reservationUrl: 'https://www.opentable.com/lupa', mapsUrl: 'https://maps.google.com/?q=Lupa+Osteria+Romana+New+York' },
  { id: 'momofuku_noodle', name: 'Momofuku Noodle Bar', cuisines: ['japanese'],   area: 'Downtown Village', price: '$$', neighborhood: 'East Village',      description: 'David Chang\'s original noodle bar — rich tonkotsu ramen, inventive pork buns, and the bowl that started it all.', reservationUrl: 'https://www.momofuku.com/noodle-bar', mapsUrl: 'https://maps.google.com/?q=Momofuku+Noodle+Bar+New+York' },
  { id: 'corner_bistro',   name: 'Corner Bistro',       cuisines: ['burger'],     area: 'Downtown Village', price: '$',   neighborhood: 'West Village',      description: 'NYC dive bar legend since 1961 — the Bistro Burger (8oz, cheese, bacon, fried onion) for under $10.',      reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Corner+Bistro+New+York' },
  { id: 'employees_only',  name: 'Employees Only',      cuisines: ['bar_tavern'], area: 'Downtown Village', price: '$$$', neighborhood: 'West Village',      description: 'Legendary speakeasy cocktail bar behind a psychic\'s storefront — brilliant pre-Prohibition drinks and late-night food.', reservationUrl: 'https://www.employeesonlynyc.com', mapsUrl: 'https://maps.google.com/?q=Employees+Only+New+York' },
  { id: 'spotted_pig',     name: 'The Spotted Pig',     cuisines: ['american'],   area: 'Downtown Village', price: '$$$', neighborhood: 'West Village',      description: 'April Bloomfield\'s iconic gastro-pub — gnudi, chargrilled burger with Roquefort, and a convivial crammed room.', reservationUrl: 'https://www.thespottedpig.com', mapsUrl: 'https://maps.google.com/?q=The+Spotted+Pig+New+York' },
  { id: 'artichoke_pizza', name: 'Artichoke Basille\'s', cuisines: ['pizza'],     area: 'Downtown Village', price: '$',   neighborhood: 'East Village',      description: 'Thick square Sicilian slices — the artichoke-cream slice is a NYC late-night institution. Enormous portions.',   reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Artichoke+Basille\'s+New+York' },
  { id: 'jeju_noodle',     name: 'Jeju Noodle Bar',     cuisines: ['korean'],     area: 'Downtown Village', price: '$$',  neighborhood: 'Greenwich Village', description: 'Creative Korean noodles rooted in Jeju Island tradition — the signature ramen broth simmers for days.',         reservationUrl: 'https://www.opentable.com/jeju-noodle-bar', mapsUrl: 'https://maps.google.com/?q=Jeju+Noodle+Bar+New+York' },

  // ── LOWER MANHATTAN ──
  { id: 'nobu_downtown',   name: 'Nobu Downtown',       cuisines: ['japanese'],   area: 'Lower Manhattan', price: '$$$$', neighborhood: 'Tribeca',          description: 'Nobu Matsuhisa\'s original NYC flagship — black cod miso and yellowtail jalapeño remain the gold standard.',  reservationUrl: 'https://www.noburestaurants.com/new-york/experience/', mapsUrl: 'https://maps.google.com/?q=Nobu+Downtown+New+York' },
  { id: 'adriennes_pizza', name: 'Adrienne\'s Pizzabar', cuisines: ['pizza'],     area: 'Lower Manhattan', price: '$$',  neighborhood: 'Financial District',  description: 'Old-school FiDi square pizza — thin-crusted, crispy-bottomed rectangular pies beloved by Wall Street workers.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Adrienne\'s+Pizzabar+New+York' },
  { id: 'dead_rabbit',     name: 'The Dead Rabbit',     cuisines: ['bar_tavern'], area: 'Lower Manhattan', price: '$$$', neighborhood: 'Financial District',  description: 'World\'s best bar (multiple awards) — impeccably researched 19th-century cocktails in a Victorian Irish pub.', reservationUrl: 'https://www.deadrabbitnyc.com', mapsUrl: 'https://maps.google.com/?q=The+Dead+Rabbit+New+York' },
  { id: 'fraunces_tavern', name: 'Fraunces Tavern',     cuisines: ['american','bar_tavern'], area: 'Lower Manhattan', price: '$$', neighborhood: 'Financial District', description: 'Where Washington bade farewell to his officers in 1783 — history in every brick, classic pub fare, beer.', reservationUrl: 'https://www.frauncestavern.com', mapsUrl: 'https://maps.google.com/?q=Fraunces+Tavern+New+York' },
  { id: 'bareburger_fidi', name: 'Bareburger',          cuisines: ['burger'],     area: 'Lower Manhattan', price: '$$',  neighborhood: 'Financial District',  description: 'Organic, all-natural burgers with creative toppings — bison, elk, turkey, or beef on a pretzel bun.',       reservationUrl: 'https://www.bareburger.com', mapsUrl: 'https://maps.google.com/?q=Bareburger+Financial+District+New+York' },
  { id: 'delmonicos',      name: 'Delmonico\'s',        cuisines: ['steakhouse'], area: 'Lower Manhattan', price: '$$$$', neighborhood: 'Financial District', description: 'America\'s oldest restaurant (1837) — the birthplace of Delmonico steak, Eggs Benedict, and Baked Alaska.', reservationUrl: 'https://www.opentable.com/delmonicos', mapsUrl: 'https://maps.google.com/?q=Delmonico\'s+New+York' },

  // ── HARLEM ──
  { id: 'sylvias',         name: 'Sylvia\'s',           cuisines: ['american'],   area: 'Harlem', price: '$$',  neighborhood: 'Harlem',            description: 'Harlem\'s soul food institution since 1962 — smothered chicken, candied yams, cornbread, and legendary gospel brunch.', reservationUrl: 'https://www.sylviasrestaurant.com', mapsUrl: 'https://maps.google.com/?q=Sylvia\'s+Restaurant+Harlem+New+York' },
  { id: 'raos',            name: 'Rao\'s',              cuisines: ['italian'],    area: 'Harlem', price: '$$$$', neighborhood: 'East Harlem',       description: 'The most impossible table in NYC — 10-table Italian red-sauce institution since 1896. Try their jarred sauce.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Rao\'s+New+York' },
  { id: 'patsys_pizza',    name: 'Patsy\'s Pizzeria',   cuisines: ['pizza'],      area: 'Harlem', price: '$',   neighborhood: 'East Harlem',       description: 'The original 1933 location — coal-fired pies that Frank Sinatra famously had flown across the country.',        reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Patsy\'s+Pizzeria+East+Harlem+New+York' },
  { id: 'ginnys',          name: 'Ginny\'s Supper Club', cuisines: ['bar_tavern','american'], area: 'Harlem', price: '$$$', neighborhood: 'Harlem', description: 'Marcus Samuelsson\'s underground jazz supper club at Red Rooster — live music, cocktails, and soulful bites.', reservationUrl: 'https://www.ginnyssupperclub.com', mapsUrl: 'https://maps.google.com/?q=Ginny\'s+Supper+Club+Harlem+New+York' },
  { id: 'lonni_bar',       name: 'Lonni\'s Bar & Lounge', cuisines: ['bar_tavern'], area: 'Harlem', price: '$$', neighborhood: 'Harlem',           description: 'Iconic Harlem neighborhood bar with a deep history in the local jazz and arts community.',                   reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Harlem+bar+New+York' },

  // ── BROOKLYN ──
  { id: 'lucali',          name: 'Lucali',              cuisines: ['pizza'],      area: 'Brooklyn', price: '$$',  neighborhood: 'Carroll Gardens',   description: 'Arguably NYC\'s best pizza — thin-crust masterpieces handmade by Mark Iacono in a tiny cash-only BYOB room.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Lucali+Pizza+Brooklyn' },
  { id: 'peter_luger',     name: 'Peter Luger Steak House', cuisines: ['steakhouse'], area: 'Brooklyn', price: '$$$$', neighborhood: 'Williamsburg', description: 'NYC\'s most iconic steakhouse since 1887 — cash-only, porterhouse-only, tableside creamed spinach, no frills.', reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Peter+Luger+Steak+House+Brooklyn' },
  { id: 'frankies_457',    name: 'Frankies 457 Spuntino', cuisines: ['italian'], area: 'Brooklyn', price: '$$',  neighborhood: 'Carroll Gardens',   description: 'Rustic neighborhood Italian — hand-rolled meatballs, cacio e pepe, ricotta toasts in a candle-lit garden.', reservationUrl: 'https://www.frankiesspuntino.com', mapsUrl: 'https://maps.google.com/?q=Frankies+457+Spuntino+Brooklyn' },
  { id: 'insa_korean',     name: 'Insa',                cuisines: ['korean'],     area: 'Brooklyn', price: '$$$', neighborhood: 'Gowanus',           description: 'Korean BBQ and karaoke under one roof — premium galbi, wagyu short ribs, and private karaoke rooms.',        reservationUrl: 'https://www.insabrooklyn.com', mapsUrl: 'https://maps.google.com/?q=Insa+Korean+BBQ+Brooklyn' },
  { id: 'okonomi_bk',      name: 'Okonomi',             cuisines: ['japanese'],   area: 'Brooklyn', price: '$$',  neighborhood: 'Williamsburg',      description: 'Intimate all-day Japanese breakfast and lunch omakase — pristine simplicity using the finest seasonal ingredients.', reservationUrl: 'https://www.opentable.com/okonomi', mapsUrl: 'https://maps.google.com/?q=Okonomi+Williamsburg+Brooklyn' },
  { id: 'brooklyn_inn',    name: 'Brooklyn Inn',         cuisines: ['bar_tavern'], area: 'Brooklyn', price: '$',   neighborhood: 'Cobble Hill',       description: 'Historic 1800s bar with original mahogany furniture — quiet, literary, the perfect neighborhood pub.',         reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Brooklyn+Inn+Cobble+Hill' },
  { id: 'shake_bk',        name: 'Shake Shack (Bklyn)',  cuisines: ['burger'],     area: 'Brooklyn', price: '$',   neighborhood: 'Brooklyn Bridge Park', description: 'The Brooklyn Bridge Park location — great burgers with an unbeatable view of Manhattan and the bridge.',    reservationUrl: 'https://www.shakeshack.com', mapsUrl: 'https://maps.google.com/?q=Shake+Shack+Brooklyn+Bridge+Park' },

  // ── BRONX ──
  { id: 'roberto_bronx',   name: 'Roberto Restaurant',  cuisines: ['italian'],    area: 'Bronx', price: '$$$',  neighborhood: 'Belmont (Bronx)',   description: 'Arthur Avenue\'s finest — authentic Calabrian Italian in the heart of the Bronx\'s Little Italy since 1983.', reservationUrl: 'https://www.opentable.com/roberto-restaurant-the-bronx', mapsUrl: 'https://maps.google.com/?q=Roberto+Restaurant+Bronx+New+York' },
  { id: 'zero_otto_nove',  name: 'Zero Otto Nove',      cuisines: ['pizza','italian'], area: 'Bronx', price: '$$', neighborhood: 'Belmont (Bronx)',  description: 'Wood-fired Neapolitan pizza on Arthur Avenue — the real Bronx Italian neighborhood experience.',             reservationUrl: 'https://www.opentable.com/zero-otto-nove', mapsUrl: 'https://maps.google.com/?q=Zero+Otto+Nove+Bronx+New+York' },
  { id: 'yankee_tavern',   name: 'Yankee Tavern',       cuisines: ['bar_tavern'], area: 'Bronx', price: '$$',   neighborhood: 'South Bronx',       description: 'Historic 1927 bar steps from Yankee Stadium — cold beer and classic bar food before the game.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Yankee+Tavern+Bronx+New+York' },

  // ── QUEENS ──
  { id: 'sik_gaek',        name: 'Sik Gaek',            cuisines: ['korean'],     area: 'Queens', price: '$$',   neighborhood: 'Woodside, Queens',  description: 'Outdoor Korean BBQ in a festive tent setting — whole octopus, kalbi, and soju by the bottle.',              reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Sik+Gaek+Queens+New+York' },
  { id: 'nan_xiang',       name: 'Nan Xiang Xiao Long Bao', cuisines: ['japanese'], area: 'Queens', price: '$', neighborhood: 'Flushing, Queens',  description: 'Flushing\'s most celebrated soup dumplings — paper-thin skin bursting with broth and pork.',               reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=Nan+Xiang+Xiao+Long+Bao+Queens' },
  { id: 'de_mole',         name: 'De Mole',             cuisines: ['american'],   area: 'Queens', price: '$$',   neighborhood: 'Sunnyside, Queens', description: 'Beloved neighborhood Mexican-American spot — complex moles, chiles rellenos, margaritas worth the trip.',    reservationUrl: null, mapsUrl: 'https://maps.google.com/?q=De+Mole+Sunnyside+Queens' },
]

function getRestaurantSuggestion(area, cuisineId, offset = 0) {
  // With cuisine: filter by area + cuisine, falling back to anywhere if the area has none of that cuisine.
  // Without cuisine: return any restaurant in the area (the "best of area" default so meal cards always show something).
  let pool
  if (cuisineId) {
    pool = RESTAURANT_DATA.filter(r => r.cuisines && r.cuisines.includes(cuisineId) && r.area === area)
    if (pool.length === 0) pool = RESTAURANT_DATA.filter(r => r.cuisines && r.cuisines.includes(cuisineId))
  } else {
    pool = RESTAURANT_DATA.filter(r => r.area === area)
  }
  if (pool.length === 0) return null
  return pool[offset % pool.length]
}

// How many alternatives are available for this (area, cuisine) combo — used to know when to dim the refresh button.
function countRestaurantOptions(area, cuisineId) {
  if (cuisineId) {
    const local = RESTAURANT_DATA.filter(r => r.cuisines && r.cuisines.includes(cuisineId) && r.area === area)
    if (local.length > 0) return local.length
    return RESTAURANT_DATA.filter(r => r.cuisines && r.cuisines.includes(cuisineId)).length
  }
  return RESTAURANT_DATA.filter(r => r.area === area).length
}

// Haversine distance between two lat/lng points, in miles.
function distanceMiles(a, b) {
  const R = 3958.8
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(x))
}

// Rough NYC travel-time estimate between two venueCoords entries.
// Walking ~3.3 mph; subway adds platform/wait overhead; taxi assumed faster than subway for medium distances.
function estimateTravel(fromId, toId) {
  const a = venueCoords[fromId]
  const b = venueCoords[toId]
  if (!a || !b) return null
  const miles = distanceMiles(a, b)
  if (miles < 0.35) return { mode: 'walk',   icon: '🚶', mins: Math.max(4, Math.round(miles * 20)) }
  if (miles < 1.0)  return { mode: 'walk',   icon: '🚶', mins: Math.round(miles * 18) }
  if (miles < 6)    return { mode: 'subway', icon: '🚇', mins: Math.round(12 + miles * 4) }
  return                  { mode: 'taxi',   icon: '🚕', mins: Math.round(10 + miles * 3) }
}
// ── Plan Error Boundary ─────────────────────────────────────────────────────
// ── SavedPlanSummary: read-only view of the plan the user just saved ──────────
function SavedPlanSummary({ snapshot, onBack }) {
  const [shareCopied, setShareCopied] = React.useState(false)
  if (!snapshot) return null
  const { savedAt, venueIds, tripDays: snapTripDays, lunchCuisine, dinnerCuisine, mealCuisines, lunchRestaurants, dinnerRestaurants } = snapshot
  const days = capDays(buildItinerary(venueIds), snapTripDays)

  const PERIOD_COLORS = {
    Morning:   { bg: '#fef9c3', text: '#854d0e', dot: '#ca8a04' },
    Afternoon: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
    Evening:   { bg: '#ede9fe', text: '#5b21b6', dot: '#7c3aed' },
  }
  const cuisineLabel = c => CUISINE_OPTIONS.find(o => o.id === c)?.label || c
  // Backward-compat readers: new snapshots key restaurants by dayIdx; old snapshots used day.area.
  const lunchAt  = (dayIdx, day) => lunchRestaurants?.[dayIdx]  ?? lunchRestaurants?.[day.area]
  const dinnerAt = (dayIdx, day) => dinnerRestaurants?.[dayIdx] ?? dinnerRestaurants?.[day.area]
  const lunchCuisineAt  = (dayIdx) => mealCuisines?.[`${dayIdx}:lunch`]  ?? lunchCuisine
  const dinnerCuisineAt = (dayIdx) => mealCuisines?.[`${dayIdx}:dinner`] ?? dinnerCuisine

  function buildRouteUrl() {
    const waypoints = []
    days.forEach((day, di) => {
      const lunchR = lunchAt(di, day)
      const dinnerR = dinnerAt(di, day)
      let lunchAdded = false, dinnerAdded = false
      const hasAfternoon = (day.stops || []).some(s => s.period === 'Afternoon')
      ;(day.stops || []).forEach(stop => {
        if (!lunchAdded && lunchR && (stop.period === 'Afternoon' || (!hasAfternoon && stop.period === 'Evening'))) {
          waypoints.push(lunchR.name + ', ' + lunchR.neighborhood + ', New York')
          lunchAdded = true
        }
        if (!dinnerAdded && dinnerR && stop.period === 'Evening') {
          waypoints.push(dinnerR.name + ', ' + dinnerR.neighborhood + ', New York')
          dinnerAdded = true
        }
        const v = venues[stop.id]
        waypoints.push(v?.address || stop.name + ', New York')
      })
      if (!lunchAdded && lunchR) waypoints.push(lunchR.name + ', ' + lunchR.neighborhood + ', New York')
      if (!dinnerAdded && dinnerR) waypoints.push(dinnerR.name + ', ' + dinnerR.neighborhood + ', New York')
    })
    if (waypoints.length === 0) return null
    return 'https://www.google.com/maps/dir/' + waypoints.map(w => encodeURIComponent(w)).join('/')
  }

  function buildShareText() {
    const lines = ['🗽 My NYC Trip' + (days.length > 1 ? ` — ${days.length} Days` : ''), '']
    days.forEach((day, di) => {
      lines.push(`Day ${di + 1}${day.area ? ' · ' + day.area : ''}`)
      day.stops.forEach(stop => {
        const v = venues[stop.id]
        const timeStr = stop.startHour != null
          ? (() => {
              const h = Math.floor(stop.startHour)
              const mm = stop.startHour % 1 === 0.5 ? '30' : '00'
              const ampm = h >= 12 ? 'pm' : 'am'
              return (h > 12 ? h - 12 : h || 12) + ':' + mm + ampm
            })()
          : ''
        lines.push(`  ${timeStr ? timeStr + ' · ' : ''}${v?.name || stop.id}${v?.neighborhood ? ' (' + v.neighborhood + ')' : ''}`)
      })
      const lR = lunchAt(di, day)
      const dR = dinnerAt(di, day)
      if (lR)  lines.push(`  Lunch: ${lR.name}`)
      if (dR)  lines.push(`  Dinner: ${dR.name}`)
      lines.push('')
    })
    lines.push('Built with NYC Tonight · nyc-learn.vercel.app')
    return lines.join('\n')
  }

  function handleShare() {
    const text = buildShareText()
    if (navigator.share) {
      navigator.share({ title: 'My NYC Trip', text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2500)
      }).catch(() => {
        const w = window.open('', '_blank')
        w.document.write('<pre style="font-family:monospace;padding:20px">' + text.replace(/</g,'&lt;') + '</pre>')
      })
    }
  }

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--gray-100)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--gray-400)', padding: '0 4px 0 0', lineHeight: 1 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>Saved plan</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 1 }}>
            {new Date(savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {' · '}{venueIds.length} stop{venueIds.length !== 1 ? 's' : ''}
            {snapTripDays ? ` · ${snapTripDays} day${snapTripDays !== 1 ? 's' : ''}` : ''}
            {(() => {
              const count = mealCuisines ? Object.keys(mealCuisines).length : ((lunchCuisine ? 1 : 0) + (dinnerCuisine ? 1 : 0))
              return count > 0 ? ` · ${count} meal${count !== 1 ? 's' : ''} picked` : ''
            })()}
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '4px 10px', borderRadius: 20 }}>✓ Saved</span>
      </div>

      {/* Itinerary */}
      <div style={{ padding: '12px 20px 0' }}>
        {days.map((day, dayIdx) => {
          const lunchR  = lunchAt(dayIdx, day)
          const dinnerR = dinnerAt(dayIdx, day)
          const hasAfternoon = (day.stops || []).some(s => s.period === 'Afternoon')
          const renderItems = []
          let lunchAdded = false, dinnerAdded = false
          ;(day.stops || []).forEach(stop => {
            if (!lunchAdded && lunchR && (stop.period === 'Afternoon' || (!hasAfternoon && stop.period === 'Evening'))) {
              renderItems.push({ type: 'meal', meal: 'lunch', r: lunchR, cuisine: lunchCuisineAt(dayIdx) })
              lunchAdded = true
            }
            if (!dinnerAdded && dinnerR && stop.period === 'Evening') {
              renderItems.push({ type: 'meal', meal: 'dinner', r: dinnerR, cuisine: dinnerCuisineAt(dayIdx) })
              dinnerAdded = true
            }
            renderItems.push({ type: 'stop', stop })
          })
          if (!lunchAdded && lunchR) renderItems.push({ type: 'meal', meal: 'lunch', r: lunchR, cuisine: lunchCuisineAt(dayIdx) })
          if (!dinnerAdded && dinnerR) renderItems.push({ type: 'meal', meal: 'dinner', r: dinnerR, cuisine: dinnerCuisineAt(dayIdx) })

          return (
            <div key={dayIdx} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ background: 'var(--gray-900)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>
                  {getDayLabel(dayIdx, null).toUpperCase()}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-700)' }}>{day.area}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {renderItems.map((item, i) => {
                  if (item.type === 'meal') {
                    const isLunch = item.meal === 'lunch'
                    return (
                      <div key={`meal-${i}`} style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ fontSize: 18, marginTop: 1 }}>{isLunch ? '🍴' : '🌙'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                            {isLunch ? 'Lunch' : 'Dinner'} · {cuisineLabel(item.cuisine)}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{item.r.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.r.price} · {item.r.neighborhood}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          {item.r.reservationUrl && (
                            <a href={item.r.reservationUrl} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 11, fontWeight: 700, background: '#ea580c', color: '#fff', padding: '5px 8px', borderRadius: 7, textDecoration: 'none' }}>
                              Reserve →
                            </a>
                          )}
                          <a href={item.r.mapsUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 11, fontWeight: 600, background: 'var(--gray-200)', color: 'var(--gray-700)', padding: '5px 8px', borderRadius: 7, textDecoration: 'none' }}>
                            📍
                          </a>
                        </div>
                      </div>
                    )
                  }
                  const stop = item.stop
                  const pc = PERIOD_COLORS[stop.period] || PERIOD_COLORS.Afternoon
                  return (
                    <div key={stop.id} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ background: pc.bg, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: pc.dot, display: 'inline-block' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: pc.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {stop.period} · {fmtHour(stop.startHour)}
                        </span>
                        <span style={{ marginLeft: 'auto', fontSize: 11, color: pc.text, opacity: 0.7 }}>
                          ~{stop.duration < 1 ? `${Math.round(stop.duration * 60)} min` : stop.duration % 1 === 0 ? `${stop.duration} hrs` : `${stop.duration.toFixed(1)} hrs`}
                        </span>
                      </div>
                      <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{stop.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{stop.neighborhood}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {dayIdx < days.length - 1 && (
                <div style={{ textAlign: 'center', color: 'var(--gray-300)', fontSize: 20, marginTop: 16 }}>···</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Open route button */}
      <div style={{ padding: '4px 20px 100px' }}>
        {(() => {
          const url = buildRouteUrl()
          return url ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px', borderRadius: 12, background: '#1a56db', color: '#fff',
                  fontSize: 15, fontWeight: 700, textDecoration: 'none', flex: 1 }}>
                <span>🗺️</span><span>Open full route in Maps</span>
              </a>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '14px 18px', borderRadius: 12, background: 'var(--gray-100)', color: 'var(--gray-800)',
                  border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 18 }}>{shareCopied ? '✓' : '↑'}</span>
                <span>{shareCopied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          ) : null
        })()}
      </div>
    </div>
  )
}

class PlanErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, err: '' } }
  static getDerivedStateFromError(e) { return { hasError: true, err: String(e) } }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>
          Couldn't build your plan
        </div>
        <div style={{ fontSize: 12, color: 'var(--gray-500)', fontFamily: 'monospace', marginTop: 8 }}>
          {this.state.err}
        </div>
      </div>
    )
    return this.props.children
  }
}

// ── Plan Screen ──────────────────────────────────────────────────────────────
function getDayLabel(dayIndex, tripStartDate) {
  if (!tripStartDate) return 'Day ' + (dayIndex + 1)
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  // Parse as local date (avoid UTC offset issues)
  const parts = tripStartDate.split('-').map(Number)
  const d = new Date(parts[0], parts[1] - 1, parts[2] + dayIndex)
  return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate()
}

function PlanScreen({ savedItems, toggleSave, onSelectSaved, venueNotes = {}, setVenueNote = () => {}, userVenues = {}, removeUserVenue = () => {} }) {
  // Per-meal-per-day cuisine. Keyed by `${dayIdx}:${meal}` → cuisineId. Each meal stands alone — no trip-level default.
  const [mealCuisines, setMealCuisines] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_meal_cuisines') || '{}') } catch { return {} }
  })
  function getMealCuisine(dayIdx, meal) {
    return mealCuisines[`${dayIdx}:${meal}`] || null
  }
  function setMealCuisine(dayIdx, meal, cuisineId) {
    setMealCuisines(prev => {
      const next = { ...prev }
      const key = `${dayIdx}:${meal}`
      if (cuisineId == null) delete next[key]; else next[key] = cuisineId
      try { localStorage.setItem('nyc_meal_cuisines', JSON.stringify(next)) } catch {}
      return next
    })
  }
  // Which meal card currently has its cuisine picker expanded — only one open at a time to keep things tidy.
  const [openMealPicker, setOpenMealPicker] = React.useState(null)
  function toggleMealPicker(dayIdx, meal) {
    const key = `${dayIdx}:${meal}`
    setOpenMealPicker(prev => prev === key ? null : key)
  }
  const [planSaved, setPlanSaved] = React.useState(false)
  const [savedPlanView, setSavedPlanView] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  // Settings drawer is collapsed by default so the actual plan leads.
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  // Per-day collapse — Set of day indices the user has folded up. Persisted so it survives reload.
  const [collapsedDays, setCollapsedDays] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nyc_collapsed_days') || '[]')) } catch { return new Set() }
  })
  function toggleDayCollapsed(dayIdx) {
    setCollapsedDays(prev => {
      const next = new Set(prev)
      if (next.has(dayIdx)) next.delete(dayIdx); else next.add(dayIdx)
      try { localStorage.setItem('nyc_collapsed_days', JSON.stringify([...next])) } catch {}
      return next
    })
  }
  // Per-(meal, dayIdx) offset for "show me another" — keys like 'lunch:0'. Per-day so each day cycles independently.
  const [restaurantOffsets, setRestaurantOffsets] = React.useState({})
  function bumpRestaurantOffset(meal, dayIdx) {
    setRestaurantOffsets(prev => ({ ...prev, [`${meal}:${dayIdx}`]: (prev[`${meal}:${dayIdx}`] || 0) + 1 }))
  }
  const _storedTripDays = (() => { try { return JSON.parse(localStorage.getItem('nyc_trip_days') || 'null') } catch { return null } })()
  const [tripDays, setTripDays] = React.useState(_storedTripDays)
  const [tripStartDate, setTripStartDate] = React.useState(() => {
    try { return localStorage.getItem('nyc_trip_start_date') || '' } catch { return '' }
  })

  function setAndStoreTripDays(val) {
    setTripDays(val)
    localStorage.setItem('nyc_trip_days', JSON.stringify(val))
  }

  function setAndStoreTripStartDate(val) {
    setTripStartDate(val)
    try { if (val) localStorage.setItem('nyc_trip_start_date', val); else localStorage.removeItem('nyc_trip_start_date') } catch {}
  }

  // Collect venue IDs: directly saved venues + venues from saved works
  const safeItems = savedItems && typeof savedItems === 'object' ? savedItems : {}

  // All venue IDs reachable from saved items
  const venueIdSet = new Set()
  Object.values(safeItems).forEach(item => {
    if (!item || typeof item !== 'object') return
    if (item.type === 'venue' && item.id) venueIdSet.add(item.id)
    if (item.type === 'user_venue' && item.id) venueIdSet.add(item.id)
    if (item.type === 'work' && item.id) {
      const w = works[item.id]
      if (w?.venueId) venueIdSet.add(w.venueId)
    }
  })
  // Accept curated venues OR user-added venues; everything else is filtered out.
  const allVenueIds = [...venueIdSet].filter(id => !!venues[id] || !!userVenues[id])

  // Plan selection — which of those venues to include in today's itinerary
  const _storedSel   = (() => { try { return JSON.parse(localStorage.getItem('nyc_plan_sel')   || 'null') } catch { return null } })()
  const _storedKnown = (() => { try { return JSON.parse(localStorage.getItem('nyc_plan_known') || 'null') } catch { return null } })()
  // First visit → select everything; returning visit → use exact stored selection
  const [planSelection, setPlanSelection] = React.useState(() => new Set(_storedSel ?? allVenueIds))

  // Only auto-add venues the user has never seen before (genuinely new saves)
  React.useEffect(() => {
    const known = new Set(_storedKnown || [])
    const brandNew = allVenueIds.filter(id => !known.has(id))
    // Always update the known set
    const updatedKnown = new Set([...known, ...allVenueIds])
    localStorage.setItem('nyc_plan_known', JSON.stringify([...updatedKnown]))
    // Add only brand-new venues to the selection
    if (brandNew.length > 0) {
      setPlanSelection(prev => {
        const next = new Set(prev)
        brandNew.forEach(id => next.add(id))
        localStorage.setItem('nyc_plan_sel', JSON.stringify([...next]))
        return next
      })
    }
  }, [allVenueIds.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  function toggleVenueInPlan(id) {
    setPlanSelection(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      localStorage.setItem('nyc_plan_sel', JSON.stringify([...next]))
      return next
    })
  }

  // ── Swap + period + day override state (must be before venueIds computation) ──
  const [periodOverrides, setPeriodOverrides] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_period_overrides') || '{}') } catch { return {} }
  })
  const [venueSwaps, setVenueSwaps] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_venue_swaps') || '{}') } catch { return {} }
  })
  // Map of venueId → desired day index. Lets users move e.g. The Met from Day 2 to Day 1.
  const [stopDayOverrides, setStopDayOverrides] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_stop_day_overrides') || '{}') } catch { return {} }
  })
  const [swapModal, setSwapModal] = React.useState(null) // {venueId, domain}

  function moveStopToDay(venueId, targetDayIdx) {
    const next = { ...stopDayOverrides, [venueId]: targetDayIdx }
    setStopDayOverrides(next)
    try { localStorage.setItem('nyc_stop_day_overrides', JSON.stringify(next)) } catch {}
  }

  function getSwapCandidates(domain, excludeIds) {
    return Object.entries(venueCoords)
      .filter(([id, info]) => info.domain === domain && !excludeIds.has(id) && venues[id])
      .map(([id]) => id)
      .slice(0, 6)
  }

  const venueIds = allVenueIds.filter(id => planSelection.has(id)).map(id => venueSwaps[id] || id)
  const _rawDays = buildItinerary(venueIds, userVenues)

  // Apply user's day-reassignment overrides on top of the auto-built itinerary.
  // A stop with no override stays where buildItinerary put it.
  const _redistributedDays = (() => {
    if (Object.keys(stopDayOverrides).length === 0) return _rawDays
    // Flatten stops with their original day index, then re-bucket by override
    const flat = []
    _rawDays.forEach((day, di) => {
      day.stops.forEach(s => flat.push({ stop: s, originalDay: di }))
    })
    const dayStops = _rawDays.map(() => [])
    flat.forEach(({ stop, originalDay }) => {
      const targetDay = stopDayOverrides[stop.id]
      const effectiveDay = (targetDay != null && targetDay >= 0 && targetDay < _rawDays.length)
        ? targetDay : originalDay
      dayStops[effectiveDay].push(stop)
    })
    // Rebuild days with reassigned stops; preserve area label or recompute from dominant area
    return _rawDays.map((day, di) => {
      const stops = dayStops[di]
      if (stops.length === 0) return { ...day, stops: [] }
      const areaCount = {}
      stops.forEach(s => { areaCount[s.area] = (areaCount[s.area] || 0) + 1 })
      const dominantArea = Object.entries(areaCount).sort((a, b) => b[1] - a[1])[0][0]
      return { ...day, area: dominantArea, stops }
    })
  })()

  const days = _redistributedDays.map(day => ({
    ...day,
    stops: day.stops.map(stop => ({
      ...stop,
      period: periodOverrides[stop.id] || stop.period,
    }))
  }))

  // Build plain-text share summary of itinerary
  function buildShareText() {
    const lines = ['🗽 My NYC Trip' + (days.length > 1 ? ` — ${days.length} Days` : ''), '']
    days.forEach((day, di) => {
      lines.push(`Day ${di + 1}${day.area ? ' · ' + day.area : ''}`)
      day.stops.forEach(stop => {
        const v = venues[stop.id] || userVenues[stop.id]
        const timeStr = stop.startHour != null
          ? (() => {
              const h = Math.floor(stop.startHour)
              const mm = stop.startHour % 1 === 0.5 ? '30' : '00'
              const ampm = h >= 12 ? 'pm' : 'am'
              return (h > 12 ? h - 12 : h || 12) + ':' + mm + ampm
            })()
          : ''
        lines.push(`  ${timeStr ? timeStr + ' · ' : ''}${v?.name || stop.name || stop.id}${v?.neighborhood ? ' (' + v.neighborhood + ')' : ''}`)
      })
      if (lunchRestaurants[di]) {
        lines.push(`  Lunch: ${lunchRestaurants[di].name}`)
      }
      if (dinnerRestaurants[di]) {
        lines.push(`  Dinner: ${dinnerRestaurants[di].name}`)
      }
      lines.push('')
    })
    lines.push('Built with NYC Tonight · nyc-learn.vercel.app')
    return lines.join('\n')
  }

  const [shareCopied, setShareCopied] = React.useState(false)
  function handleShare() {
    const text = buildShareText()
    if (navigator.share) {
      navigator.share({ title: 'My NYC Trip', text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2500)
      }).catch(() => {
        // Fallback: open in new window
        const w = window.open('', '_blank')
        w.document.write('<pre style="font-family:monospace;padding:20px">' + text.replace(/</g,'&lt;') + '</pre>')
      })
    }
  }

    // Build a Google Maps multi-stop directions URL from the itinerary
  function buildRouteUrl() {
    const waypoints = []
    days.forEach((day, di) => {
      const stops = day.stops || []
      const lunchR = lunchRestaurants[di]
      const dinnerR = dinnerRestaurants[di]
      let lunchAdded = false
      let dinnerAdded = false
      const hasAfternoon = stops.some(s => s.period === 'Afternoon')
      stops.forEach(stop => {
        if (!lunchAdded && lunchR && (stop.period === 'Afternoon' || (!hasAfternoon && stop.period === 'Evening'))) {
          waypoints.push(lunchR.name + ', ' + lunchR.neighborhood + ', New York')
          lunchAdded = true
        }
        if (!dinnerAdded && dinnerR && stop.period === 'Evening') {
          waypoints.push(dinnerR.name + ', ' + dinnerR.neighborhood + ', New York')
          dinnerAdded = true
        }
        const v = venues[stop.id] || userVenues[stop.id]
        waypoints.push(v?.address || stop.address || stop.name + ', New York')
      })
      if (!lunchAdded && lunchR) waypoints.push(lunchR.name + ', ' + lunchR.neighborhood + ', New York')
      if (!dinnerAdded && dinnerR) waypoints.push(dinnerR.name + ', ' + dinnerR.neighborhood + ', New York')
    })
    if (waypoints.length === 0) return null
    return 'https://www.google.com/maps/dir/' + waypoints.map(w => encodeURIComponent(w)).join('/')
  }

  // Memoize restaurant picks per dayIdx (not per area) so each day can have its own cuisine + offset independently.
  const lunchRestaurants = React.useMemo(() => {
    const map = {}
    days.forEach((day, di) => {
      const cuisine = mealCuisines[`${di}:lunch`] || null
      const off = restaurantOffsets[`lunch:${di}`] || 0
      map[di] = getRestaurantSuggestion(day.area, cuisine, off)
    })
    return map
  }, [mealCuisines, restaurantOffsets])  // eslint-disable-line react-hooks/exhaustive-deps

  const dinnerRestaurants = React.useMemo(() => {
    const map = {}
    days.forEach((day, di) => {
      const cuisine = mealCuisines[`${di}:dinner`] || null
      const off = restaurantOffsets[`dinner:${di}`] || 0
      map[di] = getRestaurantSuggestion(day.area, cuisine, off)
    })
    return map
  }, [mealCuisines, restaurantOffsets])  // eslint-disable-line react-hooks/exhaustive-deps



  const DOMAIN_ICONS = {
    visual_art: '🎨', jazz: '🎷', classical_music: '🎼', theater: '🎭',
    history: '📜', architecture: '🏛️', sports: '🏆', hip_hop: '🎤',
  }
  const PERIOD_COLORS = {
    Morning:   { bg: '#fef9c3', text: '#854d0e', dot: '#ca8a04' },
    Afternoon: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
    Evening:   { bg: '#ede9fe', text: '#5b21b6', dot: '#7c3aed' },
  }

  const schedulingRef = React.useRef(null)

  // ── Today-checklist + reorder state ─────────────────────────────────────
  const _isArrivalToday = (() => {
    if (!tripStartDate) return false
    const p = tripStartDate.split('-').map(Number)
    return new Date(p[0], p[1]-1, p[2]).toDateString() === new Date().toDateString()
  })()
  const [todayMode, setTodayMode] = React.useState(_isArrivalToday)
  // Per-card expanded-options state. Tapping "⋯" on a stop reveals period/swap/move controls.
  const [expandedStopId, setExpandedStopId] = React.useState(null)
  const [checkedStops, setCheckedStops] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nyc_checked_stops') || '[]')) } catch { return new Set() }
  })
  const [stopOrderOverride, setStopOrderOverride] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_stop_order') || 'null') } catch { return null }
  })

  function toggleChecked(id) {
    setCheckedStops(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem('nyc_checked_stops', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  function moveStop(venueId, dir) {
    const allStopIds = days.flatMap(d => d.stops.map(s => s.id))
    const base = stopOrderOverride || allStopIds
    const idx = base.indexOf(venueId)
    if (idx === -1) return
    const next = [...base]
    const to = idx + dir
    if (to < 0 || to >= next.length) return
    ;[next[idx], next[to]] = [next[to], next[idx]]
    setStopOrderOverride(next)
    try { localStorage.setItem('nyc_stop_order', JSON.stringify(next)) } catch {}
  }

  // ── Drag-to-reorder state ────────────────────────────────────────────
  const stopCardRefs  = React.useRef({})
  const dragTimerRef  = React.useRef(null)
  const [dragId,      setDragId]      = React.useState(null)
  const [dragDayIdx,  setDragDayIdx]  = React.useState(null)
  const [dragOrder,   setDragOrder]   = React.useState(null)
  const [dayItemOrders, setDayItemOrders] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_day_item_orders') || '{}') } catch { return {} }
  })

  // Prevent page scroll while a card is being dragged
  React.useEffect(() => {
    if (!dragId) return
    function noScroll(e) { e.preventDefault() }
    document.addEventListener('touchmove', noScroll, { passive: false })
    return () => document.removeEventListener('touchmove', noScroll)
  }, [dragId])

  // itemId can be a stop id, '__lunch__', or '__dinner__'
  // defaultItemIds is the auto-computed ordered list for the day.
  // Wanderlog-style: drag activates immediately on press of the grip handle (no separate Reorder mode).
  function onItemTouchStart(e, itemId, thisDayIdx, defaultItemIds) {
    const point = e.touches ? e.touches[0] : e
    const startY = point.clientY
    // Vibrate so users know drag activated.
    navigator.vibrate?.(20)
    const base = dayItemOrders[thisDayIdx] || defaultItemIds
    setDragId(itemId)
    setDragDayIdx(thisDayIdx)
    setDragOrder([...base])
    dragTimerRef.current = { startY }
  }

  function onItemTouchMove(e, itemId) {
    if (dragId !== itemId) return
    const point = e.touches ? e.touches[0] : e
    const y = point.clientY
    if (!dragOrder) return
    // Reorder: find where finger is among the other cards
    const others = dragOrder.filter(id => id !== itemId)
    let insertIdx = others.length
    for (let i = 0; i < others.length; i++) {
      const el = stopCardRefs.current[others[i]]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (y < rect.top + rect.height * 0.5) { insertIdx = i; break }
    }
    const next = [...others]
    next.splice(insertIdx, 0, itemId)
    if (next.join(',') !== dragOrder.join(',')) setDragOrder(next)
  }

  function onItemTouchEnd(itemId, thisDayIdx) {
    if (dragId === itemId && dragOrder) {
      // Save full item order (stops + meals) for this day
      const nextDayOrders = { ...dayItemOrders, [thisDayIdx]: dragOrder }
      setDayItemOrders(nextDayOrders)
      try { localStorage.setItem('nyc_day_item_orders', JSON.stringify(nextDayOrders)) } catch {}
      // Also sync stop-only order to stopOrderOverride for today-checklist
      const stopIds = dragOrder.filter(id => id !== '__lunch__' && id !== '__dinner__')
      setStopOrderOverride(stopIds)
      try { localStorage.setItem('nyc_stop_order', JSON.stringify(stopIds)) } catch {}
    }
    dragTimerRef.current = null
    setDragId(null)
    setDragDayIdx(null)
    setDragOrder(null)
  }

  // Mouse drag: we attach window-level mousemove/mouseup once drag starts.
  React.useEffect(() => {
    if (!dragId || !dragOrder) return
    function handleMove(e) { onItemTouchMove(e, dragId) }
    function handleUp() { onItemTouchEnd(dragId, dragDayIdx) }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragId, dragOrder, dragDayIdx])  // eslint-disable-line react-hooks/exhaustive-deps

  function orderedStops(rawStops) {
    const eff = dragOrder || stopOrderOverride
    if (!eff) return rawStops
    return [...rawStops].sort((a, b) => {
      const ai = eff.indexOf(a.id)
      const bi = eff.indexOf(b.id)
      return (ai === -1 ? 9999 : ai) - (bi === -1 ? 9999 : bi)
    })
  }

  // Restore saved snapshot on mount so returning users land on their plan
  const _snap = (() => { try { return JSON.parse(localStorage.getItem('nyc_plan_snapshot') || 'null') } catch { return null } })()
  // Show saved plan summary if user just saved OR if they're returning and have a snapshot
  if (savedPlanView && _snap) {
    return <SavedPlanSummary snapshot={_snap} onBack={() => setSavedPlanView(false)} />
  }

  // Stops + meal count for the header subtitle (totals across all days)
  const totalStops = days.reduce((n, d) => n + d.stops.length, 0)
  const totalMeals = days.reduce((n, d) => {
    const hasAft = d.stops.some(s => s.period === 'Afternoon')
    const hasEve = d.stops.some(s => s.period === 'Evening')
    return n + (d.stops.length > 0 ? 1 : 0) + (hasEve ? 1 : 0)  // always 1 lunch when there are stops + 1 dinner if any evening
  }, 0)

  return (
    <div className="screen">

      {/* ══ Header — branded to match Explore / Tonight ══ */}
      <div className="home-header">
        <div className="home-wordmark">My Trip</div>
        <div className="home-subtitle">
          {totalStops === 0
            ? 'Save venues and we’ll plan your day'
            : `${totalStops} stop${totalStops !== 1 ? 's' : ''} · ${totalMeals} meal${totalMeals !== 1 ? 's' : ''}${days.length > 1 ? ` · ${days.length} days` : ''}`}
        </div>
        <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 6, lineHeight: 1.4 }}>
          Plan your visit · Built from your saves
        </div>
      </div>

      {/* ══ Your Places — user-added venues. They auto-flow into the itinerary below. ══ */}
      {(() => {
        const userList = Object.values(userVenues || {}).sort((a, b) => b.savedAt - a.savedAt)
        if (userList.length === 0) return null
        const USER_CAT = { food:'🍴', drink:'🍷', art:'🎨', music:'🎵', history:'📜', sports:'🏆', shopping:'🛍️', other:'📍' }
        return (
          <div style={{ padding: '16px 20px 18px', borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-50)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-500)' }}>
                Your Places · {userList.length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>Added to your trip</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {userList.map(uv => {
                const emoji = USER_CAT[uv.category] || '📍'
                const inPlan = planSelection.has(uv.id)
                return (
                  <div key={uv.id} style={{
                    background: 'var(--white)', border: '1px solid var(--gray-200)',
                    borderRadius: 12, padding: '11px 12px',
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}>
                    <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.25 }}>
                        {uv.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>
                        {uv.neighborhood}
                      </div>
                      {uv.blurb && (
                        <div style={{
                          fontSize: 12, color: 'var(--gray-600)', marginTop: 5, lineHeight: 1.45,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {uv.blurb}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => toggleVenueInPlan(uv.id)}
                        title={inPlan ? 'Remove from this trip' : 'Add to this trip'}
                        style={{
                          padding: '4px 9px', borderRadius: 999,
                          background: inPlan ? 'var(--gray-900)' : 'var(--gray-100)',
                          color: inPlan ? '#fff' : 'var(--gray-500)',
                          border: 'none', cursor: 'pointer',
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                        }}
                      >
                        {inPlan ? '✓ In plan' : '+ Plan'}
                      </button>
                      <button
                        onClick={() => removeUserVenue(uv.id)}
                        title="Remove place"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 12, color: 'var(--gray-400)', padding: '2px 6px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ══ SECTION 1: Saved Plans ══ */}
      <div style={{ padding: '16px 20px 18px', borderBottom: '1px solid var(--gray-100)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: 12 }}>
          Saved Plans
        </div>

        {/* Empty state */}
        {!_snap && (
          <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>🗓️</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-800)', marginBottom: 6 }}>No plans yet</div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto 20px' }}>
              Head over to scheduling and start planning your trip.
            </div>
            <button
              onClick={() => schedulingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{
                background: 'var(--gray-900)', color: '#fff', border: 'none',
                borderRadius: 12, padding: '13px 32px',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Start Scheduling
            </button>
          </div>
        )}

        {/* Saved plan card */}
        {_snap && (
          <div style={{ position: 'relative' }}>
            {/* Confirm-delete overlay */}
            {confirmDelete && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                background: 'rgba(255,255,255,0.97)', borderRadius: 14,
                border: '1px solid var(--gray-200)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 16, padding: '20px 24px',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Remove this plan?</div>
                <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                  <button
                    onClick={() => {
                      try { localStorage.removeItem('nyc_plan_snapshot') } catch {}
                      setConfirmDelete(false)
                    }}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: 'var(--gray-900)', color: '#fff', fontWeight: 700, fontSize: 14,
                    }}
                  >
                    Yes, remove
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                      background: 'var(--gray-100)', color: 'var(--gray-700)', fontWeight: 600, fontSize: 14,
                      border: '1px solid var(--gray-200)',
                    }}
                  >
                    No, keep it
                  </button>
                </div>
              </div>
            )}

            {/* X delete button */}
            <button
              onClick={e => { e.stopPropagation(); setConfirmDelete(true) }}
              style={{
                position: 'absolute', top: 10, right: 12, zIndex: 5,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, fontSize: 13, fontWeight: 700, color: 'var(--gray-400)', lineHeight: 1,
              }}
            >
              ✕
            </button>

            {/* Card body */}
            <div
              onClick={() => setSavedPlanView(true)}
              style={{
                background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>🗓️</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>
                    {new Date(_snap.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: 20 }}>✓ Saved</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                  {_snap.venueIds?.length} stop{_snap.venueIds?.length !== 1 ? 's' : ''}
                  {_snap.tripDays ? ` · ${_snap.tripDays} day${_snap.tripDays !== 1 ? 's' : ''}` : ''}
                  {/* Show count of meals with cuisine set (new mealCuisines shape) or fall back to old format */}
                  {(() => {
                    const mealCount = _snap.mealCuisines ? Object.keys(_snap.mealCuisines).length
                      : ((_snap.lunchCuisine ? 1 : 0) + (_snap.dinnerCuisine ? 1 : 0))
                    return mealCount > 0 ? ` · ${mealCount} meal${mealCount !== 1 ? 's' : ''} picked` : ''
                  })()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 3, lineHeight: 1.4 }}>
                  {(_snap.venueIds || []).map(id => venues[id]?.name).filter(Boolean).join(' · ')}
                </div>
              </div>
              <span style={{ fontSize: 20, color: 'var(--gray-300)', flexShrink: 0 }}>›</span>
            </div>
          </div>
        )}
      </div>

      {/* ══ SECTION 2: Trip Settings drawer — collapsed by default so the plan leads ══ */}
      <div ref={schedulingRef} style={{ borderBottom: '1px solid var(--gray-100)' }}>
        <button onClick={() => setSettingsOpen(o => !o)} style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
          textAlign: 'left',
        }}>
          <span style={{ fontSize: 16 }}>⚙</span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
            Trip settings
          </span>
          <span style={{ fontSize: 11, color: 'var(--gray-400)', marginLeft: 4 }}>
            {tripDays ? `${tripDays} day${tripDays !== 1 ? 's' : ''}` : 'Auto'}
            {tripStartDate ? ' · arriving ' + tripStartDate.slice(5) : ''}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 16, color: 'var(--gray-400)', transition: 'transform 200ms', transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
            ⌄
          </span>
        </button>

        {settingsOpen && (
          <div style={{ padding: '4px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Trip length */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', flexShrink: 0, width: 78 }}>
                Length
              </span>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                {[null, 1, 2, 3, 4, 5, 6, 7].map(n => {
                  const active = tripDays === n
                  return (
                    <button key={n ?? 'auto'} onClick={() => setAndStoreTripDays(n)} style={{
                      flexShrink: 0, padding: '5px 13px', borderRadius: 20, border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: active ? 700 : 500,
                      background: active ? 'var(--gray-900)' : 'var(--gray-100)',
                      color: active ? '#fff' : 'var(--gray-500)',
                      transition: 'all 0.15s ease',
                    }}>
                      {n === null ? 'Auto' : n === 1 ? '1 day' : `${n} days`}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Arrival */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', flexShrink: 0, width: 78 }}>
                Arrival
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <input
                  type="date"
                  value={tripStartDate}
                  onChange={e => setAndStoreTripStartDate(e.target.value)}
                  style={{
                    flex: 1, padding: '5px 10px', borderRadius: 10,
                    border: '1.5px solid var(--gray-200)', fontSize: 12,
                    color: tripStartDate ? 'var(--gray-900)' : 'var(--gray-400)',
                    background: 'var(--white)', outline: 'none', fontFamily: 'inherit',
                  }}
                />
                {tripStartDate && (
                  <button onClick={() => setAndStoreTripStartDate('')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 11, color: 'var(--gray-400)', padding: '4px 8px',
                    borderRadius: 8, flexShrink: 0,
                  }}>✕ Clear</button>
                )}
              </div>
            </div>

            {/* Cuisine selection moved to each meal card — every meal can have its own cuisine now. */}

            {/* Planning with — 2-column grid for stop chips (cleaner alignment than free wrap) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gray-400)', flexShrink: 0, width: 78, paddingTop: 6 }}>
                Stops <span style={{ color: 'var(--gray-300)' }}>{venueIds.length}/{allVenueIds.length}</span>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 }}>
                  {allVenueIds.map(id => {
                    const v = venues[id] || userVenues[id]
                    if (!v) return null
                    const isUser = !venues[id] && !!userVenues[id]
                    const selected = planSelection.has(id)
                    const domainId = Object.keys(domains).find(d => domains[d].venues?.includes(id))
                    const userCatIcon = { food:'🍴', drink:'🍷', art:'🎨', music:'🎵', history:'📜', sports:'🏆', shopping:'🛍️', other:'📍' }
                    const icon = isUser
                      ? (userCatIcon[v.category] || '📍')
                      : ({ visual_art:'🎨', jazz:'🎷', classical_music:'🎼', theater:'🎭', history:'📜', architecture:'🏛️', sports:'🏆', hip_hop:'🎤' }[domainId] || '📍')
                    return (
                      <button
                        key={id}
                        onClick={() => toggleVenueInPlan(id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '6px 10px', borderRadius: 999, cursor: 'pointer',
                          fontSize: 11, fontWeight: 600,
                          background: selected ? 'var(--gray-900)' : 'var(--white)',
                          color: selected ? '#fff' : 'var(--gray-500)',
                          border: selected ? '1px solid var(--gray-900)' : '1px solid var(--gray-200)',
                          opacity: selected ? 1 : 0.7,
                          transition: 'all 0.15s ease',
                          minWidth: 0,
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>{icon}</span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{v.name}</span>
                      </button>
                    )
                  })}
                </div>
                {allVenueIds.length > 1 && venueIds.length < allVenueIds.length && (
                  <button onClick={() => { const s = new Set(allVenueIds); setPlanSelection(s); localStorage.setItem('nyc_plan_sel', JSON.stringify([...s])) }}
                    style={{ fontSize: 11, color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0 0', textDecoration: 'underline' }}>
                    Select all
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>



      {days.length === 0 && (
        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
          {venueIds.length === 0 && allVenueIds.length > 0 ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>☝️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>No stops selected</div>
              <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
                Tap a venue chip above to add it to your plan.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>Nothing to plan yet</div>
              <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto 20px' }}>
                Tap ♥ on any venue in Explore to add it here — or start with a sample weekend.
              </div>
              <button
                onClick={() => {
                  const SAMPLE = ['moma', 'guggenheim', 'village_vanguard', 'carnegie_hall', 'brooklyn', 'central_park']
                  const savedIds = new Set(Object.values(safeItems).filter(i => i?.type === 'venue').map(i => i.id))
                  SAMPLE.forEach(id => { if (!savedIds.has(id) && venues[id]) toggleSave('venue', id) })
                }}
                style={{
                  background: 'var(--gray-900)', color: '#fff', border: 'none',
                  borderRadius: 12, padding: '13px 28px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Build me a sample weekend
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Mode toggle: Plan / Today ── */}
      {days.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px 0' }}>
          <button onClick={() => setTodayMode(false)} style={{
            flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: todayMode ? 500 : 700,
            background: todayMode ? 'var(--gray-100)' : 'var(--gray-900)',
            color: todayMode ? 'var(--gray-500)' : '#fff',
          }}>
            🗓 Plan view
          </button>
          <button onClick={() => setTodayMode(true)} style={{
            flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: todayMode ? 700 : 500,
            background: todayMode ? 'var(--gray-900)' : 'var(--gray-100)',
            color: todayMode ? '#fff' : 'var(--gray-500)',
          }}>
            ✅ Today
          </button>
        </div>
      )}

      {/* ── Today checklist view ── */}
      {todayMode && days.length > 0 && (() => {
        const todayStops = orderedStops(days[0].stops)
        const total = todayStops.length
        const done = todayStops.filter(s => checkedStops.has(s.id)).length
        const pct = total > 0 ? Math.round((done / total) * 100) : 0
        return (
          <div style={{ padding: '16px 20px 32px' }}>
            {/* Progress bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>
                  {done === total && total > 0 ? '🎉 All done!' : `${done} of ${total} stops visited`}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{pct}%</div>
              </div>
              <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  background: done === total && total > 0 ? '#10b981' : 'var(--gray-900)',
                  width: pct + '%', transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            {/* Checklist stops */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todayStops.map((stop, i) => {
                const checked = checkedStops.has(stop.id)
                const pc = PERIOD_COLORS[stop.period] || PERIOD_COLORS.Afternoon
                return (
                  <button key={stop.id} onClick={() => toggleChecked(stop.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: checked ? 'var(--gray-50)' : 'var(--white)',
                    border: '1px solid ' + (checked ? 'var(--gray-200)' : 'var(--gray-200)'),
                    borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                    opacity: checked ? 0.55 : 1, transition: 'opacity 0.2s',
                  }}>
                    {/* Check circle */}
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      border: checked ? 'none' : '2px solid var(--gray-300)',
                      background: checked ? '#10b981' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {checked && <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15, fontWeight: 700, color: 'var(--gray-900)',
                        textDecoration: checked ? 'line-through' : 'none',
                      }}>
                        {DOMAIN_ICONS[stop.domain] || '📍'} {stop.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                        {stop.period} · {fmtHour(stop.startHour)} · {stop.neighborhood}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {done === total && total > 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0 0', fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>
                Amazing day — you've seen it all. 🗽
              </div>
            )}
          </div>
        )
      })()}

      {/* ── Plan view ── */}
      {!todayMode && days.map((day, dayIdx) => {
        const hasLunch = true
        const hasDinner = (day.stops || []).some(s => s.period === 'Evening')

        // Build render items: inject lunch before first Afternoon, dinner before first Evening
        // Lunch goes before first Afternoon stop, OR before first Evening stop if no Afternoon
        const hasAfternoon = day.stops.some(s => s.period === 'Afternoon')
        const renderItems = []
        let lunchInserted = false
        let dinnerInserted = false
        day.stops.forEach((stop, stopIdx) => {
          // Lunch: before Afternoon, or before Evening when no Afternoon stops exist
          if (!lunchInserted && hasLunch && (stop.period === 'Afternoon' || (!hasAfternoon && stop.period === 'Evening'))) {
            renderItems.push({ type: 'restaurant', meal: 'lunch' })
            lunchInserted = true
          }
          // Dinner: always before first Evening stop (after Lunch if both present)
          if (!dinnerInserted && hasDinner && stop.period === 'Evening') {
            renderItems.push({ type: 'restaurant', meal: 'dinner' })
            dinnerInserted = true
          }
          renderItems.push({ type: 'stop', stop })
        })
        // Fallback: if all stops are Morning-only, append Lunch then Dinner at end
        if (!lunchInserted && hasLunch) {
          renderItems.push({ type: 'restaurant', meal: 'lunch' })
        }
        if (!dinnerInserted && hasDinner) {
          renderItems.push({ type: 'restaurant', meal: 'dinner' })
        }

        // Day summary computation — drives the glance-level strip under the day header.
        const dayStops = day.stops
        const dayStartHour = dayStops[0]?.startHour ?? null
        const lastStop = dayStops[dayStops.length - 1]
        const dayEndHour = lastStop ? lastStop.startHour + lastStop.duration : null
        const hasEveningForDinner = dayStops.some(s => s.period === 'Evening')
        const summaryBits = []
        if (dayStartHour != null && dayEndHour != null) summaryBits.push(`${fmtHour(dayStartHour)} – ${fmtHour(dayEndHour)}`)
        summaryBits.push(`${dayStops.length} stop${dayStops.length !== 1 ? 's' : ''}`)
        if (dayStops.length > 0) {
          summaryBits.push(hasEveningForDinner ? 'Lunch + Dinner' : 'Lunch')
        }

        const isCollapsed = collapsedDays.has(dayIdx)
        return (
          <div key={dayIdx} style={{ padding: '16px 20px 0' }}>
            {/* Day header — whole row is tappable to fold/unfold this day */}
            <div
              onClick={() => toggleDayCollapsed(dayIdx)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer', userSelect: 'none' }}
            >
              {/* Chevron — rotates between expanded/collapsed states. Bigger touch target so it reads clearly. */}
              <span style={{
                fontSize: 18, fontWeight: 800, color: 'var(--gray-700)',
                width: 22, height: 22, textAlign: 'center', lineHeight: '22px',
                transition: 'transform 180ms ease',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}>▾</span>
              <div style={{
                background: 'var(--gray-900)', color: '#fff',
                fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                letterSpacing: '0.04em',
              }}>{getDayLabel(dayIdx, tripStartDate).toUpperCase()}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-700)' }}>{day.area}</div>
              {dayIdx === 0 && (
                <div style={{
                  marginLeft: 'auto', fontSize: 11, color: 'var(--gray-400)',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ fontSize: 13 }}>⠿</span>
                  <span>drag to reorder</span>
                </div>
              )}
            </div>

            {/* Day summary strip — glance-level info. Stays visible even when collapsed so users see what's in each day. */}
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: isCollapsed ? 20 : 12, lineHeight: 1.4, paddingLeft: 32 }}>
              {summaryBits.join(' · ')}
            </div>

            {/* Day map preview — numbered pins with venue labels. Hidden when day is collapsed. */}
            {!isCollapsed && (() => {
              const coords = dayStops.map(s => ({ ...s, c: venueCoords[s.id] })).filter(s => s.c)
              if (coords.length < 1) return null
              // Abbreviate venue names for label use (drops "The" prefix, caps length).
              const shortName = (n) => {
                let s = (n || '').replace(/^The\s+/i, '').trim()
                if (s.length > 18) s = s.slice(0, 17).trim() + '…'
                return s
              }
              const lats = coords.map(s => s.c.lat)
              const lngs = coords.map(s => s.c.lng)
              const minLat = Math.min(...lats), maxLat = Math.max(...lats)
              const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
              const padLat = Math.max((maxLat - minLat) * 0.22, 0.006)
              const padLng = Math.max((maxLng - minLng) * 0.22, 0.006)
              // Wider canvas so labels have room.
              const W = 360, H = coords.length === 1 ? 80 : 140
              const project = (c) => {
                const x = padLng === 0 ? W / 2 : ((c.lng - (minLng - padLng)) / ((maxLng + padLng) - (minLng - padLng))) * W
                const y = padLat === 0 ? H / 2 : H - ((c.lat - (minLat - padLat)) / ((maxLat + padLat) - (minLat - padLat))) * H
                return { x, y }
              }
              const pts = coords.map(s => ({ ...project(s.c), name: shortName(s.name) }))
              const polyline = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
              return (
                <div style={{ marginBottom: 14, borderRadius: 12, overflow: 'hidden', background: '#f5f6f4', border: '1px solid var(--gray-200)' }}>
                  <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    {/* Route polyline */}
                    {pts.length > 1 && (
                      <polyline points={polyline} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4,5" />
                    )}
                    {/* Numbered pins with venue labels — label placed left or right depending on pin position */}
                    {pts.map((p, i) => {
                      const labelLeft = p.x > W * 0.55  // right-half pins get left-side labels
                      const labelX = labelLeft ? p.x - 16 : p.x + 16
                      const anchor = labelLeft ? 'end' : 'start'
                      return (
                        <g key={i}>
                          {/* Label background pill so text stays readable over the polyline */}
                          <text x={labelX} y={p.y + 4} textAnchor={anchor}
                            fill="#fff" stroke="#fff" strokeWidth="3.5"
                            fontSize="11" fontWeight="700" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                            paintOrder="stroke" style={{ pointerEvents: 'none' }}>
                            {p.name}
                          </text>
                          <text x={labelX} y={p.y + 4} textAnchor={anchor}
                            fill="#374151"
                            fontSize="11" fontWeight="700" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                            style={{ pointerEvents: 'none' }}>
                            {p.name}
                          </text>
                          {/* Pin */}
                          <circle cx={p.x} cy={p.y} r="11" fill="#111" stroke="#fff" strokeWidth="2.5" />
                          <text x={p.x} y={p.y + 3.5} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
                            {i + 1}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                  {/* Small caption so first-time users know what they're looking at */}
                  <div style={{
                    padding: '6px 12px 8px', fontSize: 10, color: 'var(--gray-400)',
                    borderTop: '1px solid var(--gray-200)', background: 'var(--white)',
                    letterSpacing: '0.03em', textTransform: 'uppercase', fontWeight: 600,
                  }}>
                    Relative position of stops · not to scale
                  </div>
                </div>
              )
            })()}

            {/* Stops + restaurant cards — hidden when day is collapsed */}
            {!isCollapsed && (() => {
              const sortedDayStops = orderedStops(day.stops)
              // Build auto-ordered item ID list (stops interleaved with __lunch__/__dinner__ markers)
              const hasAfternoon2 = sortedDayStops.some(s => s.period === 'Afternoon')
              const hasDinner2 = sortedDayStops.some(s => s.period === 'Evening')
              const defaultItemIds = []
              let li2 = false, di2 = false
              sortedDayStops.forEach(stop => {
                if (!li2 && (stop.period === 'Afternoon' || (!hasAfternoon2 && stop.period === 'Evening'))) {
                  defaultItemIds.push('__lunch__'); li2 = true
                }
                if (!di2 && hasDinner2 && stop.period === 'Evening') {
                  defaultItemIds.push('__dinner__'); di2 = true
                }
                defaultItemIds.push(stop.id)
              })
              if (!li2) defaultItemIds.push('__lunch__')
              if (!di2 && hasDinner2) defaultItemIds.push('__dinner__')
              // Use live drag order (same day), saved order, or auto-computed default
              const isDraggingThisDay = dragId !== null && dragDayIdx === dayIdx
              const activeItemIds = isDraggingThisDay ? dragOrder : (dayItemOrders[dayIdx] || defaultItemIds)
              // Build reorderedItems from the active ordering
              const stopMap = {}; sortedDayStops.forEach(s => { stopMap[s.id] = s })
              const reorderedItems = activeItemIds
                .map(id => id === '__lunch__'  ? { type: 'restaurant', meal: 'lunch' }
                         : id === '__dinner__' ? { type: 'restaurant', meal: 'dinner' }
                         : stopMap[id]         ? { type: 'stop', stop: stopMap[id] }
                         : null)
                .filter(Boolean)
              const allStopIds = days.flatMap(d => d.stops.map(s => s.id))
              return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {reorderedItems.map((item, itemIdx) => {
                if (item.type === 'restaurant') {
                  const isLunch = item.meal === 'lunch'
                  const cuisine = getMealCuisine(dayIdx, item.meal)
                  const restaurant = isLunch ? (lunchRestaurants[dayIdx] ?? null) : (dinnerRestaurants[dayIdx] ?? null)
                  const cuisineOpt = CUISINE_OPTIONS.find(o => o.id === cuisine)
                  const mapsSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent((cuisineOpt?.label || 'restaurants') + ' near ' + day.area + ' New York')}`
                  const pickerKey = `${dayIdx}:${item.meal}`
                  const isPickerOpen = openMealPicker === pickerKey
                  const mealId = `__${item.meal}__`
                  return (
                    <div
                      key={`rest-${item.meal}`}
                      ref={el => { if (el) stopCardRefs.current[mealId] = el; else delete stopCardRefs.current[mealId] }}
                      style={{
                        background: dragId === mealId ? 'var(--gray-50)' : 'var(--white)',
                        border: dragId === mealId ? '2px solid var(--gray-400)' : '1px solid var(--gray-200)',
                        borderRadius: 14, padding: '14px 16px 14px 36px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        position: 'relative',
                        opacity: dragId !== null && dragId !== mealId ? 0.55 : 1,
                        transform: dragId === mealId ? 'scale(1.025)' : 'scale(1)',
                        boxShadow: dragId === mealId ? '0 8px 24px rgba(0,0,0,0.18)' : 'none',
                        transition: dragId ? 'opacity 0.1s' : 'transform 0.18s, opacity 0.18s, box-shadow 0.18s',
                        userSelect: 'none', WebkitUserSelect: 'none',
                        zIndex: dragId === mealId ? 10 : 'auto',
                      }}
                    >
                      {/* Drag handle — always visible. Touching here starts an immediate drag. */}
                      <div
                        onTouchStart={e => { e.stopPropagation(); onItemTouchStart(e, mealId, dayIdx, defaultItemIds) }}
                        onTouchMove={e => onItemTouchMove(e, mealId)}
                        onTouchEnd={() => onItemTouchEnd(mealId, dayIdx)}
                        onTouchCancel={() => onItemTouchEnd(mealId, dayIdx)}
                        onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onItemTouchStart(e, mealId, dayIdx, defaultItemIds) }}
                        style={{
                          position: 'absolute', top: 0, left: 0, bottom: 0,
                          width: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: dragId === mealId ? 'var(--gray-700)' : 'var(--gray-300)',
                          fontSize: 18, userSelect: 'none', WebkitUserSelect: 'none',
                          letterSpacing: '-1px', cursor: dragId === mealId ? 'grabbing' : 'grab',
                          touchAction: 'none',
                        }}
                        aria-label="Drag to reorder"
                      >
                        ⠿
                      </div>
                      {/* Meal label — cuisine badge tapped opens an inline picker FOR THIS MEAL on THIS DAY only. */}
                      {(() => {
                        const optionsCount = countRestaurantOptions(day.area, cuisine)
                        const canRefresh = optionsCount > 1
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 15 }}>{isLunch ? '🍴' : '🍷'}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                              {isLunch ? 'Lunch' : 'Dinner'}
                            </span>
                            {cuisineOpt ? (
                              <button onClick={() => toggleMealPicker(dayIdx, item.meal)} aria-label="Change cuisine for this meal" style={{
                                fontSize: 11, fontWeight: 600,
                                color: cuisineOpt.color, background: cuisineOpt.color + '18',
                                padding: '2px 8px', borderRadius: 999, border: 'none', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                              }}>
                                <span>{cuisineOpt.emoji}</span><span>{cuisineOpt.label}</span>
                                <span style={{ opacity: 0.6, marginLeft: 2, transition: 'transform 180ms', display: 'inline-block', transform: isPickerOpen ? 'rotate(90deg)' : 'rotate(0)' }}>›</span>
                              </button>
                            ) : (
                              <button onClick={() => toggleMealPicker(dayIdx, item.meal)} style={{
                                fontSize: 11, fontWeight: 600,
                                color: 'var(--gray-500)', background: 'var(--gray-100)',
                                padding: '2px 8px', borderRadius: 999, border: 'none', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                              }}>
                                + Choose cuisine
                              </button>
                            )}
                            {canRefresh && !isPickerOpen && (
                              <button onClick={() => bumpRestaurantOffset(item.meal, dayIdx)} style={{
                                marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                                color: 'var(--gray-600)', background: 'var(--gray-100)',
                                border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 999,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                              }}>
                                <span>↻</span><span>Show another</span>
                              </button>
                            )}
                          </div>
                        )
                      })()}

                      {/* Inline cuisine picker — expands beneath the meal label when user taps the badge. Sets cuisine for THIS meal only. */}
                      {isPickerOpen && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, padding: '2px 0' }}>
                          {CUISINE_OPTIONS.map(opt => {
                            const active = cuisine === opt.id
                            return (
                              <button key={opt.id}
                                onClick={() => {
                                  setMealCuisine(dayIdx, item.meal, active ? null : opt.id)
                                  setOpenMealPicker(null)
                                }}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                  padding: '5px 6px', borderRadius: 999, border: 'none', cursor: 'pointer',
                                  fontSize: 11, fontWeight: active ? 700 : 500,
                                  background: active ? opt.color : 'var(--gray-100)',
                                  color: active ? '#fff' : 'var(--gray-600)',
                                  minWidth: 0,
                                }}>
                                <span style={{ fontSize: 12 }}>{opt.emoji}</span>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{opt.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* Restaurant card — always shown (defaults to area's best when no cuisine selected) */}
                      {restaurant && (
                        <div style={{
                          background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                          borderRadius: 12, padding: '14px 15px',
                        }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 3, lineHeight: 1.3 }}>
                            {restaurant.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 }}>
                            {restaurant.price} · {restaurant.neighborhood}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.55, marginBottom: 12 }}>
                            {restaurant.description}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {restaurant.reservationUrl ? (
                              <a href={restaurant.reservationUrl} target="_blank" rel="noopener noreferrer"
                                style={{ flex: 1, background: '#15803d', color: '#fff', textAlign: 'center',
                                  fontSize: 13, fontWeight: 700, padding: '9px 8px', borderRadius: 9, textDecoration: 'none' }}>
                                Reserve a table →
                              </a>
                            ) : (
                              <span style={{ flex: 1, background: 'var(--gray-100)', color: 'var(--gray-500)',
                                textAlign: 'center', fontSize: 13, fontWeight: 600, padding: '9px 8px', borderRadius: 9 }}>
                                Walk-ins · call ahead
                              </span>
                            )}
                            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer"
                              style={{ flex: 1, background: 'var(--gray-100)', color: 'var(--gray-700)',
                                textAlign: 'center', fontSize: 13, fontWeight: 600, padding: '9px 8px', borderRadius: 9, textDecoration: 'none' }}>
                              📍 View on Maps
                            </a>
                          </div>
                        </div>
                      )}
                      {/* Empty state — only shows if we genuinely couldn't find anything */}
                      {!restaurant && (
                        <div style={{ fontSize: 13, color: 'var(--gray-400)', fontStyle: 'italic' }}>
                          No spots found for this area yet —
                          <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray-500)', marginLeft: 4 }}>browse Google Maps →</a>
                        </div>
                      )}
                    </div>
                  )
                }

                // Normal stop card
                const stop = item.stop
                const pc = PERIOD_COLORS[stop.period] || PERIOD_COLORS.Afternoon
                const bookUrl = stop.nowPlaying?.bookingUrl || stop.ticketUrl || stop.scheduleUrl
                const stopPosition = (stopOrderOverride || allStopIds).indexOf(stop.id)
                const isFirst = stopPosition === 0
                const isLast = stopPosition === (stopOrderOverride || allStopIds).length - 1
                // Travel-time hint: looks back through the rendered items to find the previous stop (skipping over meal cards)
                // so the connector shows the geographic gap even when a Lunch card sits between two stops.
                const prevStop = (() => {
                  for (let j = itemIdx - 1; j >= 0; j--) {
                    if (reorderedItems[j].type === 'stop') return reorderedItems[j].stop
                  }
                  return null
                })()
                const travel = prevStop ? estimateTravel(prevStop.id, stop.id) : null
                return (
                  <React.Fragment key={stop.id + '-frag'}>
                    {travel && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '2px 16px', margin: '-4px 0 -4px',
                        color: 'var(--gray-400)', fontSize: 11, fontWeight: 600,
                      }}>
                        <span style={{ width: 2, height: 14, background: 'var(--gray-200)', marginLeft: 6 }} />
                        <span>{travel.icon}</span>
                        <span>~{travel.mins} min {travel.mode}</span>
                      </div>
                    )}
                  <div
                    key={stop.id}
                    ref={el => { if (el) stopCardRefs.current[stop.id] = el; else delete stopCardRefs.current[stop.id] }}
                    style={{
                      background: dragId === stop.id ? 'var(--gray-50)' : 'var(--white)',
                      border: dragId === stop.id ? '2px solid var(--gray-400)' : '1px solid var(--gray-200)',
                      borderRadius: 14,
                      overflow: 'hidden',
                      position: 'relative',
                      opacity: dragId !== null && dragId !== stop.id ? 0.55 : 1,
                      transform: dragId === stop.id ? 'scale(1.025)' : 'scale(1)',
                      boxShadow: dragId === stop.id ? '0 8px 24px rgba(0,0,0,0.18)' : 'none',
                      transition: dragId ? 'opacity 0.1s' : 'transform 0.18s, opacity 0.18s, box-shadow 0.18s',
                      userSelect: 'none', WebkitUserSelect: 'none',
                      zIndex: dragId === stop.id ? 10 : 'auto',
                      paddingLeft: 28,  // make room for drag handle
                    }}
                  >
                    {/* Drag handle — always visible. Pressing here starts a drag immediately (Wanderlog-style). */}
                    <div
                      onTouchStart={e => { e.stopPropagation(); onItemTouchStart(e, stop.id, dayIdx, defaultItemIds) }}
                      onTouchMove={e => onItemTouchMove(e, stop.id)}
                      onTouchEnd={() => onItemTouchEnd(stop.id, dayIdx)}
                      onTouchCancel={() => onItemTouchEnd(stop.id, dayIdx)}
                      onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onItemTouchStart(e, stop.id, dayIdx, defaultItemIds) }}
                      style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 5,
                        width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: dragId === stop.id ? 'var(--gray-700)' : 'var(--gray-300)',
                        background: dragId === stop.id ? 'var(--gray-50)' : 'transparent',
                        fontSize: 18, userSelect: 'none', WebkitUserSelect: 'none',
                        letterSpacing: '-1px', cursor: dragId === stop.id ? 'grabbing' : 'grab',
                        touchAction: 'none',
                      }}
                      aria-label="Drag to reorder"
                    >
                      ⠿
                    </div>
                    {/* Period + time bar */}
                    <div style={{
                      background: pc.bg,
                      padding: '7px 14px',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: pc.dot, display: 'inline-block', flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: pc.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {stop.period} · {fmtHour(stop.startHour)}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: pc.text, opacity: 0.7 }}>
                        ~{stop.duration < 1 ? `${Math.round(stop.duration * 60)} min` : stop.duration % 1 === 0 ? `${stop.duration} hrs` : `${stop.duration.toFixed(1)} hrs`}
                      </span>
                    </div>

                    {/* Venue info */}
                    <div style={{ padding: '12px 14px' }}>
                      {/* Tappable row — navigates to venue detail.
                          User-added places don't have a curated detail page, so we render the same
                          row as a non-interactive div with an "Added by you" tag instead. */}
                      {stop.isCustom ? (
                        <div
                          style={{
                            width: '100%', padding: 0, textAlign: 'left',
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                          }}
                        >
                          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{DOMAIN_ICONS[stop.domain] || '📍'}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.25 }}>{stop.name}</div>
                              <span style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: '0.05em',
                                textTransform: 'uppercase', color: 'var(--gray-500)',
                                background: 'var(--gray-100)', padding: '2px 6px', borderRadius: 4,
                              }}>Added by you</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>{stop.neighborhood}</div>
                            {stop.blurb && (
                              <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 5, lineHeight: 1.5 }}>
                                {stop.blurb}
                              </div>
                            )}
                            {stop.address && (
                              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>📍 {stop.address}</div>
                            )}
                            {stop.hours && (
                              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>🕒 {stop.hours}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); onSelectSaved?.({ type: 'venue', id: stop.id }) }}
                          style={{
                            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                            padding: 0, textAlign: 'left',
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                          }}
                        >
                          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{DOMAIN_ICONS[stop.domain] || '📍'}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.25 }}>{stop.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 3 }}>{stop.neighborhood}</div>
                            {stop.nowPlaying?.title && (
                              <div style={{
                                fontSize: 12, color: '#15803d', fontWeight: 600, marginTop: 5,
                                background: '#f0fdf4', display: 'inline-block', padding: '2px 8px', borderRadius: 6,
                              }}>🎭 {stop.nowPlaying.title} · {stop.nowPlaying.through}</div>
                            )}
                            {stop.admissionCost && (
                              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>💰 {stop.admissionCost}</div>
                            )}
                          </div>
                          <span style={{ fontSize: 20, color: 'var(--gray-300)', alignSelf: 'center', flexShrink: 0 }}>›</span>
                        </button>
                      )}

                      {/* Note textarea — outside button so it doesn't trigger navigation */}
                      <textarea
                        value={venueNotes[stop.id] || ''}
                        onChange={e => setVenueNote(stop.id, e.target.value)}
                        placeholder="Add a note…"
                        rows={1}
                        style={{
                          width: '100%', border: 'none', outline: 'none', resize: 'none',
                          padding: '6px 0 0', fontSize: 12, color: 'var(--gray-600)',
                          background: 'transparent', fontFamily: 'inherit', lineHeight: 1.5,
                          boxSizing: 'border-box', marginLeft: 30,
                        }}
                        onClick={e => e.stopPropagation()}
                      />

                      {/* Bottom action row: booking link + "⋯ Options" toggle */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        marginTop: 6, marginLeft: 30,
                      }}>
                        {bookUrl && (
                          <a
                            href={bookUrl} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{
                              fontSize: 11, color: 'var(--gray-400)', textDecoration: 'none',
                            }}
                          >
                            {stop.nowPlaying?.title ? `🎟 Book tickets →` :
                             stop.isEvening ? '🎟 Get tickets →' : '🌐 Visit website →'}
                          </a>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); setExpandedStopId(prev => prev === stop.id ? null : stop.id) }}
                          style={{
                            marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                            color: expandedStopId === stop.id ? 'var(--gray-900)' : 'var(--gray-400)',
                            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                          }}
                        >
                          {expandedStopId === stop.id ? '× Close' : '⋯ Options'}
                        </button>
                      </div>
                    </div>

                    {/* Reorder controls: period toggle + swap + move-to-day (when 2+ days).
                        Hidden by default to keep the card clean. Tap "⋯ Options" to expand. */}
                    {expandedStopId === stop.id && (
                      <div style={{
                        borderTop: '1px solid var(--gray-100)',
                        padding: '9px 12px',
                        display: 'flex', flexDirection: 'column', gap: 6,
                        background: 'var(--gray-50)',
                      }}>
                        {/* Row 1: period + swap */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                          {['Morning', 'Afternoon', 'Evening'].map(p => {
                            const active = (periodOverrides[stop.id] || stop.period) === p
                            return (
                              <button key={p} onClick={() => {
                                const next = { ...periodOverrides, [stop.id]: p }
                                setPeriodOverrides(next)
                                try { localStorage.setItem('nyc_period_overrides', JSON.stringify(next)) } catch {}
                              }} style={{
                                fontSize: 11, padding: '4px 7px', borderRadius: 8, cursor: 'pointer',
                                fontWeight: active ? 700 : 500,
                                background: active ? 'var(--gray-900)' : 'var(--white)',
                                color: active ? '#fff' : 'var(--gray-500)',
                                border: active ? 'none' : '1px solid var(--gray-200)',
                              }}>
                                {p === 'Morning' ? '🌅' : p === 'Afternoon' ? '☀️' : '🌙'} {p}
                              </button>
                            )
                          })}
                          <button onClick={() => setSwapModal({ venueId: stop.id, domain: stop.domain })} style={{
                            marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '4px 10px',
                            borderRadius: 8, border: '1px solid var(--gray-200)', cursor: 'pointer',
                            background: 'var(--white)', color: 'var(--gray-600)',
                          }}>⇄ Swap</button>
                        </div>
                        {/* Row 2: move-to-day buttons (only when 2+ days exist) */}
                        {days.length > 1 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Move to:
                            </span>
                            {dayIdx > 0 && (
                              <button onClick={() => moveStopToDay(stop.id, dayIdx - 1)} style={{
                                fontSize: 11, fontWeight: 600, padding: '4px 9px',
                                borderRadius: 8, border: '1px solid var(--gray-200)', cursor: 'pointer',
                                background: 'var(--white)', color: 'var(--gray-700)',
                              }}>
                                ← Day {dayIdx}
                              </button>
                            )}
                            {dayIdx < days.length - 1 && (
                              <button onClick={() => moveStopToDay(stop.id, dayIdx + 1)} style={{
                                fontSize: 11, fontWeight: 600, padding: '4px 9px',
                                borderRadius: 8, border: '1px solid var(--gray-200)', cursor: 'pointer',
                                background: 'var(--white)', color: 'var(--gray-700)',
                              }}>
                                Day {dayIdx + 2} →
                              </button>
                            )}
                            {stopDayOverrides[stop.id] != null && (
                              <button onClick={() => {
                                const { [stop.id]: _, ...rest } = stopDayOverrides
                                setStopDayOverrides(rest)
                                try { localStorage.setItem('nyc_stop_day_overrides', JSON.stringify(rest)) } catch {}
                              }} style={{
                                marginLeft: 'auto', fontSize: 11, fontWeight: 500, padding: '4px 8px',
                                borderRadius: 8, border: 'none', cursor: 'pointer',
                                background: 'none', color: 'var(--gray-400)',
                              }}>
                                ↺ Reset
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  </React.Fragment>
                )
              })}
            </div>
              )
            })()}

            {dayIdx < days.length - 1 && days[dayIdx + 1] && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                margin: '4px 0 20px',
              }}>
                <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--gray-400)',
                  textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap',
                }}>
                  Day {dayIdx + 2} · {days[dayIdx + 1].area}
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
              </div>
            )}
          </div>
        )
      })}

      {/* Inline action bar + bookkeeping at the bottom of the scroll (no fixed/sticky to preserve screen space). */}
      <div style={{ padding: '8px 20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Primary actions — only when there's a plan */}
        {days.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Share */}
            <button onClick={handleShare} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '11px 6px', borderRadius: 10, border: '1px solid var(--gray-200)',
              background: 'var(--white)', color: 'var(--gray-700)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              <span>↗</span><span>{shareCopied ? 'Copied' : 'Share'}</span>
            </button>
            {/* Save plan */}
            <button
              onClick={() => {
                localStorage.setItem('nyc_plan_sel',   JSON.stringify(venueIds))
                const snap = {
                  savedAt: Date.now(),
                  venueIds,
                  tripDays,
                  mealCuisines,
                  // Restaurants keyed by dayIdx (matches the live data structure now)
                  lunchRestaurants: Object.fromEntries(Object.entries(lunchRestaurants).map(([k,r]) => [k, r ? { id: r.id, name: r.name, price: r.price, neighborhood: r.neighborhood, reservationUrl: r.reservationUrl, mapsUrl: r.mapsUrl } : null])),
                  dinnerRestaurants: Object.fromEntries(Object.entries(dinnerRestaurants).map(([k,r]) => [k, r ? { id: r.id, name: r.name, price: r.price, neighborhood: r.neighborhood, reservationUrl: r.reservationUrl, mapsUrl: r.mapsUrl } : null])),
                }
                localStorage.setItem('nyc_plan_snapshot', JSON.stringify(snap))
                setSavedPlanView(true)
              }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '11px 6px', borderRadius: 10, border: '1px solid var(--gray-200)',
                background: planSaved ? '#dcfce7' : 'var(--white)',
                color: planSaved ? '#15803d' : 'var(--gray-700)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <span>{planSaved ? '✓' : '💾'}</span>
              <span>{planSaved ? 'Saved' : 'Save'}</span>
            </button>
            {/* Open route in Maps */}
            {(() => {
              const url = buildRouteUrl()
              return url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" style={{
                  flex: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '11px 6px', borderRadius: 10,
                  background: '#111', color: '#fff',
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}>
                  <span>🗺️</span><span>Route</span>
                </a>
              ) : null
            })()}
          </div>
        )}

        {_snap && !savedPlanView && (
          <button onClick={() => setSavedPlanView(true)} style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--gray-400)', textDecoration: 'underline', padding: '4px 0',
          }}>
            View your saved plan →
          </button>
        )}
        <div style={{
          background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
          borderRadius: 12, padding: '13px 15px', fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.6,
        }}>
          💡 Venues are grouped by neighbourhood and ordered through the day.
          Tap <strong>Route</strong> to navigate all stops in Google Maps.
        </div>
      </div>

      {/* ── Swap venue modal ── */}
      {swapModal && (() => {
        const currentPlanIds = new Set(days.flatMap(d => d.stops.map(s => s.id)))
        const candidates = getSwapCandidates(swapModal.domain, currentPlanIds)
        const currentVenue = venues[swapModal.venueId]
        const activeSwap = venueSwaps[swapModal.venueId]
        return (
          <div
            onClick={() => setSwapModal(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'flex-end',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--white)', borderRadius: '20px 20px 0 0',
                padding: '20px 20px 40px', width: '100%', maxHeight: '72vh', overflowY: 'auto',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--gray-200)', margin: '0 auto 18px' }} />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: 'var(--gray-400)', marginBottom: 4 }}>
                SWAP OUT
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
                {currentVenue?.name}
              </div>
              {candidates.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--gray-400)', padding: '12px 0' }}>
                  No other venues in this category to swap in.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {candidates.map(id => {
                    const v = venues[id]
                    if (!v) return null
                    const isActive = activeSwap === id
                    return (
                      <button key={id} onClick={() => {
                        const next = { ...venueSwaps, [swapModal.venueId]: id }
                        setVenueSwaps(next)
                        try { localStorage.setItem('nyc_venue_swaps', JSON.stringify(next)) } catch {}
                        setSwapModal(null)
                      }} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        background: isActive ? '#f0fdf4' : 'var(--gray-50)',
                        border: '1px solid ' + (isActive ? '#86efac' : 'var(--gray-200)'),
                        borderRadius: 12, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{v.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                            {v.neighborhood}{v.admissionCost ? ' · ' + v.admissionCost : ''}
                          </div>
                        </div>
                        {isActive
                          ? <span style={{ fontSize: 14, color: '#16a34a', fontWeight: 700 }}>✓</span>
                          : <span style={{ fontSize: 18, color: 'var(--gray-300)' }}>→</span>
                        }
                      </button>
                    )
                  })}
                </div>
              )}
              {activeSwap && (
                <button onClick={() => {
                  const next = { ...venueSwaps }
                  delete next[swapModal.venueId]
                  setVenueSwaps(next)
                  try { localStorage.setItem('nyc_venue_swaps', JSON.stringify(next)) } catch {}
                  setSwapModal(null)
                }} style={{
                  marginTop: 16, width: '100%', fontSize: 13, color: 'var(--gray-400)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textDecoration: 'underline', padding: '8px 0',
                }}>
                  Restore original ({currentVenue?.name})
                </button>
              )}
            </div>
          </div>
        )
      })()}

      {/* ── Saved Places section ── */}
      <div style={{ padding: '0 20px 100px' }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--gray-400)', padding: '24px 0 12px',
          borderTop: Object.keys(safeItems).length > 0 ? '1px solid var(--gray-100)' : 'none',
        }}>
          Saved · {Object.keys(safeItems).length}
        </div>
        {Object.values(safeItems).length === 0 && (
          <div style={{ fontSize: 14, color: 'var(--gray-400)', fontStyle: 'italic' }}>
            Nothing saved yet — explore and bookmark venues, works, and figures.
          </div>
        )}
        {Object.values(safeItems).sort((a, b) => b.savedAt - a.savedAt).map(item => {
          const label = item.type === 'venue'
            ? venues[item.id]?.name
            : item.type === 'work'
            ? works[item.id]?.title
            : figures[item.id]?.name
          const domainId = item.type === 'venue'
            ? Object.values(domains).find(d => d.venues?.includes(item.id))?.id
            : item.type === 'work'
            ? topics[works[item.id]?.topicId]?.domainId
            : topics[figures[item.id]?.topicIds?.[0]]?.domainId
          const icon = { visual_art:'🎨', jazz:'🎷', classical_music:'🎼', theater:'🎭', history:'📜', architecture:'🏛️', sports:'🏆', hip_hop:'🎤' }[domainId] || '📍'
          return (
            <div
              key={`${item.type}:${item.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer',
              }}
              onClick={() => onSelectSaved?.({ type: item.type, id: item.id })}
            >
              <span style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--gray-800)', lineHeight: 1.4 }}>
                {label || item.id}
              </span>
              <span style={{ fontSize: 11, color: 'var(--gray-400)', marginRight: 4, textTransform: 'capitalize' }}>
                {item.type}
              </span>
              {toggleSave && (
                <button
                  onClick={e => { e.stopPropagation(); toggleSave(item.type, item.id) }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 16, color: 'var(--gray-300)', padding: '4px 6px', flexShrink: 0,
                  }}
                  title="Remove"
                >✕</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SavedScreen({ savedItems, onSelect, toggleSave, onPlan, venueNotes = {}, setVenueNote = () => {} }) {
  const saved = Object.values(savedItems).sort((a, b) => b.savedAt - a.savedAt)

  if (saved.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100dvh - 120px)', padding: '40px 28px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔖</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 10 }}>Nothing saved yet</div>
        <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.7, maxWidth: 290 }}>
          Bookmark things you want to come back to — venues to visit, works to see, primers to re-read.
        </div>
      </div>
    )
  }

  const savedVenues  = saved.filter(s => s.type === 'venue')
  const savedWorks   = saved.filter(s => s.type === 'work')
  const savedFigures = saved.filter(s => s.type === 'figure')

  // ── Plan selection (mirrors PlanScreen's nyc_plan_sel) ────────────────
  const [planSelArr, setPlanSelArr] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_plan_sel') || 'null') } catch { return null }
  })
  const planSelSet = planSelArr ? new Set(planSelArr) : null  // null = all venues in plan

  function isInPlan(venueId) {
    return planSelSet === null || planSelSet.has(venueId)
  }
  function togglePlanSel(venueId) {
    const allIds = savedVenues.map(s => s.id)
    const current = planSelSet || new Set(allIds)
    const next = new Set(current)
    if (next.has(venueId)) next.delete(venueId); else next.add(venueId)
    const arr = [...next]
    setPlanSelArr(arr)
    try { localStorage.setItem('nyc_plan_sel', JSON.stringify(arr)) } catch {}
  }

  const DOMAIN_META = {
    visual_art:      { label: 'Visual Art',   icon: '🎨' },
    jazz:            { label: 'Jazz',          icon: '🎷' },
    classical_music: { label: 'Classical',     icon: '🎼' },
    theater:         { label: 'Theater',       icon: '🎭' },
    sports:          { label: 'Sports',        icon: '🏆' },
    architecture:    { label: 'Architecture',  icon: '🏛️' },
    history:         { label: 'History',       icon: '📜' },
    hip_hop:         { label: 'Hip-Hop',       icon: '🎤' },
  }
  // Group saved venues by domain
  const venuesByDomain = {}
  savedVenues.forEach(item => {
    const domainId = venueCoords[item.id]?.domain || 'visual_art'
    if (!venuesByDomain[domainId]) venuesByDomain[domainId] = []
    venuesByDomain[domainId].push(item)
  })
  const domainOrder = Object.keys(DOMAIN_META).filter(d => venuesByDomain[d])

  const SectionHeader = ({ label, count }) => (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
      color: 'var(--gray-400)', padding: '20px 0 10px',
    }}>{label} · {count}</div>
  )

  return (
    <div className="screen">
      <div className="home-header">
        <div className="home-wordmark">Saved</div>
        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
          {saved.length} item{saved.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Plan My Visit CTA ── */}
      {(() => {
        const planVenueIds = new Set([
          ...saved.filter(s => s.type === 'venue').map(s => s.id),
          ...saved.filter(s => s.type === 'work').map(s => works[s.id]?.venueId).filter(Boolean),
        ])
        return planVenueIds.size >= 3 ? (
          <div style={{ padding: '16px 20px 4px' }}>
            <button
              onClick={onPlan}
              style={{
                width: '100%', background: 'var(--gray-900)', color: '#fff',
                border: 'none', borderRadius: 14, padding: '16px 20px',
                cursor: 'pointer', textAlign: 'left', display: 'flex',
                alignItems: 'center', gap: 14,
              }}
            >
              <span style={{ fontSize: 28 }}>🗓️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>Plan My Visit</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.45 }}>
                  Turn your {planVenueIds.size} saved stops into a day-by-day itinerary
                </div>
              </div>
              <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>›</span>
            </button>
          </div>
        ) : null
      })()}

      <div style={{ padding: '0 20px 40px' }}>
        {savedVenues.length > 0 && (
          <>
            {/* ── Domain-grouped venue sections ── */}
            {domainOrder.map(domainId => {
              const meta = DOMAIN_META[domainId]
              const items = venuesByDomain[domainId]
              return (
                <div key={domainId}>
                  {/* Domain header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '18px 0 10px',
                    borderTop: domainId === domainOrder[0] ? 'none' : '1px solid var(--gray-100)',
                  }}>
                    <span style={{ fontSize: 16 }}>{meta.icon}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                      textTransform: 'uppercase', color: 'var(--gray-400)',
                    }}>{meta.label} · {items.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map(item => {
                      const v = venues[item.id]
                      if (!v) return null
                      const note = venueNotes[item.id] || ''
                      const inPlan = isInPlan(item.id)
                      return (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                          {/* Main card row */}
                          <div style={{
                            background: 'var(--white)',
                            border: '1px solid var(--gray-200)',
                            borderRadius: note ? '14px 14px 0 0' : 14,
                            borderBottom: note ? 'none' : undefined,
                            overflow: 'hidden',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                              {/* Tap to view detail */}
                              <button onClick={() => onSelect({ type: 'venue', id: item.id })} style={{
                                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                                textAlign: 'left', padding: '13px 14px',
                              }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>{v.name}</div>
                                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                                  {v.neighborhood}{v.admissionCost ? ' · ' + v.admissionCost : ''}
                                </div>
                              </button>

                              {/* In-Plan toggle */}
                              <button
                                onClick={e => { e.stopPropagation(); togglePlanSel(item.id) }}
                                style={{
                                  flexShrink: 0, padding: '8px 10px',
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                                }}
                                title={inPlan ? 'Remove from plan' : 'Add to plan'}
                              >
                                <div style={{
                                  width: 28, height: 28, borderRadius: 8,
                                  background: inPlan ? 'var(--gray-900)' : 'var(--gray-100)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 13,
                                }}>
                                  {inPlan ? <span style={{ color: '#fff', fontWeight: 700 }}>✓</span>
                                          : <span style={{ color: 'var(--gray-400)', fontWeight: 700 }}>+</span>}
                                </div>
                                <span style={{ fontSize: 9, color: inPlan ? 'var(--gray-600)' : 'var(--gray-400)', fontWeight: 600 }}>
                                  {inPlan ? 'In plan' : 'Add'}
                                </span>
                              </button>

                              {/* View detail chevron */}
                              <button onClick={() => onSelect({ type: 'venue', id: item.id })} style={{
                                flexShrink: 0, padding: '13px 12px 13px 4px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--gray-300)', fontSize: 20,
                              }}>›</button>
                            </div>
                          </div>

                          {/* Note textarea */}
                          <div style={{
                            border: '1px solid var(--gray-200)', borderTop: 'none',
                            borderRadius: '0 0 14px 14px', overflow: 'hidden',
                          }}>
                            <textarea
                              value={note}
                              onChange={e => setVenueNote(item.id, e.target.value)}
                              placeholder="Add a note…"
                              rows={note ? undefined : 1}
                              style={{
                                width: '100%', border: 'none', outline: 'none', resize: 'none',
                                padding: '9px 14px', fontSize: 12, color: 'var(--gray-700)',
                                background: 'var(--gray-50)', fontFamily: 'inherit', lineHeight: 1.5,
                                boxSizing: 'border-box', minHeight: 36,
                                display: note ? 'block' : 'none',
                              }}
                              onClick={e => e.stopPropagation()}
                            />
                            {!note && (
                              <button
                                onClick={() => setVenueNote(item.id, ' ')}
                                style={{
                                  width: '100%', padding: '7px 14px', background: 'var(--gray-50)',
                                  border: 'none', cursor: 'pointer', textAlign: 'left',
                                  fontSize: 11, color: 'var(--gray-400)',
                                }}
                              >
                                + note
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {savedWorks.length > 0 && (
          <>
            <SectionHeader label="Works" count={savedWorks.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {savedWorks.map(item => {
                const w = works[item.id]
                if (!w) return null
                const fig = figures[w.figureId]
                return (
                  <button key={item.id} onClick={() => onSelect({ type: 'work', id: item.id })} style={{
                    width: '100%', background: 'var(--white)', border: '1px solid var(--gray-200)',
                    borderRadius: 14, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <ImgWithFallback src={w.imageUrl} alt={w.title} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{fig?.name}{w.year ? ` · ${w.year}` : ''}</div>
                    </div>
                    <div style={{ color: 'var(--gray-300)', fontSize: 20, flexShrink: 0 }}>&#8250;</div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {savedFigures.length > 0 && (
          <>
            <SectionHeader label="People" count={savedFigures.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {savedFigures.map(item => {
                const fig = figures[item.id]
                if (!fig) return null
                const topic = topics[fig.topicId]
                return (
                  <button key={item.id} onClick={() => onSelect({ type: 'figure', id: item.id })} style={{
                    width: '100%', background: 'var(--white)', border: '1px solid var(--gray-200)',
                    borderRadius: 14, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <ImgWithFallback src={fig.imageUrl} alt={fig.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>{fig.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{topic?.name || ''}</div>
                    </div>
                    <div style={{ color: 'var(--gray-300)', fontSize: 20, flexShrink: 0 }}>&#8250;</div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Add Place Modal — user-added venues (separate from curated NYC Tonight picks) ──
function AddPlaceModal({ onClose, userVenues, onAdd, onRemove }) {
  // Form state
  const [name,         setName]         = React.useState('')
  const [blurb,        setBlurb]        = React.useState('')
  const [category,     setCategory]     = React.useState('food')
  const [neighborhood, setNeighborhood] = React.useState('')
  const [address,      setAddress]      = React.useState('')
  const [hours,        setHours]        = React.useState('')
  const [image,        setImage]        = React.useState('')
  const [error,        setError]        = React.useState('')

  const existing = Object.values(userVenues || {}).sort((a, b) => b.savedAt - a.savedAt)

  function handleSubmit() {
    if (!name.trim()) { setError('Name is required'); return }
    if (!blurb.trim()) { setError('Tell us why you love it'); return }
    if (!neighborhood) { setError('Pick a neighborhood'); return }
    onAdd({
      name: name.trim(),
      blurb: blurb.trim(),
      category,
      neighborhood,
      address: address.trim(),
      hours: hours.trim(),
      image: image.trim(),
    })
    // Reset form
    setName(''); setBlurb(''); setCategory('food'); setNeighborhood('')
    setAddress(''); setHours(''); setImage(''); setError('')
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)', borderRadius: '20px 20px 0 0',
          width: '100%', maxWidth: 460,
          maxHeight: '90vh', overflowY: 'auto',
          boxSizing: 'border-box',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        {/* Drag handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--gray-300)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2 }}>
              Add your place
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4, lineHeight: 1.45 }}>
              Save personal favorites alongside our curated picks. They&apos;ll work in your trip plan and show up in search.
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'var(--gray-100)', border: 'none', borderRadius: 999,
            width: 32, height: 32, cursor: 'pointer',
            fontSize: 16, color: 'var(--gray-500)', lineHeight: 1,
            flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Already-saved list */}
        {existing.length > 0 && (
          <div style={{ padding: '16px 20px 4px' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'var(--gray-400)', marginBottom: 8,
            }}>
              Your places ({existing.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {existing.map(v => {
                const cat = USER_PLACE_CATEGORIES.find(c => c.id === v.category) || USER_PLACE_CATEGORIES[7]
                return (
                  <div key={v.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)', borderRadius: 10,
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{cat.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {v.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>
                        {cat.label}{v.neighborhood ? ' · ' + v.neighborhood : ''}
                      </div>
                    </div>
                    <button onClick={() => onRemove(v.id)} aria-label="Remove" style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 14, color: 'var(--gray-400)', padding: '4px 6px',
                      flexShrink: 0,
                    }}>✕</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{ padding: '18px 20px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--gray-400)',
          }}>
            Add a new place
          </div>

          {/* Name */}
          <Field label="Name" required>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Carbone"
              style={inputStyle} />
          </Field>

          {/* Why you love it */}
          <Field label="Why you love it" required>
            <textarea value={blurb} onChange={e => setBlurb(e.target.value)}
              placeholder="Best red sauce in NYC. Get the spicy rigatoni."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
          </Field>

          {/* Category — chip picker */}
          <Field label="Category">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
              {USER_PLACE_CATEGORIES.map(c => {
                const active = category === c.id
                return (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    padding: '7px 4px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: active ? 700 : 500,
                    background: active ? 'var(--gray-900)' : 'var(--gray-100)',
                    color: active ? '#fff' : 'var(--gray-600)',
                  }}>
                    <span style={{ fontSize: 12 }}>{c.emoji}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
                  </button>
                )
              })}
            </div>
          </Field>

          {/* Neighborhood — required, drives trip-day grouping. Top-level boroughs grouped by optgroup;
              boroughs with sub-areas (Brooklyn) expose their specific neighborhoods below. */}
          <Field label="Neighborhood" required>
            <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', background: 'var(--white)' }}>
              <option value="">Pick a neighborhood…</option>
              {/* Top-level neighborhoods (Manhattan + boroughs without sub-areas yet) */}
              <optgroup label="Top-level">
                {NEIGHBORHOOD_GROUPS.map(g => (
                  <option key={g.key} value={g.label}>{g.emoji} {g.label}</option>
                ))}
              </optgroup>
              {/* Boroughs that have sub-neighborhoods — each sub-area gets its own optgroup for clarity */}
              {Object.entries(NEIGHBORHOOD_SUBAREAS).map(([parentKey, subAreas]) => {
                const parentLabel = NEIGHBORHOOD_GROUPS.find(g => g.key === parentKey)?.label || parentKey
                return subAreas.map(sa => (
                  <optgroup key={parentKey + ':' + sa.key} label={`${parentLabel} · ${sa.label}`}>
                    {sa.areas.map(a => (
                      <option key={a.name} value={a.name}>{a.name}</option>
                    ))}
                  </optgroup>
                ))
              })}
            </select>
          </Field>

          {/* Address — optional */}
          <Field label="Address" hint="optional">
            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder="181 Thompson St"
              style={inputStyle} />
          </Field>

          {/* Hours — optional */}
          <Field label="Hours" hint="optional">
            <input type="text" value={hours} onChange={e => setHours(e.target.value)}
              placeholder="Daily 5:30pm – 11:30pm"
              style={inputStyle} />
          </Field>

          {/* Image URL — optional */}
          <Field label="Image URL" hint="optional">
            <input type="url" value={image} onChange={e => setImage(e.target.value)}
              placeholder="https://…"
              style={inputStyle} />
          </Field>

          {/* Error */}
          {error && (
            <div style={{
              fontSize: 12, color: '#dc2626', background: '#fee2e2',
              padding: '8px 12px', borderRadius: 8,
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 4, paddingBottom: 8 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
              background: 'var(--gray-100)', color: 'var(--gray-700)',
              border: '1px solid var(--gray-200)',
              fontSize: 14, fontWeight: 600,
            }}>
              Cancel
            </button>
            <button onClick={handleSubmit} style={{
              flex: 2, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
              background: 'var(--gray-900)', color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 700,
            }}>
              Save place
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Small field-wrapper helper to keep form rows consistent.
function Field({ label, required, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-600)', letterSpacing: '0.04em' }}>
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
        {hint && <span style={{ color: 'var(--gray-400)', fontWeight: 500, marginLeft: 5 }}>· {hint}</span>}
      </div>
      {children}
    </div>
  )
}

// Shared input styling (declared as a const so all inputs share it).
const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px', borderRadius: 9,
  border: '1px solid var(--gray-200)',
  fontSize: 14, color: 'var(--gray-900)',
  background: 'var(--white)',
  outline: 'none', fontFamily: 'inherit',
}

// ── Onboarding Modal — three-slide welcome flow shown on first app open ──
function OnboardingModal({ onDismiss }) {
  const [slide, setSlide] = React.useState(0)
  const slides = [
    {
      bg: 'linear-gradient(150deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)',
      emoji: '🗽',
      eyebrow: 'NYC TONIGHT',
      title: "Discover what's on,\ntonight in New York.",
      body: 'A curated guide to jazz clubs, museums, theater, architecture — hand-picked by NYC editors, refreshed weekly.',
    },
    {
      bg: 'linear-gradient(150deg, #be185d 0%, #dc2626 60%, #ec4899 100%)',
      emoji: '♥',
      eyebrow: 'BUILD A WISH LIST',
      title: 'Save what catches\nyour eye.',
      body: 'Tap the heart on any venue, pick, or museum. Your saves collect quietly across every screen.',
    },
    {
      bg: 'linear-gradient(150deg, #047857 0%, #059669 60%, #14b8a6 100%)',
      emoji: '🗓️',
      eyebrow: 'PLAN YOUR DAYS',
      title: 'Turn saves into a\nsmart itinerary.',
      body: 'My Trip groups your venues by neighborhood, suggests restaurants and travel times, and gets you out the door.',
    },
  ]
  const isLast = slide === slides.length - 1
  const current = slides[slide]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: current.bg,
      transition: 'background 380ms ease',
      color: '#fff',
      display: 'flex', flexDirection: 'column',
      // iOS safe-area aware
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {/* Soft radial highlight for depth */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 55%)',
      }} />

      {/* Top bar: Skip link (hidden on last slide so the only CTA is "Let's go") */}
      <div style={{ position: 'relative', padding: '18px 20px 0', display: 'flex', justifyContent: 'flex-end', minHeight: 44 }}>
        {!isLast && (
          <button onClick={onDismiss} style={{
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
            border: 'none', color: 'rgba(255,255,255,0.95)',
            padding: '8px 14px', borderRadius: 999,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            letterSpacing: '0.02em',
          }}>Skip</button>
        )}
      </div>

      {/* Slide body — centered emoji + headline + body */}
      <div style={{
        position: 'relative', flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center', gap: 22,
      }}>
        <span style={{
          fontSize: 96, lineHeight: 1,
          filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.28))',
        }}>{current.emoji}</span>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.78)',
        }}>{current.eyebrow}</div>
        <div style={{
          fontSize: 28, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.012em',
          maxWidth: 320, whiteSpace: 'pre-line',
        }}>
          {current.title}
        </div>
        <div style={{
          fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.92)',
          maxWidth: 320,
        }}>
          {current.body}
        </div>
      </div>

      {/* Bottom: pagination dots + Next / Let's go button */}
      <div style={{
        position: 'relative',
        padding: '0 24px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
      }}>
        {/* Pagination dots — active dot stretches into a pill */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {slides.map((_, i) => (
            <button key={i}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === slide ? 24 : 8, height: 8, borderRadius: 999,
                background: i === slide ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.4)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width 240ms ease, background 240ms ease',
              }} />
          ))}
        </div>

        {/* Primary CTA */}
        <button onClick={() => isLast ? onDismiss() : setSlide(slide + 1)} style={{
          width: '100%', maxWidth: 340,
          background: 'var(--white)', color: '#111',
          border: 'none', borderRadius: 14,
          padding: '15px 24px',
          fontSize: 15, fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(0,0,0,0.22)',
          letterSpacing: '-0.005em',
        }}>
          {isLast ? "Let's go →" : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  // First-time-user onboarding — versioned key so we can re-show after major updates by bumping the version.
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('nyc_onboarded_v1') }
    catch { return false }
  })
  function dismissOnboarding() {
    try { localStorage.setItem('nyc_onboarded_v1', '1') } catch {}
    setShowOnboarding(false)
  }

  const [activeTab, setActiveTab] = useState('explore')
  const { current, canGoBack, push, back, reset: resetExplore } = useNav()

  const [savedItems, setSavedItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_saved') || '{}') }
    catch { return {} }
  })

  // User-added places — separate from curated venues so we can visually distinguish them
  // ("your picks" vs editorial picks) and so the editorial venue data stays clean.
  const [userVenues, setUserVenues] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_user_venues') || '{}') }
    catch { return {} }
  })
  function addUserVenue(data) {
    const id = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6)
    setUserVenues(prev => {
      const next = { ...prev, [id]: { id, isCustom: true, savedAt: Date.now(), ...data } }
      try { localStorage.setItem('nyc_user_venues', JSON.stringify(next)) } catch {}
      return next
    })
    // Auto-save into savedItems so it shows up in the saved count, My Trip tab,
    // and gets included in the itinerary right away.
    setSavedItems(prev => {
      const key = `user_venue:${id}`
      const next = { ...prev, [key]: { type: 'user_venue', id, savedAt: Date.now() } }
      try { localStorage.setItem('nyc_saved', JSON.stringify(next)) } catch {}
      return next
    })
    return id
  }
  function removeUserVenue(id) {
    setUserVenues(prev => {
      const { [id]: _, ...rest } = prev
      try { localStorage.setItem('nyc_user_venues', JSON.stringify(rest)) } catch {}
      return rest
    })
    // Also remove the auto-saved entry so the place fully disappears from the trip.
    setSavedItems(prev => {
      const key = `user_venue:${id}`
      if (!prev[key]) return prev
      const { [key]: _, ...rest } = prev
      try { localStorage.setItem('nyc_saved', JSON.stringify(rest)) } catch {}
      return rest
    })
  }
  const [addPlaceOpen, setAddPlaceOpen] = useState(false)

  const [venueNotes, setVenueNotesRaw] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nyc_venue_notes') || '{}') } catch { return {} }
  })
  const setVenueNote = React.useCallback((venueId, text) => {
    setVenueNotesRaw(prev => {
      const next = { ...prev, [venueId]: text }
      try { localStorage.setItem('nyc_venue_notes', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  // Depth-1 selection for non-Explore tabs
  const [mapSel,       setMapSel]       = useState(null)
  const [mapHighlight, setMapHighlight] = useState(null)
  const [tonightSel,   setTonightSel]   = useState(null)
  const [savedSel,   setSavedSel]   = useState(null)

  function toggleSave(type, id) {
    setSavedItems(prev => {
      const next = { ...prev }
      const key = `${type}:${id}`
      if (next[key]) delete next[key]
      else next[key] = { type, id, savedAt: Date.now() }
      localStorage.setItem('nyc_saved', JSON.stringify(next))
      return next
    })
  }

  function handleTabPress(tab) {
    if (tab === activeTab) {
      if (tab === 'explore') resetExplore()
      if (tab === 'map')     setMapSel(null)
      if (tab === 'tonight') setTonightSel(null)
      if (tab === 'saved')   { setSavedSel(null) }
    } else {
      setActiveTab(tab)
    }
  }

  // Tapping deeper links in Map/Tonight/Saved switches to Explore
  function pushToExplore(entry) {
    push(entry)
    setActiveTab('explore')
  }

  function getExploreNavTitle() {
    switch (current.screen) {
      case 'home':      return 'NYC Tonight'
      case 'domain':    return domains[current.domainId]?.name
      case 'topic':     return topics[current.topicId]?.name
      case 'venueGroup':return domains[current.domainId]?.venueGroups?.[current.groupIndex]?.label
      case 'neighborhood': return current.subAreaName || NEIGHBORHOOD_GROUPS.find(g => g.key === current.neighborhoodKey)?.label || 'Neighborhood'
      case 'sight':     return ALL_SIGHTS[current.sightId]?.name || 'Sight'
      case 'venue':     return venues[current.venueId]?.name
      case 'figure':    return figures[current.figureId]?.name
      case 'work':      return works[current.workId]?.title
      default:          return 'NYC Tonight'
    }
  }

  function topNavProps() {
    if (activeTab === 'explore') {
      return { isHome: current.screen === 'home', canGoBack, onBack: back, title: getExploreNavTitle() }
    }
    if (activeTab === 'map' && mapSel) {
      return { isHome: false, canGoBack: true, onBack: () => setMapSel(null), title: venues[mapSel]?.name || '' }
    }
    if (activeTab === 'tonight' && tonightSel) {
      const title = tonightSel.screen === 'venue' ? venues[tonightSel.id]?.name : works[tonightSel.id]?.title
      return { isHome: false, canGoBack: true, onBack: () => setTonightSel(null), title: title || '' }
    }
    if (activeTab === 'saved' && savedSel) {
      const { type, id } = savedSel
      const title = type === 'venue' ? venues[id]?.name : type === 'work' ? works[id]?.title : figures[id]?.name
      return { isHome: false, canGoBack: true, onBack: () => setSavedSel(null), title: title || '' }
    }
    if (activeTab === 'saved') {
      return { isHome: false, canGoBack: false, onBack: null, title: 'My Trip' }
    }
    return { isHome: true, canGoBack: false, onBack: null, title: '' }
  }

  function renderExploreScreen() {
    switch (current.screen) {
      case 'home':      return <HomeScreen push={push} savedItems={savedItems} toggleSave={toggleSave} onSeeAllTonight={() => setActiveTab('tonight')} />
      case 'domain':    return <DomainScreen domainId={current.domainId} push={push} savedItems={savedItems} />
      case 'topic':     return <TopicScreen topicId={current.topicId} push={push} savedItems={savedItems} />
      case 'venue':     return <VenueScreen venueId={current.venueId} fromTopicId={current.fromTopicId} fromDomainId={current.fromDomainId} push={push} savedItems={savedItems} toggleSave={toggleSave} onViewMap={venueCoords[current.venueId] ? () => { resetExplore(); setMapHighlight(current.venueId); setActiveTab('map') } : null} />
      case 'figure':    return <FigureScreen figureId={current.figureId} push={push} savedItems={savedItems} toggleSave={toggleSave} />
      case 'work':      return <WorkScreen workId={current.workId} push={push} savedItems={savedItems} toggleSave={toggleSave} />
      case 'venueGroup':return <VenueGroupScreen domainId={current.domainId} groupIndex={current.groupIndex} push={push} savedItems={savedItems} />
      case 'neighborhood': return <NeighborhoodScreen neighborhoodKey={current.neighborhoodKey} subAreaName={current.subAreaName} push={push} savedItems={savedItems} />
      case 'sight':     return <SightScreen sightId={current.sightId} push={push} savedItems={savedItems} toggleSave={toggleSave} />
      default:          return <HomeScreen push={push} savedItems={savedItems} toggleSave={toggleSave} onSeeAllTonight={() => setActiveTab('tonight')} />
    }
  }

  // dispatch the active tab's screen
  function renderTabContent() {
    switch (activeTab) {
      case 'explore':
        return renderExploreScreen()

      case 'map':
        if (mapSel) return <VenueScreen venueId={mapSel} fromTopicId={null} fromDomainId={venueCoords[mapSel]?.domain} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} />
        return <MapScreen onSelectVenue={setMapSel} highlight={mapHighlight} onClearHighlight={() => setMapHighlight(null)} savedItems={savedItems} toggleSave={toggleSave} />

      case 'tonight':
        if (tonightSel) {
          if (tonightSel.screen === 'venue') return <VenueScreen venueId={tonightSel.id} fromTopicId={null} fromDomainId={null} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} editorialCallout={tonightSel.blurb} onViewMap={venueCoords[tonightSel.id] ? () => { setMapHighlight(tonightSel.id); setActiveTab('map') } : null} />
          return <WorkScreen workId={tonightSel.id} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} />
        }
        return <TonightScreen
          savedItems={savedItems}
          toggleSave={toggleSave}
          onViewSaved={() => setActiveTab('saved')}
          onNavigate={({ venueId, workId, blurb }) => {
            if (venueId) setTonightSel({ screen: 'venue', id: venueId, blurb })
            else if (workId) setTonightSel({ screen: 'work', id: workId, blurb })
          }}
        />

      case 'saved':
        if (savedSel) {
          const { type, id } = savedSel
          if (type === 'venue')  return <VenueScreen venueId={id} fromTopicId={null} fromDomainId={null} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} onViewMap={venueCoords[id] ? () => { setMapHighlight(id); setActiveTab('map') } : null} />
          if (type === 'work')   return <WorkScreen  workId={id}  push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} />
          if (type === 'figure') return <FigureScreen figureId={id} push={pushToExplore} savedItems={savedItems} toggleSave={toggleSave} />
        }
        return <PlanErrorBoundary><PlanScreen savedItems={savedItems} toggleSave={toggleSave} onSelectSaved={setSavedSel} venueNotes={venueNotes} setVenueNote={setVenueNote} userVenues={userVenues} removeUserVenue={removeUserVenue} /></PlanErrorBoundary>

      default:
        return renderExploreScreen()
    }
  }

  const tnp = topNavProps()

  return (
    <div className="app-shell">
      <TopNav title={tnp.title} canGoBack={tnp.canGoBack} onBack={tnp.onBack} isHome={tnp.isHome} />
      <div className="tab-content">
        {renderTabContent()}
      </div>
      <BottomNav
        activeTab={activeTab}
        onTabPress={handleTabPress}
        savedCount={Object.keys(savedItems).length}
        onAddPlace={() => setAddPlaceOpen(true)}
      />
      {/* First-time-user onboarding overlay — shown only when the version key is absent in localStorage */}
      {showOnboarding && <OnboardingModal onDismiss={dismissOnboarding} />}
      {/* Add-place modal — user-added venues, kept separate from curated data */}
      {addPlaceOpen && (
        <AddPlaceModal
          onClose={() => setAddPlaceOpen(false)}
          userVenues={userVenues}
          onAdd={(data) => addUserVenue(data)}
          onRemove={(id) => removeUserVenue(id)}
        />
      )}
    </div>
  )
}

