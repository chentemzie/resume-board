const RESUME_STORAGE_ITEM = "resumeData";

document.getElementById("resumeInputForm").addEventListener("submit",
	 saveResume);
openTab(null, 'candidate');

function openTab(event, tabName){
	if(event == null){
		document.getElementById("candidateTab").style.display = "block";
		return;
	}

	var i, tabContents, tabLinks;
	tabContents = document.getElementsByClassName("tabcontent");

	Array.prototype.forEach.call(tabContents, (item, i, arr) => {
		item.style.display = "none";
	});
	
	tabLinks = document.getElementsByClassName("tablink");
	Array.prototype.forEach.call(tabLinks, (item, i, arr) => {
		item.className = item.className.replace(" active", "");;
	});

	document.getElementById(tabName + "Tab").style.display = "block";
	event.currentTarget.className += " active";

	switch(tabName){
		case "hr":
			fetchResume(false);
			break;
		case "admin":
			fetchResume(true);
			break;
	}
}

function saveResume(e){
	var id = chance.guid();
	var title = document.getElementById("resumeTitleInput").value;
	
	var personName = document.getElementById("resumePersonNameInput").value;
	var personPhone = document.getElementById("resumePersonPhoneInput").value;
	var personEmail = document.getElementById("resumePersonEmailInput").value;

	var personData = {
		name : personName,
		phone : personPhone,
		email : personEmail
	};

	var city = document.getElementById("resumeCityInput").value;

	var experienceSelect = document.getElementById("resumeExperienceInput");
	var experience = resumeExperienceInput
				.options[experienceSelect.selectedIndex].text;

	var description = document.getElementById("resumeDescInput").value;

	var resume = {
		"id" : id,
		"title" : title,
		"personData" : personData,
		"city" : city,
		"experience" : experience,
		"description" : description
	};

	if(sessionStorage.getItem(RESUME_STORAGE_ITEM) === null){
		var resumeData = [];
		resumeData.push(resume);
		sessionStorage.setItem(RESUME_STORAGE_ITEM, JSON.stringify(resumeData));
	} else{
		var resumeData = JSON.parse(sessionStorage.getItem(RESUME_STORAGE_ITEM));
		resumeData.push(resume);
		sessionStorage.setItem(RESUME_STORAGE_ITEM, JSON.stringify(resumeData));
	}

	document.getElementById("resumeInputForm").reset();
	e.preventDefault();
}

function fetchResume(isAdmin){
	var resumeData = JSON.parse(sessionStorage.getItem(RESUME_STORAGE_ITEM));
	if(!resumeData) return;

	var resumeList = document.getElementById(isAdmin ? 
		"resumeAdminList" : "resumeList");

	resumeList.innerHTML = "";

	for(var i = 0; i < resumeData.length; i++){
		var id = resumeData[i].id;
		var title = resumeData[i].title;
		var personData = resumeData[i].personData;
		var city = resumeData[i].city;
		var experience = resumeData[i].experience;
		var description = resumeData[i].description;

		if(isAdmin){
			resumeList.innerHTML += `<div class="well"> 
			<h6>Resume ID: ${id}</h6>
			<h3>Title: ${title}</h3>
			<p>City: ${city}</p>
			<p>Experience: ${experience}</p>
			<p>Description: ${description}</p>

			<h4>Person's info: <span class="show-info" 
			onclick="showInfo(event, '${personData.name}', 
			'${personData.phone}', '${personData.email}' )">Show info</span></h4>

			<a href="#" class="btn btn-danger" onclick="deleteResume('${id}')">
			Delete</a> 
			</div>`;
		}else{
			resumeList.innerHTML += `<div class="well"> 
			<h3>Title: ${title}</h3>
			<p>City:  ${city} </p>
			<p>Experience: ${experience}</p>
			<p>Description: ${description} </p>
			<h4>Person's info: <span class="show-info" 
			onclick="showInfo(event, '${personData.name}', 
			'${personData.phone}', '${personData.email}')">Show info</span></h4>
			</div>`;
		}
	}
}

function showInfo(event, name, phone, email){
	event.currentTarget.className = "";
	event.currentTarget.innerHTML = 
		`<span>
		<h6>Name: ${name}</h6> 
		<h6>Phone: ${phone}</h6>
		<h6>Email: ${email}</h6>  
		 </span>`;
}

function deleteResume(id){
	var resumeData = JSON.parse(sessionStorage.getItem(RESUME_STORAGE_ITEM));
	var result = resumeData.filter(item => item.id === id)[0];

	if(result == null) return;

	resumeData.splice(resumeData.indexOf(result), 1);
	sessionStorage.setItem(RESUME_STORAGE_ITEM, JSON.stringify(resumeData));

	fetchResume(true);
}