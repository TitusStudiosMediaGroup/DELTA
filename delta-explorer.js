//const api_TreeURL = "https://api.github.com/repos/OpenSourceProtogenCollection/opensourceprotogencollection.github.io/git/trees/master?recursive=1";
const api_TreeURL = "https://protogencollection.titusstudios.net/data/static/json/api/restapi/v3/git_tree-28062020.json"
const website_Domain = "https://protogencollection.titusstudios.net/"
var currentPath = "docs"
var searchbar = document.getElementById("searchbox");
searchbar.value = "docs"

fetch(api_TreeURL)
	.then(function(response) {
		return response.json()
	}).then(function(json) {
		function GetSortOrder(prop) {    
			return function(a, b) {    
				if (a[prop] > b[prop]) {    
					return 1;    
				} else if (a[prop] < b[prop]) {    
					return -1;    
				}    
				return 0;    
			}    
		}    

		function DELTA_location(currrentlLocation) {
			var parentlocation = document.getElementById("delta");
			var dirLocation = document.createElement("div")
			var dirLocationText = document.createElementNS("http://www.w3.org/1999/xhtml","a")
			var lastChar = currrentlLocation.substr(-1);
			
			parentlocation.append(dirLocation)
			dirLocation.append(dirLocationText)
			dirLocation.setAttribute("class","delta-location")
		
			if (lastChar != '/') {
				currrentlLocation = currrentlLocation + '/';
			}
		
			dirLocationText.innerHTML = currrentlLocation
		}
		
		function DELTA_generateRow(type,filename,href,totalPath) {
			var parentlocation = document.getElementById("delta");
			var wrapper = document.createElement("div")
			var row = document.createElement("div")
			var icon = document.createElement("div")
			var name = document.createElement("div")
			var namea = document.createElementNS("http://www.w3.org/1999/xhtml","a")
			var icon_svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
			var icon_type_svg = document.createElementNS("http://www.w3.org/2000/svg","path")
		
			parentlocation.append(wrapper)
			wrapper.append(row)
			row.append(icon)
			row.append(name)
			name.append(namea)
			icon.append(icon_svg)
			icon_svg.append(icon_type_svg)
		
			wrapper.setAttribute("class","delta-wrapper")
			row.setAttribute("class","delta-row")
			icon.setAttribute("class","delta-icon")
			name.setAttribute("class","delta-name")
			namea.setAttribute("href",href)
			icon_svg.setAttribute("height","16")
			icon_svg.setAttribute("viewBox","0 0 16 16")
			icon_svg.setAttribute("version","1.1")
			icon_svg.setAttribute("width","16")
			icon_svg.setAttribute("role","img")
			icon_type_svg.setAttribute("fill-rule","evenodd")
		
			if (type == "folder") {
				icon.style.width = "16px"
				icon.style.height = "16px"
				namea.setAttribute("onclick","selectDir('"+totalPath+"')")
				icon_svg.setAttribute("class","delta-icon-svg-folder")
				icon_type_svg.setAttribute("d","M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3h-6.5a.25.25 0 01-.2-.1l-.9-1.2c-.33-.44-.85-.7-1.4-.7h-3.5z")
			} else if (type == "file") {
				icon.style.width = "16px"
				icon.style.height = "16px"
				icon_svg.setAttribute("class","delta-icon-svg-file")
				icon_type_svg.setAttribute("d","M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z")
			} else if (type == "return") {
				var rootspan = document.createElementNS("http://www.w3.org/1999/xhtml","span")
				icon.append(rootspan)
				rootspan.setAttribute("class","delta-root")
				rootspan.innerHTML = ".&#8202;."
				icon_svg.style.display = "none"
				rootspan.setAttribute("onclick","returnDir()")
			}
		
			namea.innerHTML = filename
		}

		function DELTA_fetch(search) {
			(json.tree).sort(GetSortOrder("path"));  
			searchbar.value = search
			DELTA_location(search)

			var lastChar = search.substr(-1);
			var rootReturn

			if (lastChar != '/') {
				rootReturn = search + '/';
			} else {
				rootReturn = search
			}

			if(rootReturn !== "docs/") {
				DELTA_generateRow("return","","#")
			}

			for (var item in (json.tree)) {  
				var sortedPaths = ((json.tree)[item].path)
				var sortedTypes = ((json.tree)[item].type)

				if (RegExp(("^"+((search).replace(/\/$/g,""))+"*/").toString()).test(sortedPaths)) {
					if (RegExp('^tree').test(sortedTypes)) {
						var searchProfile = new RegExp((("^"+((search).replace(/\/$/g,""))+"\\/").toString()))
						var currentPathFolders = (sortedPaths.replace(searchProfile, '')).replace(/\/.*/, '')
						var currentPathFolders_RemoveRecursive = (sortedPaths.replace(searchProfile, ''))

						if (currentPathFolders == currentPathFolders_RemoveRecursive) {
							DELTA_generateRow("folder",currentPathFolders,"#",sortedPaths)
						}

					}
				}
			}   

			for (var item in (json.tree)) {
				var sortedPaths = ((json.tree)[item].path)
				var sortedTypes = ((json.tree)[item].type)

				if (RegExp(("^"+((search).replace(/\/$/g,""))+"/*").toString()).test(sortedPaths)) {
					if (RegExp('^blob').test(sortedTypes)) {
							if (RegExp('.md$').test(sortedPaths)) {
								var searchProfile = new RegExp((("^"+((search).replace(/\/$/g,""))+"\\/").toString()))
								var filename = (sortedPaths.replace(searchProfile, '')).replace(/^.*[\\\/]/, '')
								var filename_Recursive = (sortedPaths.replace(searchProfile, '')).replace(/\/.*/g, '')
								var filename_RemoveRecursive = (sortedPaths.replace(searchProfile, ''))

								if (filename_Recursive == (filename_RemoveRecursive)) {
									DELTA_generateRow("file",filename,((website_Domain+sortedPaths).replace(/.md$/,"")))
								}
							}
					}
				}
			} 
		}

		DELTA_fetch(currentPath)
		
		searchbar.addEventListener("keyup", function(event) {
			if (event.keyCode === 13) {
				event.preventDefault();
		
				const delta_content = document.getElementById("delta");
				delta_content.textContent = '';
		
				currentPath = searchbar.value
				DELTA_fetch(currentPath)
			}
		});
	}).catch(function(ex) {
		console.log('parsing failed', ex)
})     

function selectDir(totalPath) {
	DELTA_fetch(totalPath)
	const delta_content = document.getElementById("delta");
	delta_content.textContent = '';
}

function returnDir(totalPath) {
	var lastCharRrn = (searchbar.value).substr(-1);
	var rootReturn

	if (lastCharRrn != '/') {
		rootReturn = searchbar.value + '/';
	} else {
		rootReturn = searchbar.value
	}

	var rootReturn_a = rootReturn.split('/');
	rootReturn = rootReturn.replace(rootReturn_a[rootReturn_a.length-2] + '/', '');

	const delta_content = document.getElementById("delta");
	delta_content.textContent = '';

	searchbar.value = rootReturn
	currentPath = searchbar.value
	DELTA_fetch(currentPath)
}
