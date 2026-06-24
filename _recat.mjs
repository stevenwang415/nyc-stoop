import fs from 'fs'
const FILE='./src/data/places.js'
let src=fs.readFileSync(FILE,'utf8')
const recat=[
['Bar Bonobo','drinks'],
['Subject: A Cocktail Bar','drinks'],
['Bar Room at the Beekman','drinks'],
['Old Mates Pub','drinks'],
['Bar Belly','drinks'],
['Bar Valentina','drinks'],
['HOM Cafe & Wine','coffee'],
['Qahwah House Coffee - Williamsburg Brooklyn','coffee'],
]
for(const [name,cat] of recat){
  const re=new RegExp('(name: '+JSON.stringify(name).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+',\\s*\\n\\s*category: )"[^"]*"')
  const before=src; src=src.replace(re,'$1'+JSON.stringify(cat))
  console.log((before!==src?'OK   ':'MISS ')+name+' -> '+cat)
}
fs.writeFileSync(FILE,src)
