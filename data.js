// Sample commoners across the Front Range.
// Coordinates are in a 800x1000 viewBox where:
//   y=0  is roughly Wyoming border (Fort Collins area)
//   y=1000 is south of Colorado Springs
//   x=200 is the foothills, x=700 is the eastern plains
//   I-25 corridor runs ~x=540

window.COMMONERS = [
  // Fort Collins area
  { id: 1, kind: 'person', name: 'Maren Holloway', area: 'Old Town Fort Collins', offers: 'Seed library, dryland grain trials', x: 590, y: 85 },
  { id: 2, kind: 'person', name: 'Jonah Vesper', area: 'Campus West', offers: 'Mycoremediation, oyster spawn', x: 605, y: 100 },
  { id: 3, kind: 'org', name: 'Drylands Agroecology Research', area: 'Larimer County', offers: 'Silvopasture demo plots, internships', x: 555, y: 130 },
  { id: 4, kind: 'person', name: 'Wren Aoki', area: 'Bellvue', offers: 'Fire mitigation crews, chainsaw lending', x: 520, y: 60 },

  // Loveland / Berthoud
  { id: 5, kind: 'person', name: 'Idris Caro', area: 'Loveland', offers: 'Beekeeping mentorship, swarm rescue', x: 575, y: 175 },
  { id: 6, kind: 'org', name: 'Big Thompson Watershed Coalition', area: 'Loveland', offers: 'Riparian restoration days', x: 545, y: 195 },
  { id: 7, kind: 'person', name: 'Theo Marchand', area: 'Berthoud', offers: 'Tractor share, hay rake repair', x: 565, y: 235 },

  // Longmont / Lyons / Niwot
  { id: 8, kind: 'person', name: 'Sela Brightwater', area: 'Longmont', offers: 'Herbalism, tincture making', x: 535, y: 305 },
  { id: 9, kind: 'org', name: 'Frontline Farming', area: 'Longmont', offers: 'BIPOC farm coop, CSA shares', x: 555, y: 315 },
  { id: 10, kind: 'person', name: 'August Pell', area: 'Niwot', offers: 'Greywater design, plumbing labor', x: 500, y: 335 },
  { id: 11, kind: 'person', name: 'Robin Fjord', area: 'Lyons', offers: 'Beaver advocacy, leaky weir builds', x: 460, y: 290 },

  // Boulder cluster
  { id: 12, kind: 'person', name: 'Anya Solberg', area: 'North Boulder', offers: 'Soil testing, microbiome lab access', x: 455, y: 370 },
  { id: 13, kind: 'person', name: 'Kael Ondara', area: 'South Boulder', offers: 'Ecological grief circles', x: 470, y: 405 },
  { id: 14, kind: 'org', name: 'Boulder Mushroom', area: 'East Boulder', offers: 'Cultivation workshops, spawn', x: 490, y: 390 },
  { id: 15, kind: 'person', name: 'Imara Vey', area: 'Gunbarrel', offers: 'Prairie restoration, seed cleaning', x: 510, y: 365 },
  { id: 16, kind: 'person', name: 'Coen Bramwell', area: 'Chautauqua', offers: 'Trail stewardship, route mapping', x: 440, y: 400 },
  { id: 17, kind: 'org', name: 'Earth Linkages', area: 'Boulder', offers: 'Bioregional learning cohorts', x: 470, y: 385 },

  // Foothills & mountain towns
  { id: 18, kind: 'person', name: 'Ophelia Tarn', area: 'Nederland', offers: 'Fire-wise property assessments', x: 380, y: 410 },
  { id: 19, kind: 'person', name: 'Wes Halloran', area: 'Coal Creek Canyon', offers: 'Off-grid solar installs', x: 400, y: 460 },
  { id: 20, kind: 'org', name: 'Wild Bear Nature Center', area: 'Nederland', offers: 'Youth ecology programs', x: 370, y: 425 },

  // Northwest Denver
  { id: 21, kind: 'person', name: 'Mira Quint', area: 'Berkeley', offers: 'Composting at scale, worm bins', x: 490, y: 535 },
  { id: 22, kind: 'person', name: 'Devon Aigner', area: 'Sunnyside', offers: 'Tool library, repair café host', x: 500, y: 545 },
  { id: 23, kind: 'person', name: 'Lior Stenberg', area: 'Highlands', offers: 'Native plant nursery cuttings', x: 495, y: 555 },
  { id: 24, kind: 'org', name: 'Groundwork Denver', area: 'Sun Valley', offers: 'Urban watershed, youth corps', x: 510, y: 575 },

  // Central / East Denver
  { id: 25, kind: 'person', name: 'Tasneem Yor', area: 'Park Hill', offers: 'Mutual aid logistics, dispatch', x: 535, y: 555 },
  { id: 26, kind: 'person', name: 'Beck Orlovsky', area: 'Cole', offers: 'Bike-cargo deliveries', x: 525, y: 545 },
  { id: 27, kind: 'person', name: 'Sage Kithira', area: 'Five Points', offers: 'Food sovereignty organizing', x: 522, y: 552 },
  { id: 28, kind: 'org', name: 'Re:Vision', area: 'Westwood', offers: 'Promotora-led food production', x: 515, y: 605 },
  { id: 29, kind: 'person', name: 'Hollis Vane', area: 'Baker', offers: 'Legal aid for land trusts', x: 510, y: 580 },
  { id: 30, kind: 'person', name: 'Juno Carrick', area: 'Washington Park', offers: 'Permaculture design consults', x: 520, y: 595 },

  // West Denver / Lakewood / Golden
  { id: 31, kind: 'person', name: 'Sasha Mendel', area: 'Sloan’s Lake', offers: 'Rainwater harvest plumbing', x: 485, y: 555 },
  { id: 32, kind: 'person', name: 'Pax Trembath', area: 'Edgewater', offers: 'Cob & earthen plaster crews', x: 478, y: 548 },
  { id: 33, kind: 'person', name: 'Ezri Lindqvist', area: 'Wheat Ridge', offers: 'Backyard orchard care', x: 470, y: 525 },
  { id: 34, kind: 'person', name: 'Marlow Eik', area: 'Golden', offers: 'Hardrock mining remediation research', x: 440, y: 545 },
  { id: 35, kind: 'org', name: 'Mycelium Project', area: 'Lakewood', offers: 'Substrate sourcing, lab access', x: 460, y: 580 },

  // Aurora
  { id: 36, kind: 'person', name: 'Yara Onwu', area: 'North Aurora', offers: 'Refugee farmer translation', x: 590, y: 555 },
  { id: 37, kind: 'org', name: 'Project Worthmore Farms', area: 'Aurora', offers: 'Refugee-led market gardens', x: 595, y: 570 },

  // South Metro / Douglas / El Paso
  { id: 38, kind: 'person', name: 'Niall Crestwood', area: 'Castle Rock', offers: 'Conservation easement consulting', x: 535, y: 685 },
  { id: 39, kind: 'person', name: 'Pia Renkoff', area: 'Sedalia', offers: 'Equine therapy, pasture rotation', x: 510, y: 660 },
  { id: 40, kind: 'person', name: 'Ash Vellner', area: 'Larkspur', offers: 'Ponderosa thinning crews', x: 530, y: 730 },
  { id: 41, kind: 'person', name: 'Lumen Sato', area: 'Manitou Springs', offers: 'Herbal first-aid trainings', x: 580, y: 870 },
  { id: 42, kind: 'person', name: 'Cyrus Halberg', area: 'Old North End', offers: 'Public talks, ecological economics', x: 605, y: 880 },
  { id: 43, kind: 'org', name: 'Pikes Peak Permaculture', area: 'Colorado Springs', offers: 'Earthworks workshops', x: 615, y: 895 },

  // Plains
  { id: 44, kind: 'person', name: 'Reva Tindall', area: 'Hudson', offers: 'Bison rangeland stewardship', x: 680, y: 460 },
  { id: 45, kind: 'person', name: 'Otis Granberry', area: 'Strasburg', offers: 'Dryland sorghum experiments', x: 720, y: 575 },
  { id: 46, kind: 'org', name: 'Spirit of the Front Range', area: 'Bioregional', offers: 'The convening body', x: 475, y: 480 },
];

