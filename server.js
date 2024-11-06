/********************************************************************************
 * WEB322 – Assignment 03
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Karanbeer Chanana            Student ID: 147884225        Date: October 15, 2024
 *
 * Published URL: https://web322-a3-l5lxolx76-karanbeerchananas-projects.vercel.app/
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");

projectData
  .initialize()
  .then(() => {
    console.log("Projects initialized successfully.");

    //Home page
    app.get("/", (req, res) => {
      res.render("home");
    });

    //About page
    app.get("/about", (req, res) => {
      res.render("about");
    });

    app.get("/solutions/projects", (req, res) => {
      const sector = req.query.sector;

      if (sector) {
        projectData
          .getProjectsBySector(sector)
          .then((projects) => {
            if (projects.length > 0) {
              res.render("projects", {projects: projects});
            } else {
              res
                .status(404)
                .render("404", {message: `No projects found for sector: ${sector}`});
            }
          })
          .catch((error) => res.status(404).render("404", {message: `No projects found for sector: ${sector}`}));
      } else {
        projectData
          .getAllProjects()
          .then((projects) => res.render("projects", {projects: projects}))
          .catch((error) => res.status(500).send(error));
      }
    });

    app.get("/solutions/projects/:id", (req, res) => {
      const projectId = parseInt(req.params.id);

      projectData
        .getProjectById(projectId)
        .then((project) => {
          if (project) {            
            res.render("project", {project: project});
          } else {
            res.status(404).render("404", {message: "Unable to find requested project"});
          }
        })
        .catch((error) => res.render("404", {message: "Unable to find requested project"}));
    });

    // 404 Error Page
    app.use((req, res) => {
      res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize projects:", error);
  });
