-- Insert data into the 'department' table
INSERT INTO department (name) 
VALUES ("Human Resource"),
       ("Legal"),
       ("Finance"),
       ("Security"),
       ("Research & Development"),
       ("Informational Technology"),
       ("Marketing"),
       ("Sales"),
       ("Infrastructure");

-- Insert data into the 'role' table with correct department_id values
INSERT INTO role (title, salary, department_id) 
VALUES ("HR Specialist", 61570.00, 1), -- "Human Resource"
       ("Legal Consultant", 108986.00, 2), -- "Legal"
       ("Investment Manager", 96192.00, 3), -- "Finance"
       ("Security Engineer", 103799.00, 4), -- "Security"
       ("Lead Data Analyst", 79545.00, 5), -- "Research & Development"
       ("Support Technician", 50329.00, 6), -- "Informational Technology"
       ("Marketing Director", 207504.00, 7), -- "Marketing"
       ("Outdoor Sales Rep", 60705.00, 8), -- "Sales"
       ("Administrator", 89711.00, 9), -- "Infrastructure"
       ("Secretary", 24457.00, 9), -- "Infrastructure"
       ("R&D Engineer", 80562.00, 5), -- "Research & Development" 
       ("Junior Legal Counsel", 82117.00, 2); -- "Legal"

-- Insert data into the 'employee' table 
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
  ("Allie", "Grator", 1, NULL), -- No Manager
  ("Jayce", "Walker", 2, NULL), -- No Manager
  ("Franklin", "Stine", 3, 1), -- Allie Grator
  ("Hugh", "Jaqas", 4, NULL), -- No Manager
  ("Jacqueline", "Hyde", 5, NULL), -- No Manager
  ("Dinah", "Myte", 6, 4), -- Hugh Jaqas
  ("Helen", "Hyghwater", 7, 1), -- Allie Grator
  ("Jerry", "Rafe", 8, 7), -- Helen Hyghwater
  ("Roz", "Terr", 9, NULL), -- No Manager
  ("Darryl B.", "Morticum", 10, 9), -- Roz Terr
  ("Dei Z.", "Aster", 11, NULL), -- No Manager 
  ("Justin", "Kase", 12, 2); -- Jayce Walker