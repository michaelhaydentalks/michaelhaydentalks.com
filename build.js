// console.log('Hello world')

const { escape } = require('querystring');


function listFiles(parent) {
  const fs = require('fs')
  let dir = parent ? parent : '/';
  return fs.readdirSync(dir)
}

function read(file) {
  const fs = require('fs')
  return fs.readFileSync(file, 'utf8');
}

function reCreateFolders(folder) {
  const fs = require('fs')
  folder = folder ? folder : '/dist'
  if (fs.existsSync(folder)) { fs.rmSync(folder, { recursive: true }) }
  fs.mkdirSync(folder)
}

function cleanDirURL(obj) {
  const months = { january: "01", february: "02", march: "03", april: "04", may: "05", june: "06", july: "07", august: "08", september: "09", october: "10", november: "11", december: "12" }
  //CONVERT DD MM YYYY to ISO
  let dateStr = obj.meta.created.split(" ")
  let day = dateStr[0].replace(/\D/g, '') > 9 ? dateStr[0].replace(/\D/g, '') : String("0" + dateStr[0].replace(/\D/g, ''))
  dateStr = `${dateStr[2]}-${months[dateStr[1].toLowerCase()]}-${day}T00:00:00.00Z`
  dateStr = new Date(dateStr) / 1000
  return obj.name.replace(/ /g, "+").replace(/,/g, "_").replace(/'/g, "~").replace(/"/g, "~").replace(/\?/g, "%3F") + "-" + dateStr

}


let variables = {
  name: "Michael Hayden - Meditations on the Gospels and lives of the Saints",
  site: "https://michaelhaydentalks.com",
}

function titlify(text) {
  text = text.replace(/_/g, ' ')
  text = text[0].toUpperCase() + text.substring(1, text.length)
  text = text === 'Homepage' ? '' : text + ' | '
  return text
}

function pagesMaster() {
  for (const directory of getDirectories('./pages')) {
    let date = new Date()
    // console.log(date)
    siteMap += `<url>
    <loc>${variables.site + '/' + directory}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1</priority>
  </url>`;
    makePage(directory)
  }
}

function makePage(directory) {
  const fs = require('fs')
  let dist = ''
  let head = String(fs.readFileSync('./components/head.ejs'))
  head = head.replace(/\$name/g, variables.name)
  head = head.replace(/\$title/g, titlify(directory))
  head = head.replace(/\$site/g, variables.site)
  head = head.replace(/\$canonical/g, variables.site + '/' + directory)
  head = head.replace(/\$metaImage/g, variables.site + '/src/img/Thunb.webp')
  dist += head
  let nav = String(fs.readFileSync('./components/nav.ejs'))

  let bodyWrapper = String(fs.readFileSync('./components/body-wrapper.ejs'))
  let body = fs.readFileSync('./pages/' + directory + '/index.ejs')

  body = parseBody(body)

  bodyWrapper = bodyWrapper.replace(/\$nav/g, nav)
  bodyWrapper = bodyWrapper.replace(/\$body/g, body)
  dist += bodyWrapper

  dist += fs.readFileSync('./components/foot.ejs')
  // dist += fs.readFileSync('./components/scripts.ejs')

  const extraScripts = './pages/' + directory + '/scripts.js'

  try {
    if (fs.existsSync(extraScripts)) {
      //file exists
      dist += '<script>'
      dist += fs.readFileSync(extraScripts)
      dist += '</script>'
      console.log('Files attached for ' + directory)

    }
  } catch (err) {
    console.log('No additional files attached for ' + directory)
  }

  let subDirectory = directory === 'homepage' ? '/' : '/' + directory + '/'
  if (subDirectory.length > 1) {
    reCreateFolders('./dist/' + directory)
  }
  dist = directory === 'homepage' ? modifyHomepage(dist) : dist
  if (directory === '404') {
    fs.writeFileSync('./dist/404.html', dist);
  }
  fs.writeFileSync('./dist' + subDirectory + 'index.html', dist);

}

function modifyHomepage(dist) {
  const path = require('path');
  const fs = require('fs')
  let videoMaster = JSON.parse(fs.readFileSync('./components/video-master/videos.json'))
  let json = videoMaster[videoMaster.length - 1]

  let clean = cleanDirURL(json)//.replace(/ /g, "+").replace(/,/g, "_").replace(/'/g, "~").replace(/"/g, "~")
  let thumb = json.thumbnail ? "/src/img/" + path.parse(json.thumbnail).name + ".webp" : ''

  let latest = `<a href="video/${clean}" class="latest-video-hero"><span class="newest-label pulse"><i class="fas fa-star"></i>&nbsp;new</span><img src="${thumb}"><h2>${json.name}</h2></a>`

  let max = videoMaster.length < 12 ? videoMaster.length : 12
  let videoMasterReversed = videoMaster.reverse()
  let carousel = `<script>window.carouselCount=${max};</script>`
  for (i = 0; i < max; i++) {
    let j = videoMasterReversed[i]
    let t = j?.thumbnail ? '/src/img/' + path.parse(j.thumbnail).name + '.webp' : ''
    // console.log(j)
    let zeroth = i == 0 ? `<span class='newest-label pulse'><i class='fas fa-star'></i>&nbsp;new</span>` : ''
    carousel += `<a href='/video/${cleanDirURL(j)}'>
      <i style='background-image:url(${t});' loading='lazy'></i>${zeroth}<h2>${j.name}</h2><span class='created'>${j.meta.created}</span></a>`
  }

  return dist.replace(/\$latest/g, latest).replace(/\$carousel/g, carousel)
}

function videoMaster() {
  const path = require('path');
  const fs = require('fs')
  reCreateFolders('./dist/video')

  let videoJson = []
  let count = 0
  let videoMaster = JSON.parse(fs.readFileSync('./components/video-master/videos.json'))
  for (const obj of videoMaster) {
    let next = videoMaster?.[count + 1] || videoMaster[0]
    makeVideoPages(obj, next)
    videoJson.push({ name: obj.name, thumbnail: "/src/img/" + path.parse(obj.thumbnail).name + ".webp", created: obj.meta.created, url: cleanDirURL(obj) })
    count++
  }
  fs.writeFileSync('./dist/src/json/videos.json', JSON.stringify(videoJson.reverse()));
}

function makeVideoPages(obj, next) {
  // console.log(obj.details.path)
  // return
  const path = require('path');
  const webp = require('webp-converter');
  const fs = require('fs')
  webp.grant_permission();
  let uri = encodeURI(obj.name)
  let clean = cleanDirURL(obj)//.replace(/ /g, "+").replace(/,/g, "_").replace(/'/g, "~").replace(/"/g, "~")
  let thumb = obj.thumbnail ? "./src/img/" + path.parse(obj.thumbnail).name + ".webp" : ''
  let dist = ''
  let head = String(fs.readFileSync('./components/head.ejs'))
  head = head.replace(/\$name/g, variables.name)
  head = head.replace(/\$title/g, titlify(obj.name))
  head = head.replace(/\$site/g, variables.site)
  head = head.replace(/\$canonical/g, variables.site + '/video/' + clean)
  head = head.replace(/\$metaImage/g, variables.site + "/src/img/" + path.parse(obj.thumbnail).name + ".webp")
  dist += head
  let nav = String(fs.readFileSync('./components/nav.ejs'))

  let bodyWrapper = String(fs.readFileSync('./components/body-wrapper.ejs'))
  let videoUIWrapper = String(fs.readFileSync('./components/video-page/video-ui.ejs'))
  let description = obj.details?.path ? fs.readFileSync('./components/video-descriptions/' + obj.details.path + '.ejs') : ''

  let nextClean = cleanDirURL(next)//.replace(/ /g, "+").replace(/,/g, "_").replace(/'/g, "~").replace(/"/g, "~")
  videoUIWrapper = videoUIWrapper.replace(/\$site/g, variables.site)
    .replace(/\$description/g, description)
    .replace(/\$vimeo/g, obj.vimeo)
    .replace(/\$name/g, obj.name)
    .replace(/\$date/g, obj.meta.created)
    .replace(/\$uri/g, uri)
    .replace(/\$clean/g, '/video/' + clean)
    .replace(/\$next/g, next.name)
    .replace(/\$nxtClean/g, nextClean)
    .replace(/\$thumb/g, thumb)


  //pass input image(.jpeg,.pnp .....) path ,output image(give path where to save and image file name with .webp extension)
  //pass option(read  documentation for options)

  //cwebp(input,output,option)

  // const result =
  // result.then((response) => {
  //   console.log(response);
  // });

  bodyWrapper = bodyWrapper.replace(/\$nav/g, nav)
  bodyWrapper = bodyWrapper.replace(/\$body/g, videoUIWrapper)
  dist += bodyWrapper

  dist += fs.readFileSync('./components/foot.ejs')


  reCreateFolders('./dist/video/' + clean)

  fs.writeFileSync('./dist/video/' + clean + '/index.html', dist);

  if (obj.thumbnail) {
    // try {
    if (fs.existsSync(thumb)) {
      //file exists
      // console.log("exists: ", thumb)

      fs.copyFileSync(thumb, "./dist/src/img/" + path.parse(obj.thumbnail).name + ".webp");
    } else {
      console.log("no webp for: ." + obj.thumbnail)
      // webp.cwebp("." + obj.thumbnail, thumb, "-q 5", logging = "-v");
      const result = webp.cwebp("." + obj.thumbnail, thumb, "-q 5", logging = "-v");
      result.then((response) => {
        console.log(response);
        fs.copyFileSync(thumb, "./dist/src/img/" + path.parse(obj.thumbnail).name + ".webp");
        console.log('image compressed and saved for: ' + obj.name)
      });
    }
    // } catch (err) {
    // console.log(err)
    // }
  }
  let date = new Date()
  // console.log(date)
  siteMap += `<url>
  <loc>${variables.site + '/video/' + clean}</loc>
  <lastmod>${date}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>1</priority>
</url>`;
}

function parseBody(body) {
  const fs = require('fs')
  let parsedBody = ''
  try {
    body = JSON.parse(body)
    if (Array.isArray(body)) {
      // console.log("array")
      for (const section of body) {
        parsedBody += fs.readFileSync('./pages/' + section)
      }
      //loop over components and add to body
    }
  } catch (err) {
    // console.log("html")
    parsedBody = body
  }
  return parsedBody
}

function getDirectories(dir) {
  const fs = require('fs');

  const directoriesInDIrectory = fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  return directoriesInDIrectory
}

function consolidateAssets() {
  const fs = require('fs')
  const fse = require('fs-extra');
  // const postcss = require('postcss')
  // const cssnano = require('cssnano')
  // const autoprefixer = require('autoprefixer')

  const directories = ['./src/css/', './src/js/']
  for (const dir of directories) {
    let data = ''
    let asset = listFiles(dir)
    let ext = '.' + dir.replace('./src/', '').replace(/\//g, '')
    let newFile = dir.replace("./", "./dist/") + "file" + ext
    for (const ass of asset) {
      if (ass.indexOf(ext) >= ass.length - ext.length) {
        data += read(dir + ass) + " "
      }
      else if (ass.indexOf(ext + '.map') >= 0) {
        fs.writeFileSync(dir.replace("./", "./dist/") + ass, read(dir + ass));
      }
    }

    fs.copyFileSync("./src/img/favicon.svg", "./dist/src/img/favicon.svg");
    fs.copyFileSync("./src/img/favicon.png", "./dist/src/img/favicon.png");

    // if (ext === '.css') {
    //   // data = await postcss([cssnano, autoprefixer]).process(data, { from: undefined })
    //   postcss([cssnano]).process(data, { from: false }).then((result) => {
    //     fs.writeFileSync(newFile, result);
    //   })
    // } else {
    fs.writeFileSync(newFile, data);
    // }
  }

  //RETAIN FOR LOCALLYSERVED FONTS
  // const assetFolders = ['./src/img/', './src/fonts/']
  // for (const dir of assetFolders) {
  //   let destDir = dir.replace('./src/', './dist/src/')
  //   fse.copySync(dir, destDir)
  // }
}


//PERFORMING BUILD
const mainFolders = ["./dist", "./dist/src", "./dist/src/css", "./dist/src/json", "./dist/src/img", "./dist/src/js"]
for (const folder of mainFolders) { reCreateFolders(folder) }
consolidateAssets()

let siteMap = '<urlset>'
function makeSiteMapsEtc() {
  const fs = require('fs')
  fs.writeFileSync('./dist/site.xml', siteMap + '</urlset>');
  fs.writeFileSync('./dist/sitemap.xml', siteMap + '</urlset>');
  fs.writeFileSync('./dist/robots.txt', `
User-agent: *
Disallow: /src/

User-agent: Googlebot
Allow: /src/

Sitemap: ${variables.site}/sitemap.xml
`);
}

videoMaster()
pagesMaster()


makeSiteMapsEtc()



