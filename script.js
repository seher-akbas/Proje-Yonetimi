document.addEventListener("DOMContentLoaded", function () {
    const projectListButton = document.querySelector("#projectListButton");
    const projectList = document.querySelector("#projectList");
    const add = document.querySelector("#add");

    let isProjectListed = false;

    projectListButton.addEventListener("click", async (event) => {
        if (!isProjectListed) {
            await getProjectToUI();
            isProjectListed = true;
        }
    });

    async function getProjectToUI() {
        await fetch("project.json")
            .then(response => response.json())
            .then(data => {
                for (let i in data) {
                    if (data.hasOwnProperty(i)) {
                        const projectInfo = data[i];
                        const li = document.createElement("li");
                        li.className = "list-group-item my-3";
                        li.dataset.projectId = projectInfo.projeID;
                        li.dataset.projectHour = projectInfo.ProjeSaat;

                        const detailsButton = document.createElement("button");
                        detailsButton.textContent = "Proje Detaylarını Görüntüle";
                        detailsButton.className = "btn btn-primary mx-3";

                        li.textContent = `Proje ID: ${projectInfo.projeID}, Proje Adı: ${projectInfo.projeAdi}, Proje Çalıma Saati: ${projectInfo.ProjeSaat}`;

                        projectList.appendChild(li);
                        li.appendChild(detailsButton);

                        detailsButton.addEventListener("click", (event) => {
                            getPersonelInfToUI(projectInfo.projeID, projectInfo.ProjeSaat);
                        });
                    }
                }
            });
    }

    async function getPersonelInfToUI(projectID, projectHour) {
        await fetch("personal.json")
            .then(response => response.json())
            .then(data => {
                const projectList = document.querySelector(`li[data-project-id='${projectID}']`);
                const subList = document.createElement("ul");
                let personCount = 0;

                for (let i in data) {
                    if (data.hasOwnProperty(i)) {
                        const personalInfo = data[i];
                        if (personalInfo.projectID === projectID) {
                            personCount++;
                            const li = document.createElement("li");
                            li.textContent = `Name: ${personalInfo.name}, Surname: ${personalInfo.surname}, Project ID: ${personalInfo.projectID} hours :${projectHour / personCount}`;

                            const subtaskButton = document.createElement("button");
                            subtaskButton.textContent = "Görev Ekle";
                            subtaskButton.className = "btn btn-primary mx-3 my-3";

                            li.appendChild(subtaskButton);
                            subList.appendChild(li);
                            subtaskButton.addEventListener("click", (event) => {
                                subtask(li, projectHour, personCount);
                            });
                        }
                    }
                }
                if (projectList) {
                    projectList.appendChild(subList);
                }
            });
    }

    function subtask(li, hour, count) {
        const task = prompt("Lütfen eklemek istediğiniz görevi giriniz:");
        const taskHourPromise = new Promise((resolve, reject) => {
            const taskHour = parseFloat(prompt("Lütfen göreve ayrılan saat miktarını giriniz:"));
            if (!isNaN(taskHour) && taskHour > 0) {
                if (taskHour > hour) {
                    reject("Girdiğiniz saat miktarı, projenin toplam saatinin üzerinde. Lütfen geçerli bir saat miktarı giriniz.");
                } else {
                    resolve(taskHour);
                }
            } else {
                reject("Geçerli bir saat miktarı giriniz.");
            }
        });

        taskHourPromise.then(taskHour => {
            const subList = li.querySelector("ul") || document.createElement("ul");
            const taskHourPerPerson = hour / count;
            const subTaskHourPerPerson = taskHourPerPerson / subList.children.length;
            const taskLi = document.createElement("li");
            taskLi.textContent = `${task} :proje saati ${taskHour}`;
            subList.appendChild(taskLi);
            if (!li.contains(subList)) {
                li.appendChild(subList);
            }
        }).catch(error => {
            alert(error);
        });
    }

    add.addEventListener("click", (event) => {
        addNewProjectToUI();
    });

    async function addNewProjectToUI() {
        const projectId = prompt("Proje ID'sini giriniz:");
        const projectName = prompt("Proje adını giriniz:");
        const projectHour = prompt("Proje çalışma saatini giriniz:");

        if (projectId && projectName && projectHour) {
            const li = document.createElement("li");
            li.className = "list-group-item my-3";
            li.dataset.projectId = projectId;
            li.dataset.projectHour = projectHour;

            const detailsButton = document.createElement("button");
            detailsButton.textContent = "Proje Detaylarını Görüntüle";
            detailsButton.className = "btn btn-primary mx-3";

            li.textContent = `Proje ID: ${projectId}, Proje Adı: ${projectName}, Proje Çalıma Saati: ${projectHour}`;

            projectList.appendChild(li);
            li.appendChild(detailsButton);

            detailsButton.addEventListener("click", (event) => {
                getPersonelInfToUI(projectId, projectHour);
            });
        } else {
            alert("Lütfen geçerli bir proje ID'si, proje adı ve proje çalışma saati giriniz.");
        }
    }

    personal.addEventListener("click", (event) => {
        addPersonnel();
    });
    
    async function addPersonnel() {
        const projectID = prompt("Personeli eklemek istediğiniz proje ID'sini giriniz:");
        if (projectID) {
            const projectList = document.querySelector(`li[data-project-id='${projectID}']`);
            if (projectList) {
                const name = prompt("Personelin adını giriniz:");
                const surname = prompt("Personelin soyadını giriniz:");
                const personCount = projectList.querySelectorAll("li").length + 1;
    
                const li = document.createElement("li");
                li.textContent = `Name: ${name}, Surname: ${surname}, Project ID: ${projectID} hours :${projectHour / personCount}`;
    
                const subtaskButton = document.createElement("button");
                subtaskButton.textContent = "Görev Ekle";
                subtaskButton.className = "btn btn-primary mx-3 my-3";
    
                li.appendChild(subtaskButton);
    
                subtaskButton.addEventListener("click", (event) => {
                    subtask(li, projectHour, personCount);
                });
    
                const subList = projectList.querySelector("ul") || document.createElement("ul");
                subList.appendChild(li);
                projectList.appendChild(subList);
            } else {
                alert("Girdiğiniz proje ID'sine sahip bir proje bulunamadı.");
            }
        } else {
            alert("Lütfen bir proje ID'si giriniz.");
        }
    }
    async function removeProject() {
        const projectIDToDelete = prompt("Silinecek proje ID'sini giriniz:");
        if (projectIDToDelete) {
            const projectToDelete = document.querySelector(`li[data-project-id='${projectIDToDelete}']`);
            if (projectToDelete) {
                projectToDelete.remove();
                alert("Proje başarıyla silindi.");
            } else {
                alert("Girdiğiniz proje ID'sine sahip bir proje bulunamadı.");
            }
        } else {
            alert("Lütfen silinecek proje ID'sini giriniz.");
        }
    }


});