window.NEIGHBORHOODS = [
  'North Boulder', 'South Boulder', 'East Boulder', 'Gunbarrel', 'Niwot',
  'Longmont', 'Lyons', 'Nederland',
  'Old Town Fort Collins', 'Campus West', 'Bellvue', 'Loveland', 'Berthoud',
  'Berkeley', 'Sunnyside', 'Highlands', 'Park Hill', 'Five Points', 'Cole',
  'Baker', 'Washington Park', 'Sloan’s Lake', 'Edgewater', 'Wheat Ridge',
  'Golden', 'Lakewood', 'Arvada', 'Aurora', 'Westwood',
  'Castle Rock', 'Sedalia', 'Larkspur',
  'Manitou Springs', 'Old North End', 'Colorado Springs',
  'Hudson', 'Strasburg', 'Somewhere else on the Front Range',
];

// Map a neighborhood string back to a coordinate on the SVG.
window.AREA_COORDS = {
  'North Boulder': [455, 370],
  'South Boulder': [470, 405],
  'East Boulder': [490, 390],
  'Gunbarrel': [510, 365],
  'Niwot': [500, 335],
  'Longmont': [540, 310],
  'Lyons': [460, 290],
  'Nederland': [380, 415],
  'Old Town Fort Collins': [590, 85],
  'Campus West': [605, 100],
  'Bellvue': [520, 60],
  'Loveland': [575, 175],
  'Berthoud': [565, 235],
  'Berkeley': [490, 535],
  'Sunnyside': [500, 545],
  'Highlands': [495, 555],
  'Park Hill': [535, 555],
  'Five Points': [522, 552],
  'Cole': [525, 545],
  'Baker': [510, 580],
  'Washington Park': [520, 595],
  'Sloan’s Lake': [485, 555],
  'Edgewater': [478, 548],
  'Wheat Ridge': [470, 525],
  'Golden': [440, 545],
  'Lakewood': [460, 580],
  'Arvada': [475, 525],
  'Aurora': [595, 570],
  'Westwood': [515, 605],
  'Castle Rock': [535, 685],
  'Sedalia': [510, 660],
  'Larkspur': [530, 730],
  'Manitou Springs': [580, 870],
  'Old North End': [605, 880],
  'Colorado Springs': [615, 895],
  'Hudson': [680, 460],
  'Strasburg': [720, 575],
  'Somewhere else on the Front Range': [560, 500],
};
