# Job-Tracker-App
A web application designed to help job seekers  efficiently manage and track their job applications. 
Documentation: https://docs.google.com/document/d/1A4rt6yW4gxFfWR4jXBodOiUbWlrSYaBVoyG_jl_yjj8/edit?usp=sharing


## Introduction
This project is to develop a simple web application that tracks job applications for individuals and organizations. The system will allow users to input and manage the details of job applications they have submitted. The app will include a user-friendly UI to track the following: company name, position applied for, application status, and date applied. Users will also be allowed to view a list of those applications and filter by status. The application will use the following technologies: HTML, CSS, JS (React), and Node.js. For storing and retrieving job application data, we will use a lightweight database, either MySQL or MongoDB.

## Client Organization / Business
The client organization is a staffing or human resources firm that helps individuals manage their job applications. They support job seekers by providing a platform that allows them to track and organize their job search. The organization partners with companies to create a more organized experience for job seekers, helping them stay efficient as they search for employment. The business offers consulting services to job seekers and recruiters, guiding them through the application process, from resume submission to interview preparation. They focus on increasing the likelihood of job seekers securing employment by providing tools to better manage their job applications.

## Problem Statement
In the existing system, job seekers struggle to efficiently track their applications. Many use spreadsheets or basic note-taking methods, leading to disorganization and missed opportunities. The lack of a centralized platform that consolidates information about job applications makes it difficult to prioritize applications and monitor progress effectively. The solution? Create a centralized system where job seekers can easily manage and track their applications. The dashboard view will allow for a seamless visualization of the process of each application, and allow the user to reduce the manual work done in the organization of the job search.

## Development Objectives and System Benefits. What goals and objectives will be achieved by the system, what are its benefits?
- Centralized Database- will store all job application information. Reduce the need for tools like Excel spreadsheets or messy handwritten notes.
- User-friendly UI- The System will have an intuitive and clean UI where users can easily view their application status and add/update/ track what they’ve applied to. 
- Another final benefit would be that the system will allow job seekers to easily input and track job applications, including information like company name, position, application date, and status. Thus, managing multiple job applications is made simpler.


## Stakeholders
- Job Seekers - Individuals looking for jobs who use the system for personal use to track their job applications, statuses, and reminders. 
- HR Managers / Recruiters - Can view the job application statuses and analytics. They can track the progress of applicants of their specific hiring company.
- Development Team - our team will design and implement the system. They will also test the system. Responsible for adding new features, fixing bugs and updates.

## System Modules
- Module 1: user authentication module. Handles user registration, login, and user profile management. Functionality: Users can register and log in to their accounts, update their personal information, reset passwords, and manage account settings.
- Module 2: Job application management module- the code module of the application. Allow users to input and track job application details. Functionality includes: adding, deleting, updating job applications. Tracking application statuses, applied, scheduled interview, rejected. Display application details like job position, company and position
- Module 3: Filtering and Sorting Module-  allow users to filter/sort job applications based on parameters: job status, company, date applied. Sort job applications by different attributes (date/status)
- Module 4: Analytics and Dashboard Module: provide a visual summary of job application progress, show the # of applications in various stages (applied, interview scheduled, rejected)
