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
  whitney:          wm('Whitney Museum of American Art - Gansevoort Street entrance.jpg'),
  brooklyn:         wm('Brooklyn Museum - Eastern Parkway entrance.jpg'),
  tenement_museum:  wm('Lower East Side Tenement Museum.jpg'),

  // ── Jazz ──
  village_vanguard: wm('Village Vanguard.jpg'),
  blue_note:        wm('Blue Note Jazz Club.jpg'),
  birdland:         wm('Birdland Jazz Club NYC.jpg'),

  // ── Concert halls / opera ──
  carnegie_hall:    wm('Carnegie Hall - Full (48155558466).jpg'),
  met_opera_house:  wm('Metropolitan Opera House At Lincoln Center.jpg'),
  david_geffen_hall:wm('David Geffen Hall (48047495362).jpg'),

  // ── Sports ──
  yankee_stadium:   wm('Yankee Stadium overhead 2010.jpg'),
  msg:              wm('Madison Square Garden (MSG) - Full (48124840533).jpg'),
  citi_field:       wm('Citi Field in 2021.jpg'),
  arthur_ashe_stadium: wm('Arthur Ashe Stadium Aerial.jpg'),

  // ── Landmarks / parks ──
  central_park:     wm('Global Citizen Festival Central Park New York City from NYonAir (15351915006).jpg'),
  high_line:        wm('High Line 20th Street looking downtown.jpg'),
  one_wtc:          wm('One World Trade Center from the Hudson 2015.jpg'),
  stonewall_inn:    wm('Stonewall Inn 5 pride weekend 2016.jpg'),

  // ── Theaters / Harlem ──
  apollo_theater_hh:wm('Apollo Theater, Harlem (2012).jpg'),
  public_theater:   wm('Public Theater (48064377872).jpg'),
}

export default venueImages
