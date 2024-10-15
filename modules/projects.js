const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projectData.forEach(project => {
                const sector = sectorData.find(sector => sector.id === project.sector_id);
                projects.push({
                    ...project,
                    sector: sector ? sector.sector_name : "Unknown"
                });
            });
            resolve(); 
        } catch (error) {
            reject("Error initializing projects: " + error.message);
        }
    });
}

function getAllProjects() {
    return new Promise((resolve) => {
        resolve(projects);
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const project = projects.find(project => project.id === projectId);
        if (project) {
            resolve(project);
        } else {
            reject("Unable to find requested project");
        }
    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        if (typeof sector !== 'string') {
            return reject("Sector must be a string");
        }

        const filteredProjects = projects.filter(project =>
            project.sector && typeof project.sector === 'string' &&
            project.sector.toLowerCase().includes(sector.toLowerCase())
        );

        if (filteredProjects.length > 0) {
            resolve(filteredProjects);
        } else {
            reject("Unable to find requested projects");
        }
    });
}

initialize()
    .then(() => {
        console.log("Projects initialized.");

        return getAllProjects(); 
    })
    .then(projects => {
        console.log("All Projects:", projects);
        
        return getProjectById(9); 
    })
    .then(project => {
        console.log("Project 9:", project);
        
        return getProjectsBySector("Electricity"); 
    })
    .then(sectorProjects => {
        console.log("Projects in the Electricity sector:", sectorProjects);
    })
    .catch(error => {
        console.error("Error:", error);
    });

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };
