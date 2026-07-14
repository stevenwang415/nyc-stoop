// ── Venue hero photos ──────────────────────────────────────────────────────
// Wikimedia Commons images for the most-visited venues, served through the
// Special:FilePath redirect (resolves by filename — no brittle hash paths).
// VenueScreen layers these OVER the category-gradient fallback, so a missing
// or renamed file degrades to the gradient, never a broken/black box.
//
// Venues not listed here fall back to the first work-at-venue imageUrl
// (architecture venues get photos that way), then to the gradient.
//
// Attribution: images remain hosted by Wikimedia Commons under their
// respective licenses (most CC BY-SA); see each file's Commons page.

const wm = (file, width = 900) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`

export const venueImages = {
  // ── Museums ──
  met:              wm('Metropolitan Museum of Art (The Met) - Central Park, NYC.jpg'),
  moma:             wm('MoMa NY USA 1.jpg'),
  guggenheim:       wm('NYC - Guggenheim Museum.jpg'),
  whitney:          wm('Whitney Museum of American Art August 2024.jpg'),
  brooklyn:         wm('Brooklyn Museum Front Entrance.jpg'),
  tenement_museum:  wm('Tenement Museum New.jpg'),

  // ── Classical ──
  bargemusic:       wm('Brooklyn Bridge Park td (2019-08-23) 006 - Pier 1, Bargemusic.jpg'),

  // ── Jazz ──
  village_vanguard: wm('Vanguard 01.jpg'),
  blue_note:        wm('Blue Note Jazz Club.jpg'),
  birdland:         wm('Birdland New York.jpg'),
  smalls:           wm('Max-leven-performance-smalls-jazz-club-greenwich-village-nyc-july-2025.jpg'),

  // ── Concert halls / opera ──
  carnegie_hall:    wm('Carnegie Hall - Full (48155558466).jpg'),
  met_opera_house:  wm('Metropolitan Opera House At Lincoln Center.jpg'),
  david_geffen_hall:wm('David Geffen Hall (48047408511).jpg'),

  // ── Sports ──
  yankee_stadium:   wm('Yankee Stadium overhead 2010.jpg'),
  msg:              wm('Madison Square Garden 2011.jpg'),
  citi_field:       wm('Citi Field from the south 2025.jpg'),
  arthur_ashe_stadium: wm('Arthur Ashe Stadium with retractible roof.jpg'),

  // ── Landmarks / parks ──
  central_park:     wm('Global Citizen Festival Central Park New York City from NYonAir (15351915006).jpg'),
  high_line:        wm('High Line 20th Street looking downtown.jpg'),
  one_wtc:          wm('One World Trade Center, Financial District, Manhattan, New York.jpg'),
  stonewall_inn:    wm('Stonewall Inn 5 pride weekend 2016.jpg'),

  // ── Theaters / Harlem ──
  apollo_theater_hh:wm('Apollo Theater, Harlem (November 2006).jpg'),
  public_theater:   wm('Public Theatre Astor Library Building from south.jpg'),

  // ── Architecture / skyscrapers ──
  empire_state:           wm('Empire-State-Building.JPG'),
  chrysler_building:      wm('Chrysler Building 01.JPG'),
  flatiron_building:      wm('Flatiron Building.JPG'),
  woolworth_building:     wm('NY woolworth building.JPG'),
  rockefeller_center:     wm('30 Rockefeller Plaza New York City RCA GE Building.jpg'),
  seagram_building:       wm('Seagrambuilding (cropped).JPG'),
  grand_central_terminal: wm('GrandCentralTerminal.JPG'),
  nypl_schwarzman:        wm('Newyorkpubliclibrary.jpg'),
  un_headquarters:        wm('United Nations Headquarters.JPG'),

  // ── Churches / historic civic landmarks ──
  st_patricks:            wm("St Patrick's cathedral NY.jpg"),
  trinity_church_nyc:     wm('Trinity Church NYC 004b.JPG'),
  brooklyn_bridge_arch:   wm('Brooklyn Bridge as seen from FDR Drive in Manhattan.JPG'),
  federal_hall:           wm('Federal Hall and George Washington statue in New York City.JPG'),
  fraunces_tavern:        wm('Fraunces Tavern.JPG'),
  ellis_island:           wm('Ellis Island National Museum of Immigration.jpg'),

  // ── Parks / public spaces ──
  bryant_park:            wm('Bryant Park jeh.JPG'),
  washington_square_park: wm('Washington Square Arch 03.JPG'),
  battery_park:           wm('Battery Park.JPG'),
  times_square:           wm('Buildings in Times Square.JPG'),
  statue_of_liberty:      wm('Statue of Liberty 3, New York City.jpg'),
  staten_island_ferry_terminal: wm('SI Ferry Docking Manhattan.JPG'),
  chelsea_market:         wm('Chesea Market from south.jpg'),

  // ── Museums ──
  amnh:                   wm('USA-NYC-American Museum of Natural History.JPG'),
  intrepid_museum:        wm('USS Intrepid (CV-11) (29973892203).jpg'),
  brooklyn_childrens_museum: wm("Brooklyn Children's Museum.JPG"),

  // ── The Bronx (added 2026-07-14; both files API-verified, CC BY-SA 3.0) ──
  bronx_zoo:              wm('Entrance to Bronx Zoo 2008.jpg'),
  ny_botanical_garden:    wm('New York Botanical Garden April 2015 010.jpg'),

  // ── Food / markets ──
  katzs:                  wm('KatzGentrificationLES.JPG'),

  // ── Bars ──
  the_campbell:           wm('GCT Campbell 1.jpg'),

  // ── Broadway theaters (verified Commons filenames) ──
  shubert_theatre:        wm('Shubert Theatre Mar 2025 03.jpg'),
  st_james_theatre:       wm('St. James Theatre, Illinoise, 6-29-2024.jpg'),
  richard_rodgers_theatre:wm('Rodgers Theater - Hamilton (48193460677).jpg'),
  imperial_theatre:       wm('Nice Work If You Can Get It at the Imperial Theatre.jpg'),
  gershwin_theatre:       wm('Gershwin Theatre - Wicked (54077363135).jpg'),
  winter_garden_theatre:  wm('Winter Garden Theatre, Broadway, New York City, 20231004 185525.jpg'),
  eugene_oneill_theatre:  wm("Eugene O'Neill Theatre - Book of Mormon (48295951286).jpg"),
  majestic_theatre:       wm('Majestic Theatre NYC 2007.jpg'),
  delacorte_theater:      wm('Shakespeare in the Park July 2021.jpg'),

  // ── More venues (verified Commons filenames) ──
  barclays_center:        wm('Barclays Center, Brooklyn New York, 2023.jpg'),
  cooper_hewitt:          wm('Cooper hewitt smithsonian design museum (16358298836).jpg'),
  schomburg_center:       wm('Schomburg Center for Research in Black Culture 135 St 2023 jeh.jpg'),
  hamilton_grange:        wm('Hamilton Grange late 2010 morn jeh.jpg'),
  lever_house:            wm('Lever House 390 Park Avenue.jpg'),
  ny_aquarium:            wm('Coney Island behind NY Aquarium Sep 2019 11.jpg'),

  // ── Theaters, concert halls, landmarks & restaurants (verified via Wikipedia pageimages) ──
  minskoff_theatre:       wm('Minskoff Theatre NYC 2007.jpg'),
  alice_tully_hall:       wm('Alice Tully Hall (48047494177).jpg'),
  jazz_lincoln_center:    wm('Jazz at Lincoln Center (51395662326).jpg'),
  ninety_second_st_y:     wm('92Y (48059227562).jpg'),
  angelika_film_center:   wm('AngelikaByLuigiNovi4.jpg'),
  african_burial_ground:  wm('African Burial Ground.jpg'),
  peter_luger:            wm('Peter Luger Steak House (Brooklyn, New York) 001 crop.jpg'),
  carbone:                wm('Carbone Restaurant Sign 6.4.22.jpg'),
  eleven_madison_park:    wm('Portrait Shot of Eleven Madison Park (9284511683).jpg'),
  le_bernardin:           wm('Interior of Le Bernardin.jpg'),
  russ_and_daughters_cafe: wm('Russ & Daughters (51624125108).jpg'),
  veselka:                wm('Veselka (1).jpg'),
}

export default venueImages
