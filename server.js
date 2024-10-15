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
 * Published URL: https://assignment3-navy.vercel.app/
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");

projectData
  .initialize()
  .then(() => {
    console.log("Projects initialized successfully.");

    //Home page
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/home.html"));
    });

    //About page
    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/about.html"));
    });

    app.get("/solutions/projects", (req, res) => {
      const sector = req.query.sector;

      if (sector) {
        projectData
          .getProjectsBySector(sector)
          .then((projects) => {
            if (projects.length > 0) {
              res.json(projects);
            } else {
              res
                .status(404)
                .send("No projects found for the specified sector.");
            }
          })
          .catch((error) => res.status(404).send(error));
      } else {
        projectData
          .getAllProjects()
          .then((projects) => res.json(projects))
          .catch((error) => res.status(500).send(error));
      }
    });

    app.get("/solutions/projects/:id", (req, res) => {
      const projectId = parseInt(req.params.id);

      projectData
        .getProjectById(projectId)
        .then((project) => {
          if (project) {
            res.json(project);
          } else {
            res.status(404).send("Project not found.");
          }
        })
        .catch((error) => res.status(404).send(error));
    });

    // 404 Error Page
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize projects:", error);
  });
